import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSearchComics } from '../../hooks/useApi';
import { ComicGrid } from '../../components/comic/ComicGrid';
import { Search, TrendingUp, Sparkles, X, Loader2 } from 'lucide-react';
import type { Comic } from '../../types/comic.types';
import { getImageUrl } from '../../utils/helpers';
import { LazyImage } from '../../components/common/LazyImage';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Comic[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q') || '';
  const { data, loading, error } = useSearchComics({
    q: searchQuery,
    page: currentPage,
  });

  // Popular search suggestions
  const popularSearches = [
    'One Piece', 'Naruto', 'Conan', 'Dragon Ball', 
    'Attack on Titan', 'Demon Slayer', 'My Hero Academia'
  ];

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length >= 2) {
      setLoadingSuggestions(true);
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://otruyenapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(query.trim())}`
          );
          const result = await response.json();
          if (result.status === 'success' && result.data?.items) {
            setSuggestions(result.data.items.slice(0, 5)); // Lấy 5 kết quả đầu tiên
          }
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setSuggestions([]);
        } finally {
          setLoadingSuggestions(false);
        }
      }, 500); // Debounce 500ms
    } else {
      setSuggestions([]);
      setLoadingSuggestions(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setCurrentPage(1);
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchParams({ q: suggestion });
    setCurrentPage(1);
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleComicClick = (comic: Comic) => {
    navigate(`/comic/${comic.slug}`);
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchParams({});
    setCurrentPage(1);
    setSuggestions([]);
  };

  const handleLoadMore = () => {
    const currentPg = data?.data?.params?.pagination?.currentPage ?? 0;
    const pagination = data?.data?.params?.pagination;
    const maxPg = pagination 
      ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
      : 0;
    if (currentPg < maxPg) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-12 animate-fade-in">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{ lineHeight: '2' }}>
                Tìm Kiếm Truyện
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300" style={{ lineHeight: '2' }}>
            Khám phá hàng ngàn bộ truyện tranh yêu thích của bạn
          </p>
        </div>

        {/* Search Box */}
        <div className="relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <input
                type="text"
                placeholder="Nhập tên truyện, tác giả hoặc từ khóa..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="w-full px-6 py-4 pl-14 pr-32 text-lg text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-200"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-scale-in max-h-[500px] overflow-y-auto">
              {/* Loading State */}
              {loadingSuggestions && (
                <div className="p-6 flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Đang tìm kiếm...</span>
                </div>
              )}

              {/* Comic Suggestions */}
              {!loadingSuggestions && suggestions.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Kết quả gợi ý
                    </span>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((comic) => (
                      <button
                        key={comic._id}
                        onClick={() => handleComicClick(comic)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
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
                </div>
              )}

              {/* Popular Searches - Show when no query or no suggestions */}
              {!loadingSuggestions && !searchQuery && suggestions.length === 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tìm kiếm phổ biến
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-all duration-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loadingSuggestions && query.trim().length >= 2 && suggestions.length === 0 && !searchQuery && (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Không tìm thấy kết quả cho "<span className="font-semibold">{query}</span>"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Kết quả cho: <span className="text-blue-600 dark:text-blue-400">"{searchQuery}"</span>
                </h2>
                {data?.data?.params?.pagination && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Tìm thấy <span className="font-semibold text-blue-600 dark:text-blue-400">{data.data.params.pagination.totalItems}</span> truyện
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-200"
            >
              Xóa tìm kiếm
            </button>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {searchQuery ? (
        <ComicGrid
          comics={data?.data?.items || []}
          loading={loading}
          error={error}
          onComicClick={(comic) => {
            window.location.href = `/comic/${comic.slug}`;
          }}
          onLoadMore={(() => {
            const pagination = data?.data?.params?.pagination;
            const currentPg = pagination?.currentPage ?? 0;
            const maxPg = pagination 
              ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
              : 0;
            return currentPg < maxPg ? handleLoadMore : undefined;
          })()}
          hasMore={(() => {
            const pagination = data?.data?.params?.pagination;
            const currentPg = pagination?.currentPage ?? 0;
            const maxPg = pagination 
              ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
              : 0;
            return currentPg < maxPg;
          })()}
          emptyMessage="Không tìm thấy truyện nào phù hợp"
        />
      ) : (
        <div className="text-center py-20 animate-scale-in">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl flex items-center justify-center border-4 border-blue-100 dark:border-blue-800">
              <Search className="w-16 h-16 text-blue-500" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Tìm kiếm truyện yêu thích
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto" style={{ lineHeight: '2' }}>
            Sử dụng thanh tìm kiếm ở trên hoặc chọn từ các gợi ý phổ biến để khám phá truyện mới
          </p>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Trang chủ
            </Link>
            <Link
              to="/categories"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Thể loại
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;