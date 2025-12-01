export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://otruyenapi.com/v1/api';
export const CDN_IMAGE_URL = 'https://img.otruyenapi.com/uploads/comics';

export const API_ENDPOINTS = {
  // Comics endpoints
  COMICS_NEW: '/danh-sach/truyen-moi',
  COMICS_HOT: '/danh-sach/truyen-hot', 
  COMICS_COMPLETED: '/danh-sach/hoan-thanh',
  COMIC_DETAIL: '/truyen-tranh',
  
  // Categories
  CATEGORIES: '/the-loai',
  
  // Search
  SEARCH: '/tim-kiem',
  
  // Home page
  HOME: '/home',
} as const;

export const APP_CONFIG = {
  APP_NAME: 'TruyenNet',
  APP_DESCRIPTION: 'Đọc truyện tranh online miễn phí',
  ITEMS_PER_PAGE: 24,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  STORAGE_PREFIX: 'truyennet_',
  MAX_READING_HISTORY: 100,
  MAX_FAVORITES: 500,
} as const;

export const THEME_CONFIG = {
  THEMES: ['light', 'dark', 'system'] as const,
  DEFAULT_THEME: 'system',
} as const;

export const READING_CONFIG = {
  MODES: ['scroll', 'page'] as const,
  DEFAULT_MODE: 'scroll',
  IMAGE_QUALITY: ['low', 'medium', 'high'] as const,
  DEFAULT_IMAGE_QUALITY: 'medium',
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  SM: 640,
  MD: 768, 
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const COMIC_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: `${APP_CONFIG.STORAGE_PREFIX}preferences`,
  READING_HISTORY: `${APP_CONFIG.STORAGE_PREFIX}reading_history`,
  FAVORITES: `${APP_CONFIG.STORAGE_PREFIX}favorites`,
  BOOKMARKS: `${APP_CONFIG.STORAGE_PREFIX}bookmarks`,
} as const;