import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Menu, Moon, Sun, Book, Heart, Loader2 } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { useFavorites } from '../../../hooks/useFavorites';
import type { Comic } from '../../../types/comic.types';
import { getImageUrl } from '../../../utils/helpers';
import { LazyImage } from '../LazyImage';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { state, toggleMenu, toggleSearch, setTheme } = useApp();
  const { count } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Comic[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.trim().length >= 2 && state.ui.isSearchOpen) {
      setLoadingSuggestions(true);
      setShowSuggestions(true);
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://otruyenapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`
          );
          const result = await response.json();
          if (result.status === 'success' && result.data?.items) {
            setSuggestions(result.data.items.slice(0, 5));
          }
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, state.ui.isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
      setShowSuggestions(false);
      toggleSearch();
    }
  };

  const handleComicClick = (comic: Comic) => {
    navigate(`/comic/${comic.slug}`);
    setShowSuggestions(false);
    setSearchQuery('');
    toggleSearch();
  };

  const handleThemeToggle = () => {
    const newTheme = state.ui.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Book className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110 group-hover:rotate-6" />
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                TruyenNet
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md"
            >
              Trang chủ
            </Link>
            <Link 
              to="/categories" 
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md"
            >
              Thể loại
            </Link>
            <Link 
              to="/favorites" 
              className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md group"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 group-hover:fill-current transition-all" />
                Yêu thích
              </span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <Link 
              to="/history" 
              className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md"
            >
              Lịch sử
            </Link>
          </nav>

          {/* Search & Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <button
              onClick={toggleSearch}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {state.ui.isSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {state.ui.theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile & Desktop) */}
        {state.ui.isSearchOpen && (
          <div className="pb-4 px-4 animate-fade-in" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
                <input
                  type="text"
                  placeholder="Tìm kiếm truyện, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  className="relative w-full px-4 py-3 pl-12 pr-24 text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-lg"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-4 right-4 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {/* Loading State */}
                {loadingSuggestions && (
                  <div className="p-4 flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Đang tìm kiếm...</span>
                  </div>
                )}

                {/* Comic Suggestions */}
                {!loadingSuggestions && suggestions.length > 0 && (
                  <div className="p-3">
                    <div className="space-y-2">
                      {suggestions.map((comic) => (
                        <button
                          key={comic._id}
                          onClick={() => handleComicClick(comic)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-10 h-14 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                            <LazyImage
                              src={getImageUrl(comic.thumb_url)}
                              alt={comic.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {comic.name}
                            </h4>
                            {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Chapter {comic.chaptersLatest[0].chapter_name}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                              comic.status === 'completed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            }`}>
                              {comic.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loadingSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Không tìm thấy kết quả cho "<span className="font-semibold">{searchQuery}</span>"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {state.ui.isMenuOpen && (
        <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            <Link 
              to="/" 
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl font-medium transition-all duration-200"
            >
              Trang chủ
            </Link>
            <Link 
              to="/categories" 
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl font-medium transition-all duration-200"
            >
              Thể loại
            </Link>
            <Link 
              to="/favorites" 
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl font-medium transition-all duration-200"
            >
              Yêu thích
            </Link>
            <Link 
              to="/history" 
              className="block px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl font-medium transition-all duration-200"
            >
              Lịch sử
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;