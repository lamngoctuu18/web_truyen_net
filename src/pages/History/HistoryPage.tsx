import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, BookOpen, Search, Calendar, Filter, Grid, List } from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { LazyImage } from '../../components/common/LazyImage';
import { getImageUrl, formatTimeAgo } from '../../utils/helpers';
import type { ReadingHistoryItem } from '../../types/user.types';

export function HistoryPage() {
  const { history, clearHistory, removeFromHistory } = useReadingHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showClearModal, setShowClearModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter history based on search and time period
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.comicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.chapterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const itemDate = new Date(item.readAt);
    const now = new Date();
    
    switch (filterPeriod) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      default:
        return true;
    }
  });

  // Group by comic for better organization
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    const existing = acc.find(group => group.comicSlug === item.comicSlug);
    if (existing) {
      existing.chapters.push(item);
      // Keep the latest read time
      if (new Date(item.readAt) > new Date(existing.latestRead)) {
        existing.latestRead = item.readAt;
      }
    } else {
      acc.push({
        comicSlug: item.comicSlug,
        comicName: item.comicName,
        thumbUrl: item.thumbUrl,
        latestRead: item.readAt,
        chapters: [item]
      });
    }
    return acc;
  }, [] as Array<{
    comicSlug: string;
    comicName: string;
    thumbUrl: string;
    latestRead: string;
    chapters: ReadingHistoryItem[];
  }>);

  // Sort by latest read
  groupedHistory.sort((a, b) => new Date(b.latestRead).getTime() - new Date(a.latestRead).getTime());

  const handleClearHistory = () => {
    clearHistory();
    setShowClearModal(false);
  };

  const handleRemoveComic = (comicSlug: string) => {
    removeFromHistory(comicSlug);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Lịch Sử Đọc Truyện
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Theo dõi những truyện bạn đã đọc và tiếp tục từ nơi đã dừng
            </p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tổng truyện</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{groupedHistory.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chương đã đọc</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lần đọc gần nhất</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {history.length > 0 ? formatTimeAgo(history[0].readAt) : 'Chưa có'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm truyện hoặc chương..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Time Filter */}
            <div className="relative">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value as any)}
                className="appearance-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
            <Clock className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử đọc'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? 'Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc thời gian'
              : 'Bắt đầu đọc truyện để xem lịch sử của bạn xuất hiện ở đây'
            }
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Xóa tìm kiếm
            </button>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
            >
              <BookOpen className="w-5 h-5" />
              Khám phá truyện
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {groupedHistory.map((group) => (
            <div
              key={group.comicSlug}
              className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] animate-fade-in ${
                viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'
              }`}
            >
              {/* Comic Image */}
              <div className={viewMode === 'list' ? 'flex-shrink-0 w-24 h-32' : 'aspect-[3/4] relative'}>
                <LazyImage
                  src={getImageUrl(group.thumbUrl)}
                  alt={group.comicName}
                  className="w-full h-full object-cover rounded-lg"
                />
                {viewMode === 'grid' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                )}
              </div>

              {/* Comic Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                <Link
                  to={`/comic/${group.comicSlug}`}
                  className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <h3 className={`font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-base'
                  }`}>
                    {group.comicName}
                  </h3>
                </Link>

                {/* Latest Chapters */}
                <div className="space-y-2 mb-3">
                  {group.chapters.slice(0, viewMode === 'list' ? 3 : 2).map((chapter) => (
                    <Link
                      key={`${chapter.comicSlug}-${chapter.chapterNumber}`}
                      to={`/comic/${chapter.comicSlug}/chapter/${chapter.chapterNumber}`}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                        {chapter.chapterName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(chapter.readAt)}
                      </span>
                    </Link>
                  ))}
                  {group.chapters.length > (viewMode === 'list' ? 3 : 2) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{group.chapters.length - (viewMode === 'list' ? 3 : 2)} chương khác
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {group.chapters.length} chương
                  </span>
                  <button
                    onClick={() => handleRemoveComic(group.comicSlug)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Xóa khỏi lịch sử"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear History Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Xóa tất cả lịch sử?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hành động này sẽ xóa toàn bộ lịch sử đọc truyện của bạn và không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
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

export default HistoryPage;