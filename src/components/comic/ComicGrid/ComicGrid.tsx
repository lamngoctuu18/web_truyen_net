import { ComicCard } from '../ComicCard';
import { Loading, Skeleton } from '../../common/Loading';
import type { Comic } from '../../../types/comic.types';

interface ComicGridProps {
  comics: Comic[];
  loading?: boolean;
  error?: string | null;
  onComicClick?: (comic: Comic) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function ComicGrid({
  comics,
  loading = false,
  error = null,
  onComicClick,
  onLoadMore,
  hasMore = false,
  className = '',
  emptyMessage = 'Không tìm thấy truyện nào'
}: ComicGridProps) {

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (loading && comics.length === 0) {
    return (
      <div className={`comic-grid ${className}`}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="comic-card">
            <Skeleton className="aspect-comic w-full mb-3" height="h-64" />
            <div className="comic-card-content">
              <Skeleton rows={2} className="mb-2" />
              <Skeleton height="h-3" className="w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comics.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thử tìm kiếm với từ khóa khác hoặc xem các thể loại khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="comic-grid">
        {comics.map((comic) => (
          <ComicCard
            key={comic._id || comic.slug}
            comic={comic}
            onComicClick={onComicClick}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="text-center mt-8">
          {loading ? (
            <Loading text="Đang tải thêm..." />
          ) : (
            <button
              onClick={onLoadMore}
              className="btn-primary px-6 py-3"
            >
              Tải thêm truyện
            </button>
          )}
        </div>
      )}

      {/* Loading More */}
      {loading && comics.length > 0 && (
        <div className="comic-grid mt-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="comic-card">
              <Skeleton className="aspect-comic w-full mb-3" height="h-64" />
              <div className="comic-card-content">
                <Skeleton rows={2} className="mb-2" />
                <Skeleton height="h-3" className="w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComicGrid;