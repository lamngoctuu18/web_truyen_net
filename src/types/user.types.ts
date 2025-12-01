// User preferences and settings
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  readingMode: 'scroll' | 'page';
  autoNextChapter: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  language: 'vi' | 'en';
}

// Reading history
export interface ReadingHistoryItem {
  comicSlug: string;
  comicName: string;
  chapterNumber: number;
  chapterName: string;
  readAt: string;
  thumbUrl: string;
}

// Favorite comics
export interface FavoriteComic {
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
  latestChapter?: number;
  addedAt: string;
}

// User data stored in localStorage
export interface UserData {
  preferences: UserPreferences;
  favorites: FavoriteComic[];
  readingHistory: ReadingHistoryItem[];
  bookmarks: BookmarkItem[];
}

// Bookmark for specific chapter/page
export interface BookmarkItem {
  id: string;
  comicSlug: string;
  comicName: string;
  chapterNumber: number;
  pageNumber: number;
  note?: string;
  createdAt: Date;
}

// Reading session data
export interface ReadingSession {
  comicSlug: string;
  chapterNumber: number;
  pageNumber: number;
  startTime: Date;
  lastActiveTime: Date;
}