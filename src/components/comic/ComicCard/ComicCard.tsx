import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { LazyImage } from '../../common/LazyImage';
import type { Comic } from '../../../types/comic.types';
import { formatTimeAgo } from '../../../utils/helpers';
import { useFavorites } from '../../../hooks/useFavorites';

interface ComicCardProps {
  comic: Comic;
  onComicClick?: (comic: Comic) => void;
  showStatus?: boolean;
  className?: string;
}

export function ComicCard({ 
  comic, 
  onComicClick,
  showStatus = true,
  className = ''
}: ComicCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isComicFavorite = isFavorite(comic._id);

  const handleCardClick = () => {
    if (onComicClick) {
      onComicClick(comic);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(comic);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'ongoing':
        return 'Đang cập nhật';
      default:
        return 'Chưa rõ';
    }
  };

  return (
    <div 
      className={`comic-card cursor-pointer group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col ${className}`}
      onClick={handleCardClick}
    >
      {/* Comic Cover */}
      <div className="relative overflow-hidden aspect-[2/3] flex-shrink-0">
        <LazyImage
          src={comic.thumb_url}
          alt={comic.name}
          className="comic-card-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                isComicFavorite 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/50' 
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${isComicFavorite ? 'fill-current' : ''}`} 
              />
            </button>
          </div>

          {/* Status Badge */}
          {showStatus && (
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-xl backdrop-blur-md shadow-lg ${getStatusColor(comic.status)}`}>
                {getStatusText(comic.status)}
              </span>
            </div>
          )}
          
          {/* Chapter info on hover */}
          {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="bg-gradient-to-r from-blue-600/95 to-purple-600/95 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/80 mb-0.5">Chapter mới nhất</p>
                    <p className="text-sm font-bold text-white truncate">
                      Chương {comic.chaptersLatest[0].chapter_name}
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
      </div>

      {/* Comic Info */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight flex-shrink-0" title={comic.name}>
          {comic.name}
        </h3>
        
        {/* Latest Chapter Badge - Always Visible */}
        {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex-shrink-0">
            <div className="flex-shrink-0 p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                Chapter {comic.chaptersLatest[0].chapter_name}
              </p>
            </div>
          </div>
        )}
        
        {/* Categories */}
        {comic.category && comic.category.length > 0 && (
          <div className="flex flex-wrap gap-1.5 flex-shrink-0">
            {comic.category.slice(0, 2).map((cat, index) => (
              <span 
                key={cat._id || cat.id || index}
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
        <div className="flex items-center justify-between text-xs pt-1 mt-auto">
          {comic.updatedAt && (
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-medium">{formatTimeAgo(comic.updatedAt)}</span>
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
  );
}

export default ComicCard;