import { useState, useCallback } from 'react';
import storageService from '../services/storage';
import type { ReadingHistoryItem, FavoriteComic } from '../types/user.types';
import type { Comic } from '../types/comic.types';

/**
 * Hook for managing reading history
 */
export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>(() => 
    storageService.getReadingHistory()
  );

  const addToHistory = useCallback((item: ReadingHistoryItem) => {
    storageService.addToReadingHistory(item);
    setHistory(storageService.getReadingHistory());
  }, []);

  const getLastReadChapter = useCallback((comicSlug: string) => {
    return storageService.getLastReadChapter(comicSlug);
  }, []);

  const clearHistory = useCallback(() => {
    storageService.clearReadingHistory();
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((comicSlug: string, chapterNumber?: number) => {
    const currentHistory = storageService.getReadingHistory();
    const filtered = chapterNumber 
      ? currentHistory.filter(item => 
          !(item.comicSlug === comicSlug && item.chapterNumber === chapterNumber))
      : currentHistory.filter(item => item.comicSlug !== comicSlug);
    
    // Update localStorage directly since we don't have a remove method
    localStorage.setItem(
      'truyennet_reading_history',
      JSON.stringify(filtered)
    );
    setHistory(filtered);
  }, []);

  return {
    history,
    addToHistory,
    getLastReadChapter,
    clearHistory,
    removeFromHistory,
  };
}

/**
 * Hook for managing favorite comics
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteComic[]>(() => 
    storageService.getFavorites()
  );

  const addToFavorites = useCallback((comic: Comic) => {
    const favoriteComic: FavoriteComic = {
      comicSlug: comic.slug,
      comicName: comic.name,
      thumbUrl: comic.thumb_url,
      addedAt: new Date().toISOString(),
    };
    
    storageService.addToFavorites(favoriteComic);
    setFavorites(storageService.getFavorites());
  }, []);

  const removeFromFavorites = useCallback((comicSlug: string) => {
    storageService.removeFromFavorites(comicSlug);
    setFavorites(storageService.getFavorites());
  }, []);

  const isFavorite = useCallback((comicSlug: string) => {
    return storageService.isFavorite(comicSlug);
  }, []);

  const toggleFavorite = useCallback((comic: Comic) => {
    if (isFavorite(comic.slug)) {
      removeFromFavorites(comic.slug);
    } else {
      addToFavorites(comic);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}

/**
 * Hook for tracking reading progress
 */
export function useReadingProgress(
  comicSlug: string,
  chapterNumber: number,
  totalPages: number
) {
  const [currentPage, setCurrentPage] = useState(1);
  const { addToHistory } = useReadingHistory();

  const updateProgress = useCallback((page: number, comic: Comic, chapterName: string) => {
    setCurrentPage(page);
    
    // Save progress to history
    const progressItem: ReadingHistoryItem = {
      comicSlug,
      comicName: comic.name,
      chapterNumber,
      chapterName,
      readAt: new Date().toISOString(),
      thumbUrl: comic.thumb_url,
    };
    
    addToHistory(progressItem);
  }, [comicSlug, chapterNumber, totalPages, addToHistory]);

  const nextPage = useCallback((comic: Comic, chapterName: string) => {
    if (currentPage < totalPages) {
      updateProgress(currentPage + 1, comic, chapterName);
    }
  }, [currentPage, totalPages, updateProgress]);

  const prevPage = useCallback((comic: Comic, chapterName: string) => {
    if (currentPage > 1) {
      updateProgress(currentPage - 1, comic, chapterName);
    }
  }, [currentPage, updateProgress]);

  const goToPage = useCallback((page: number, comic: Comic, chapterName: string) => {
    if (page >= 1 && page <= totalPages) {
      updateProgress(page, comic, chapterName);
    }
  }, [totalPages, updateProgress]);

  const getProgressPercentage = useCallback(() => {
    return Math.round((currentPage / totalPages) * 100);
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    updateProgress,
    getProgressPercentage,
  };
}