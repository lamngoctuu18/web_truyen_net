# Design Specification - TruyenNet Web Application

## 1. Tổng quan dự án

### Mục tiêu
Xây dựng một ứng dụng web đọc truyện tranh hiện đại, responsive, sử dụng ReactJS + TypeScript + TailwindCSS với dữ liệu từ OTruyen API.

### Công nghệ sử dụng
- **Frontend Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context + useReducer (có thể nâng cấp lên Zustand nếu cần)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Image Optimization**: React Lazy Load + Intersection Observer
- **Storage**: LocalStorage cho user preferences và reading history

## 2. Kiến trúc ứng dụng

### 2.1 Cấu trúc thư mục
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Loading/
│   │   ├── ErrorBoundary/
│   │   └── LazyImage/
│   ├── comic/           # Comic-specific components
│   │   ├── ComicCard/
│   │   ├── ComicGrid/
│   │   ├── ChapterList/
│   │   └── Reader/
│   └── ui/              # Basic UI components
│       ├── Button/
│       ├── Modal/
│       ├── Dropdown/
│       └── Input/
├── pages/               # Page components
│   ├── Home/
│   ├── Category/
│   ├── ComicDetail/
│   ├── Reader/
│   ├── Search/
│   └── Profile/
├── hooks/               # Custom React hooks
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   ├── useReadingHistory.ts
│   └── useIntersectionObserver.ts
├── services/            # API services
│   ├── api.ts
│   ├── otruyenApi.ts
│   └── storage.ts
├── contexts/            # React contexts
│   ├── AppContext.tsx
│   ├── ReadingContext.tsx
│   └── ThemeContext.tsx
├── types/               # TypeScript type definitions
│   ├── comic.types.ts
│   ├── api.types.ts
│   └── user.types.ts
├── utils/               # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── formatters.ts
└── styles/              # Global styles
    ├── globals.css
    └── components.css
```

### 2.2 State Management Architecture

```typescript
// Global App State
interface AppState {
  user: {
    favorites: string[];
    readingHistory: ReadingHistoryItem[];
    preferences: UserPreferences;
  };
  ui: {
    theme: 'light' | 'dark';
    loading: boolean;
    error: string | null;
  };
  reading: {
    currentComic: Comic | null;
    currentChapter: Chapter | null;
    currentPage: number;
    readingMode: 'scroll' | 'page';
  };
}
```

## 3. API Integration với OTruyen API

### 3.1 API Endpoints (dự kiến)
```typescript
// Base URL: https://otruyenapi.com/v1/api
const API_ENDPOINTS = {
  // Comics
  COMICS_POPULAR: '/danh-sach/truyen-tranh',
  COMICS_NEW: '/danh-sach/truyen-moi',
  COMICS_COMPLETED: '/danh-sach/hoan-thanh',
  COMIC_DETAIL: '/truyen-tranh/{slug}',
  
  // Categories
  CATEGORIES: '/the-loai',
  CATEGORY_COMICS: '/the-loai/{slug}',
  
  // Chapters
  CHAPTER_DETAIL: '/truyen-tranh/{comic_slug}/chuong-{chapter_number}',
  
  // Search
  SEARCH: '/tim-kiem',
};
```

### 3.2 API Service Layer
```typescript
class OTruyenApiService {
  private baseURL = 'https://otruyenapi.com/v1/api';
  
  async getPopularComics(page = 1): Promise<ComicsResponse> {}
  async getComicDetail(slug: string): Promise<Comic> {}
  async getChapter(comicSlug: string, chapterNumber: number): Promise<Chapter> {}
  async searchComics(query: string, page = 1): Promise<ComicsResponse> {}
  async getCategories(): Promise<Category[]> {}
  async getComicsByCategory(categorySlug: string, page = 1): Promise<ComicsResponse> {}
}
```

## 4. UI/UX Design System

### 4.1 Color Palette
```css
/* Light Theme */
--primary-50: #f0f9ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-900: #111827;

/* Dark Theme */
--dark-bg: #0f172a;
--dark-surface: #1e293b;
--dark-text: #f1f5f9;
```

### 4.2 Typography Scale
```css
/* Font sizes using Tailwind */
.text-xs     /* 12px */
.text-sm     /* 14px */
.text-base   /* 16px */
.text-lg     /* 18px */
.text-xl     /* 20px */
.text-2xl    /* 24px */
.text-3xl    /* 30px */
```

### 4.3 Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 5. Page Components Specification

### 5.1 Home Page (`/`)
**Layout:**
- Header với logo, search bar, navigation menu
- Hero section với truyện nổi bật (slider)
- Grid sections: "Truyện mới", "Truyện hot", "Thể loại"
- Footer

**Components:**
- `HeroSlider`: Carousel truyện nổi bật
- `ComicGrid`: Grid layout hiển thị comics
- `CategoryList`: Danh sách thể loại

### 5.2 Category Page (`/category/:slug`)
**Layout:**
- Breadcrumb navigation
- Category title và description
- Filter/sort options
- Comic grid với pagination
- Sidebar với categories khác

**Components:**
- `CategoryHeader`: Title + description
- `ComicGrid`: Responsive grid
- `Pagination`: Page navigation
- `CategorySidebar`: Other categories

### 5.3 Comic Detail Page (`/comic/:slug`)
**Layout:**
- Comic cover, title, author, status
- Description và tags
- Chapter list
- Related comics
- Action buttons (Favorite, Continue Reading)

**Components:**
- `ComicHeader`: Cover + basic info
- `ComicDescription`: Expandable description
- `ChapterList`: Scrollable chapter list
- `RelatedComics`: Horizontal scroll

### 5.4 Reader Page (`/comic/:slug/chapter/:number`)
**Layout:**
- Minimal header với navigation
- Main reading area
- Chapter navigation (prev/next)
- Settings panel (reading mode, theme)

**Components:**
- `ReaderHeader`: Minimal navigation
- `ReaderContent`: Image display area
- `ReaderControls`: Navigation + settings
- `ChapterSelector`: Quick chapter selection

### 5.5 Search Page (`/search?q=:query`)
**Layout:**
- Search input với filters
- Results grid
- Pagination
- Search suggestions

**Components:**
- `SearchForm`: Input + filters
- `SearchResults`: Results grid
- `SearchSuggestions`: Auto-complete

## 6. Technical Implementation Details

### 6.1 Performance Optimization

**Image Loading:**
```typescript
// Lazy loading cho comic images
const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};
```

**API Caching:**
```typescript
// Simple cache với expiry
class ApiCache {
  private cache = new Map();
  
  set(key: string, data: any, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}
```

### 6.2 Reading Experience

**Reading Mode:**
- **Scroll Mode**: Vertical scroll through all pages
- **Page Mode**: One page at a time với navigation

**Reading Progress:**
```typescript
interface ReadingProgress {
  comicSlug: string;
  chapterNumber: number;
  pageNumber: number;
  timestamp: Date;
  percentage: number;
}

// Save progress to localStorage
const saveProgress = (progress: ReadingProgress) => {
  const history = getReadingHistory();
  const updated = history.filter(item => 
    !(item.comicSlug === progress.comicSlug && 
      item.chapterNumber === progress.chapterNumber)
  );
  updated.unshift(progress);
  localStorage.setItem('reading_history', JSON.stringify(updated.slice(0, 100)));
};
```

### 6.3 Responsive Design

**Mobile-First Approach:**
```css
/* Mobile default */
.comic-grid {
  @apply grid grid-cols-2 gap-2 p-2;
}

/* Tablet */
@media (min-width: 768px) {
  .comic-grid {
    @apply grid-cols-3 gap-4 p-4;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .comic-grid {
    @apply grid-cols-4 gap-6 p-6;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .comic-grid {
    @apply grid-cols-5 gap-8 p-8;
  }
}
```

## 7. SEO & Accessibility

### 7.1 Meta Tags
```typescript
const MetaTags = ({ title, description, image, url }) => (
  <Helmet>
    <title>{title} | TruyenNet</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
);
```

### 7.2 Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 8. Deployment & Build

### 8.1 Build Optimization
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'] // icon library
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

### 8.2 Environment Variables
```env
VITE_API_BASE_URL=https://otruyenapi.com/v1/api
VITE_APP_TITLE=TruyenNet
VITE_STORAGE_PREFIX=truyennet_
```

## 9. Future Enhancements

1. **PWA Support**: Service workers cho offline reading
2. **User Authentication**: Login/register system
3. **Social Features**: Comments, ratings, sharing
4. **Advanced Search**: Filters by author, year, status
5. **Reading Statistics**: Reading time, favorite genres
6. **Push Notifications**: New chapter notifications
7. **Multi-language Support**: i18n implementation

## 10. Development Phases

### Phase 1 (Core Features)
- [x] Project setup với Vite + React + TypeScript + TailwindCSS
- [ ] Basic routing và layout
- [ ] OTruyen API integration
- [ ] Home page với comic listings
- [ ] Comic detail page
- [ ] Basic reader functionality

### Phase 2 (Enhanced Features)
- [ ] Search functionality
- [ ] Category browsing
- [ ] Reading history (localStorage)
- [ ] Responsive design optimization
- [ ] Performance optimization

### Phase 3 (Advanced Features)
- [ ] User preferences
- [ ] Dark/light theme
- [ ] Advanced reader features
- [ ] SEO optimization
- [ ] PWA features

Specification này cung cấp roadmap chi tiết cho việc phát triển web đọc truyện với tất cả các yêu cầu đã nêu.