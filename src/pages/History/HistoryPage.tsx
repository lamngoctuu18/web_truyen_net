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

  // Sort chapters inside each comic by latest read time
  groupedHistory.forEach(group => {
    group.chapters.sort((a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime());
  });

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
          {groupedHistory.map((group) => {
            const latestChapter = group.chapters[0];
            const chapterLimit = viewMode === 'list' ? 3 : 2;
            const extraChapters = Math.max(group.chapters.length - chapterLimit, 0);

            const cardBase = 'group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-900/70 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/10 dark:border-white/5 backdrop-blur-xl animate-fade-in';
            const cardClasses = viewMode === 'grid'
              ? `${cardBase} flex flex-col h-full`
              : `${cardBase} flex gap-4 p-4 items-start`;

            const imageWrapperClasses = viewMode === 'grid'
              ? 'relative overflow-hidden aspect-[2/3] w-full'
              : 'relative overflow-hidden w-28 h-40 flex-shrink-0 rounded-xl';

            const infoWrapperClasses = viewMode === 'grid'
              ? 'p-4 flex-1 flex flex-col gap-3'
              : 'flex-1 flex flex-col gap-3';

            const removeButtonClasses = viewMode === 'list'
              ? 'pointer-events-auto p-2 rounded-xl bg-white/25 text-white shadow-xl backdrop-blur-xl opacity-100 transform translate-x-0 transition-all duration-300 hover:bg-red-500/80'
              : 'pointer-events-auto p-2 rounded-xl bg-white/20 text-white shadow-xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hover:bg-red-500/80';

            return (
              <div key={group.comicSlug} className={cardClasses}>
                {/* Comic Image */}
                <div className={imageWrapperClasses}>
                  <LazyImage
                    src={getImageUrl(group.thumbUrl)}
                    alt={group.comicName}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${viewMode === 'grid' ? '' : 'rounded-xl'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                  <div className="absolute inset-0 flex flex-col justify-between p-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-3 py-1 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md rounded-lg shadow-lg">
                        {formatTimeAgo(group.latestRead)}
                      </span>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          handleRemoveComic(group.comicSlug);
                        }}
                        className={removeButtonClasses}
                        title="Xóa khỏi lịch sử"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {latestChapter && (
                      <Link
                        to={`/comic/${latestChapter.comicSlug}/chapter/${latestChapter.chapterNumber}`}
                        className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                      >
                        <div className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 rounded-xl px-4 py-3 shadow-lg border border-white/20 backdrop-blur-lg flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Tiếp tục đọc</p>
                            <p className="text-sm font-bold text-white truncate">{latestChapter.chapterName}</p>
                          </div>
                          <div className="p-2 bg-white/20 rounded-lg">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Comic Info */}
                <div className={infoWrapperClasses}>
                  <Link
                    to={`/comic/${group.comicSlug}`}
                    className="block"
                  >
                    <h3 className={`font-bold text-gray-900 dark:text-white line-clamp-2 transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                      viewMode === 'list' ? 'text-lg' : 'text-base'
                    }`}>
                      {group.comicName}
                    </h3>
                  </Link>

                  {latestChapter && (
                    <div className="rounded-xl border border-blue-100/40 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-blue-900/20 dark:to-purple-900/10 px-4 py-3">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5 uppercase tracking-wide">Chương đang đọc</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{latestChapter.chapterName}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {group.chapters.slice(0, chapterLimit).map((chapter) => (
                      <Link
                        key={`${chapter.comicSlug}-${chapter.chapterNumber}`}
                        to={`/comic/${chapter.comicSlug}/chapter/${chapter.chapterNumber}`}
                        className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-blue-400/60 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                          {chapter.chapterName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatTimeAgo(chapter.readAt)}
                        </span>
                      </Link>
                    ))}
                    {extraChapters > 0 && (
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                        +{extraChapters} chương khác
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 mt-auto border-t border-white/40 dark:border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Đã đọc {group.chapters.length} chương
                    </span>
                    <Link
                      to={`/comic/${group.comicSlug}`}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Xem truyện
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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