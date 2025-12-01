import type { 
  UserData, 
  UserPreferences, 
  ReadingHistoryItem, 
  FavoriteComic, 
  BookmarkItem 
} from '../types/user.types';
import { LOCAL_STORAGE_KEYS, READING_CONFIG, THEME_CONFIG } from '../utils/constants';

class StorageService {
  
  /**
   * Get user preferences
   */
  getUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_PREFERENCES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error loading user preferences:', error);
    }

    // Return default preferences
    return {
      theme: THEME_CONFIG.DEFAULT_THEME,
      readingMode: READING_CONFIG.DEFAULT_MODE,
      autoNextChapter: true,
      imageQuality: READING_CONFIG.DEFAULT_IMAGE_QUALITY,
      language: 'vi',
    };
  }

  /**
   * Save user preferences
   */
  setUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER_PREFERENCES, 
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  /**
   * Get reading history
   */
  getReadingHistory(): ReadingHistoryItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.READING_HISTORY);
      if (stored) {
        const history = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      console.warn('Error loading reading history:', error);
    }
    return [];
  }

  /**
   * Add item to reading history
   */
  addToReadingHistory(item: ReadingHistoryItem): void {
    try {
      const history = this.getReadingHistory();
      
      // Remove existing entry for same comic/chapter
      const filtered = history.filter(
        h => !(h.comicSlug === item.comicSlug && h.chapterNumber === item.chapterNumber)
      );

      // Add new entry at the beginning
      filtered.unshift(item);

      // Keep only latest 100 entries
      const limited = filtered.slice(0, 100);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.READING_HISTORY,
        JSON.stringify(limited)
      );
    } catch (error) {
      console.error('Error saving reading history:', error);
    }
  }

  /**
   * Get last read chapter for a comic
   */
  getLastReadChapter(comicSlug: string): ReadingHistoryItem | null {
    const history = this.getReadingHistory();
    return history.find(item => item.comicSlug === comicSlug) || null;
  }

  /**
   * Clear reading history
   */
  clearReadingHistory(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.READING_HISTORY);
    } catch (error) {
      console.error('Error clearing reading history:', error);
    }
  }

  /**
   * Get favorite comics
   */
  getFavorites(): FavoriteComic[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);
      if (stored) {
        const favorites = JSON.parse(stored);
        // Convert addedAt strings back to Date objects
        return favorites.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
      }
    } catch (error) {
      console.warn('Error loading favorites:', error);
    }
    return [];
  }

  /**
   * Add comic to favorites
   */
  addToFavorites(comic: FavoriteComic): void {
    try {
      const favorites = this.getFavorites();
      
      // Check if already in favorites
      if (favorites.some(fav => fav.comicSlug === comic.comicSlug)) {
        return;
      }

      favorites.unshift(comic);

      // Keep only latest 500 favorites
      const limited = favorites.slice(0, 500);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITES,
        JSON.stringify(limited)
      );
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  /**
   * Remove comic from favorites
   */
  removeFromFavorites(comicSlug: string): void {
    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter(fav => fav.comicSlug !== comicSlug);
      
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITES,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  /**
   * Check if comic is in favorites
   */
  isFavorite(comicSlug: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.comicSlug === comicSlug);
  }

  /**
   * Get bookmarks
   */
  getBookmarks(): BookmarkItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      if (stored) {
        const bookmarks = JSON.parse(stored);
        return bookmarks.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
      }
    } catch (error) {
      console.warn('Error loading bookmarks:', error);
    }
    return [];
  }

  /**
   * Add bookmark
   */
  addBookmark(bookmark: BookmarkItem): void {
    try {
      const bookmarks = this.getBookmarks();
      
      // Remove existing bookmark for same position if exists
      const filtered = bookmarks.filter(
        b => !(b.comicSlug === bookmark.comicSlug && 
               b.chapterNumber === bookmark.chapterNumber && 
               b.pageNumber === bookmark.pageNumber)
      );

      filtered.unshift(bookmark);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  }

  /**
   * Remove bookmark
   */
  removeBookmark(bookmarkId: string): void {
    try {
      const bookmarks = this.getBookmarks();
      const filtered = bookmarks.filter(b => b.id !== bookmarkId);
      
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }

  /**
   * Get all user data
   */
  getAllUserData(): UserData {
    return {
      preferences: this.getUserPreferences(),
      favorites: this.getFavorites(),
      readingHistory: this.getReadingHistory(),
      bookmarks: this.getBookmarks(),
    };
  }

  /**
   * Export user data as JSON
   */
  exportUserData(): string {
    const userData = this.getAllUserData();
    return JSON.stringify(userData, null, 2);
  }

  /**
   * Import user data from JSON
   */
  importUserData(jsonData: string): boolean {
    try {
      const userData: UserData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!userData.preferences || !userData.favorites || !userData.readingHistory) {
        throw new Error('Invalid data format');
      }

      // Import each data type
      this.setUserPreferences(userData.preferences);
      
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITES,
        JSON.stringify(userData.favorites)
      );
      
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.READING_HISTORY,
        JSON.stringify(userData.readingHistory)
      );

      if (userData.bookmarks) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.BOOKMARKS,
          JSON.stringify(userData.bookmarks)
        );
      }

      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  /**
   * Clear all user data
   */
  clearAllData(): void {
    try {
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}

export const storageService = new StorageService();
export default storageService;