import { useState, useEffect } from 'react';
import type { Comic } from '../types/comic.types';

const FAVORITES_KEY = 'truyennet_favorites';

export interface FavoriteComic {
  _id: string;
  name: string;
  slug: string;
  thumbUrl: string;
  status: string;
  category: Array<{ id?: string; name: string; slug: string }>;
  updatedAt: string;
  addedAt: string; // When added to favorites
  latestChapter?: string; // Latest chapter number
  chapterUpdatedAt?: string; // When chapter was updated
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteComic[]>([]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse favorites:', error);
        localStorage.removeItem(FAVORITES_KEY);
      }
    }
    return [];
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    setFavorites(loadFavorites());

    // Listen for favorites changes from other instances
    const handleFavoritesChange = () => {
      setFavorites(loadFavorites());
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  // Save to localStorage whenever favorites change
  const saveFavorites = (newFavorites: FavoriteComic[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    
    // Broadcast change to other hook instances
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  const addFavorite = (comic: Comic) => {
    const favoriteComic: FavoriteComic = {
      _id: comic._id,
      name: comic.name,
      slug: comic.slug,
      thumbUrl: comic.thumb_url,
      status: comic.status,
      category: comic.category || [],
      updatedAt: comic.updatedAt,
      addedAt: new Date().toISOString(),
      latestChapter: comic.chaptersLatest?.[0]?.chapter_name || undefined,
      chapterUpdatedAt: comic.updatedAt || undefined
    };

    const newFavorites = [favoriteComic, ...favorites.filter(f => f._id !== comic._id)];
    saveFavorites(newFavorites);
  };

  const removeFavorite = (comicId: string) => {
    const newFavorites = favorites.filter(f => f._id !== comicId);
    saveFavorites(newFavorites);
  };

  const toggleFavorite = (comic: Comic) => {
    if (isFavorite(comic._id)) {
      removeFavorite(comic._id);
    } else {
      addFavorite(comic);
    }
  };

  const isFavorite = (comicId: string) => {
    return favorites.some(f => f._id === comicId);
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length
  };
}
