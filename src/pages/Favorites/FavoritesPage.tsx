import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { Heart, Trash2, Grid, List, ChevronRight, Sparkles, Clock, Zap } from 'lucide-react';
import { LazyImage } from '../../components/common/LazyImage';
import { getImageUrl } from '../../utils/helpers';
import { formatTimeAgo } from '../../utils/helpers';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [sortedFavorites, setSortedFavorites] = useState(favorites);

  // Sort favorites by update time
  useEffect(() => {
    const sorted = [...favorites].sort((a, b) => {
      const timeA = a.chapterUpdatedAt || a.updatedAt || a.addedAt;
      const timeB = b.chapterUpdatedAt || b.updatedAt || b.addedAt;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });
    setSortedFavorites(sorted);
  }, [favorites]);

  // Debug
  console.log('Favorites count:', favorites.length);
  console.log('Favorites data:', favorites);

  const handleComicClick = (slug: string) => {
    navigate(`/comic/${slug}`);
  };

  const handleRemove = (e: React.MouseEvent, comicId: string) => {
    e.stopPropagation();
    removeFavorite(comicId);
  };

  const handleClearAll = () => {
    clearFavorites();
    setShowClearConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 dark:text-white font-semibold">
              Yêu thích
            </li>
          </ol>
        </nav>

        {/* Empty State */}
        <div className="max-w-2xl mx-auto text-center py-20 animate-scale-in">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
            <Heart className="w-32 h-32 text-gray-300 dark:text-gray-700 relative" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Chưa có truyện yêu thích
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
            Bạn chưa thêm truyện nào vào danh sách yêu thích.<br />
            Hãy khám phá và lưu lại những bộ truyện yêu thích của bạn!
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Khám phá ngay
            </Link>
            <Link
              to="/categories"
              className="px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Xem thể loại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 animate-fade-in">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Trang chủ
            </Link>
          </li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <li className="text-gray-900 dark:text-white font-semibold">
            Yêu thích
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 animate-slide-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Truyện Yêu Thích
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-16">
            <span className="font-semibold text-pink-600 dark:text-pink-400">{favorites.length}</span> truyện
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Dạng lưới"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Dạng danh sách"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Clear All Button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105 transition-all duration-200"
          >
            <Trash2 className="w-5 h-5" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      </div>

      {/* Comics Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {sortedFavorites.map((comic) => (
            <div 
              key={comic._id}
              onClick={() => handleComicClick(comic.slug)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-110 hover:-translate-y-2 animate-fade-in"
            >
              {/* Comic Cover */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
                <LazyImage
                  src={getImageUrl(comic.thumbUrl)}
                  alt={comic.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Remove from Favorites Button (Heart) */}
                <button
                  onClick={(e) => handleRemove(e, comic._id)}
                  className="absolute top-3 right-3 p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
                  title="Xóa khỏi yêu thích"
                >
                  <Heart className="w-4 h-4 text-white fill-current" />
                </button>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
                    comic.status === 'completed'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-blue-500/90 text-white'
                  }`}>
                    {comic.status === 'completed' ? 'Full' : 'Đang ra'}
                  </span>
                </div>
                
                {/* Latest Chapter Info on Hover */}
                {comic.latestChapter && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-xl border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/80 mb-0.5">Chapter mới nhất</p>
                          <p className="text-sm font-bold text-white truncate">
                            Chương {comic.latestChapter}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comic Info */}
              <div className="p-4 space-y-2.5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 min-h-[4rem]" title={comic.name}>
                  {comic.name}
                </h3>
                
                {/* Latest Chapter Badge - Always Visible */}
                {comic.latestChapter && (
                  <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex-shrink-0 p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                        Chapter {comic.latestChapter}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Categories */}
                {comic.category && comic.category.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {comic.category.slice(0, 2).map((cat, index) => (
                      <span 
                        key={cat.id || `cat-${index}`}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {comic.category.length > 2 && (
                      <span className="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                        +{comic.category.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs pt-1">
                  {comic.chapterUpdatedAt && (
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{formatTimeAgo(comic.chapterUpdatedAt)}</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    comic.status === 'completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {comic.status === 'completed' ? 'Full' : 'Đang ra'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFavorites.map((comic) => (
            <div
              key={comic._id}
              onClick={() => handleComicClick(comic.slug)}
              className="group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-all duration-200 animate-fade-in"
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                  <LazyImage
                    src={getImageUrl(comic.thumbUrl)}
                    alt={comic.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {comic.name}
                      </h3>
                      
                      {/* Latest Chapter Badge */}
                      {comic.latestChapter && (
                        <div className="mb-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold shadow-md">
                            <Zap className="w-4 h-4" />
                            <span>Chapter {comic.latestChapter}</span>
                            {comic.chapterUpdatedAt && (
                              <>
                                <span className="text-white/60">•</span>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatTimeAgo(comic.chapterUpdatedAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {comic.category && comic.category.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {comic.category.map((cat, index) => (
                            <span
                              key={cat.id || `cat-${index}`}
                              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-lg font-semibold ${
                          comic.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        }`}>
                          {comic.status === 'completed' ? 'Hoàn thành' : 'Đang ra'}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          <span>Thêm: {formatDate(comic.addedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleRemove(e, comic._id)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-110 transition-all duration-200"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
              <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              Xóa tất cả yêu thích?
            </h2>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa tất cả {favorites.length} truyện khỏi danh sách yêu thích? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
