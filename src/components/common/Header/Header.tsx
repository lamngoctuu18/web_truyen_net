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
    <header className="sticky top-0 z-50 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-700/50 dark:border-slate-800/50 shadow-xl transition-all duration-300">
      <div className="w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleMenu}
              className="md:hidden p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group">
              <div className="relative">
                <Book className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300" />
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                TruyenNet
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md group overflow-hidden"
            >
              <span className="relative z-10">Trang chủ</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link 
              to="/categories" 
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md group overflow-hidden"
            >
              <span className="relative z-10">Thể loại</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link 
              to="/favorites" 
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md group overflow-visible mr-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:fill-current transition-all duration-200" />
                Yêu thích
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-xl"></span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] lg:min-w-[22px] h-5 lg:h-6 px-1.5 lg:px-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg animate-pulse border-2 border-white dark:border-gray-900">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
            <Link 
              to="/history" 
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-md group overflow-hidden"
            >
              <span className="relative z-10">Lịch sử</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
          </nav>

          {/* Search & Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Search Toggle */}
            <button
              onClick={toggleSearch}
              className="p-1.5 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {state.ui.isSearchOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-1.5 sm:p-2.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {state.ui.theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile & Desktop) */}
        {state.ui.isSearchOpen && (
          <div className="pb-3 sm:pb-4 px-3 sm:px-6 animate-fade-in" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
                <input
                  type="text"
                  placeholder="Tìm kiếm truyện, tác giả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                  className="relative w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-12 pr-20 sm:pr-24 text-sm sm:text-base text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-lg"
                  autoFocus
                />
                <Search className="absolute left-2.5 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-14 sm:right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-all"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-3 right-3 sm:left-6 sm:right-6 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[400px] overflow-y-auto animate-fade-in">
                {/* Loading State */}
                {loadingSuggestions && (
                  <div className="p-3 sm:p-4 flex items-center justify-center gap-3">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-spin" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Đang tìm kiếm...</span>
                  </div>
                )}

                {/* Comic Suggestions */}
                {!loadingSuggestions && suggestions.length > 0 && (
                  <div className="p-2 sm:p-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      {suggestions.map((comic) => (
                        <button
                          key={comic._id}
                          onClick={() => handleComicClick(comic)}
                          className="w-full flex items-center gap-2.5 sm:gap-3 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-lg sm:rounded-xl transition-all duration-200 group active:scale-98"
                        >
                          <div className="w-8 h-11 sm:w-10 sm:h-14 flex-shrink-0 rounded-md sm:rounded-lg overflow-hidden shadow-md">
                            <LazyImage
                              src={getImageUrl(comic.thumb_url)}
                              alt={comic.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {comic.name}
                            </h4>
                            {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Chapter {comic.chaptersLatest[0].chapter_name}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-medium ${
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
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all active:scale-98"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loadingSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
                  <div className="p-3 sm:p-4 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in shadow-2xl">
          <nav className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl font-medium transition-all duration-200 active:scale-98"
              onClick={toggleMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <span className="text-xl">🏠</span>
              </div>
              <span className="flex-1">Trang chủ</span>
            </Link>
            
            <Link 
              to="/categories" 
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl font-medium transition-all duration-200 active:scale-98"
              onClick={toggleMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <span className="text-xl">📚</span>
              </div>
              <span className="flex-1">Thể loại</span>
            </Link>
            
            <Link 
              to="/favorites" 
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 dark:hover:from-pink-900/20 dark:hover:to-red-900/20 rounded-xl font-medium transition-all duration-200 active:scale-98"
              onClick={toggleMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl shadow-lg relative">
                <span className="text-xl">💖</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full border-2 border-white dark:border-gray-900 shadow-lg">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </div>
              <span className="flex-1">Yêu thích</span>
              {count > 0 && (
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-bold rounded-lg">
                  {count}
                </span>
              )}
            </Link>
            
            <Link 
              to="/history" 
              className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl font-medium transition-all duration-200 active:scale-98"
              onClick={toggleMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <span className="text-xl">📖</span>
              </div>
              <span className="flex-1">Lịch sử</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;