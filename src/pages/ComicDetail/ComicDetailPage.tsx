import { useParams, useNavigate, Link } from 'react-router-dom';
import { useComicDetail } from '../../hooks/useApi';
import { useFavorites } from '../../hooks/useFavorites';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { Loading } from '../../components/common/Loading';
import { LazyImage } from '../../components/common/LazyImage';
import { Heart, Play, User, Tag, BookOpen, ChevronRight, Calendar } from 'lucide-react';
import { formatTimeAgo, getImageUrl } from '../../utils/helpers';

export function ComicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useComicDetail(slug);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getLastReadChapter } = useReadingHistory();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading size="lg" text="Đang tải thông tin truyện..." />
      </div>
    );
  }

  if (error || !data?.data?.item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Không tìm thấy truyện
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error || 'Truyện bạn tìm kiếm không tồn tại'}
          </p>
        </div>
      </div>
    );
  }

  const comic = data.data.item;
  const isComicFavorite = isFavorite(comic._id);
  const lastRead = getLastReadChapter(comic.slug);

  // Get actual chapter list from server_data
  const chapterList = comic.chapters?.[0]?.server_data || [];

  const handleFavoriteClick = () => {
    toggleFavorite(comic);
  };

  const handleReadClick = (chapterNumber?: number) => {
    const targetChapter = chapterNumber || lastRead?.chapterNumber || 1;
    navigate(`/comic/${comic.slug}/chapter/${targetChapter}`);
  };

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
          <li className="text-gray-900 dark:text-white font-semibold truncate">
            {comic.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comic Cover & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div className="relative aspect-[2/3] overflow-hidden">
                <LazyImage
                  src={getImageUrl(comic.thumb_url)}
                  alt={comic.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleReadClick()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <Play className="w-5 h-5" fill="white" />
                    <span>
                      {lastRead ? `Tiếp tục đọc Chapter ${lastRead.chapterNumber}` : 'Bắt đầu đọc'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleFavoriteClick}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-105 ${
                      isComicFavorite
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/50'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:shadow-lg'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isComicFavorite ? 'fill-current' : ''}`} />
                    <span>{isComicFavorite ? 'Đã yêu thích' : 'Thêm yêu thích'}</span>
                  </button>
                </div>

                {/* Comic Stats */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Số chương</div>
                      <div className="font-semibold">{chapterList.length} chương</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Cập nhật</div>
                      <div className="font-semibold">{formatTimeAgo(comic.updatedAt)}</div>
                    </div>
                  </div>

                  <div className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl ${
                    comic.status === 'completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {comic.status === 'completed' ? '✓ Hoàn thành' : '⟳ Đang cập nhật'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comic Info & Chapters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Meta */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-up">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {comic.name}
            </h1>
            
            {comic.origin_name && comic.origin_name.length > 0 && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {comic.origin_name.join(', ')}
              </p>
            )}

            {/* Author */}
            {comic.author && comic.author.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tác giả: {comic.author.join(', ')}
                </span>
              </div>
            )}

            {/* Categories */}
            {comic.category && comic.category.length > 0 && (
              <div className="flex items-start gap-3 mb-4">
                <Tag className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {comic.category.map((cat, index) => (
                    <span
                      key={cat.id || index}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:shadow-md hover:scale-105 transition-all cursor-pointer"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {comic.content && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Nội dung
              </h3>
              <div 
                className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: comic.content }}
              />
            </div>
          )}

          {/* Chapter List */}
          {chapterList.length > 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  Danh sách chương
                  <span className="ml-2 px-3 py-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg">
                    {chapterList.length}
                  </span>
                </h3>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {chapterList.map((chapter, index) => (
                    <button
                      key={`${chapter.filename}-${index}`}
                      onClick={() => handleReadClick(index + 1)}
                      className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-lg group-hover:scale-110 transition-transform">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                Chapter {chapter.chapter_name}
                              </h4>
                              {chapter.chapter_title && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">
                                  {chapter.chapter_title}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lastRead?.chapterNumber === index + 1 && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg">
                              Đang đọc
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Chưa có chương nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Truyện này chưa có chương để đọc. Vui lòng quay lại sau!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComicDetailPage;