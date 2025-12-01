# TruyenNet - Web Đọc Truyện Tranh

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-yellow.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-blue.svg)](https://tailwindcss.com/)

Ứng dụng web đọc truyện tranh hiện đại được xây dựng với React + TypeScript + TailwindCSS, tích hợp với OTruyen API để cung cấp trải nghiệm đọc truyện mượt mà trên mọi thiết bị.

## 🚀 Tính năng chính

- **🏠 Trang chủ**: Hiển thị truyện hot, truyện mới, truyện hoàn thành
- **🔍 Tìm kiếm**: Tìm kiếm truyện theo tên với auto-complete và filters
- **📚 Danh mục**: Duyệt truyện theo thể loại (Action, Romance, Comedy, v.v.)
- **📖 Chi tiết truyện**: Thông tin chi tiết, danh sách chương, mô tả
- **📄 Đọc truyện**: Giao diện đọc tối ưu với lazy loading và navigation
- **⭐ Yêu thích**: Bookmark truyện yêu thích
- **📚 Lịch sử đọc**: Lưu tiến độ đọc trong localStorage
- **🌙 Dark/Light mode**: Chuyển đổi theme theo sở thích
- **📱 Responsive**: Tối ưu cho mobile, tablet và desktop
- **⚡ Performance**: Lazy loading, caching, và tối ưu hình ảnh

## 🛠 Công nghệ sử dụng

### Frontend Framework
- **React 19.2.0** - UI library hiện đại
- **TypeScript 5.9.3** - Type safety và developer experience
- **Vite 7.2.2** - Build tool nhanh và tối ưu

### Styling & UI
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

### Libraries
- **React Router DOM 6.30.2** - Client-side routing
- **Axios 1.7.2** - HTTP client cho API calls
- **Lucide React 0.460.0** - Modern icon library
- **clsx 2.1.1** - Conditional CSS classes

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting rules

## 📋 Yêu cầu hệ thống

- **Node.js**: 18.0.0 trở lên
- **npm**: 8.0.0 trở lên (hoặc yarn/pnpm)
- **Git**: Để clone repository

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone https://github.com/lamngoctuu18/web_truyen_net.git
cd web_truyen_net
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment variables
Tạo file `.env` trong thư mục gốc:
```env
VITE_API_BASE_URL=https://otruyenapi.com/v1/api
VITE_APP_TITLE=TruyenNet
VITE_STORAGE_PREFIX=truyennet_
```

### 4. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 5. Build cho production
```bash
npm run build
```

### 6. Preview production build
```bash
npm run preview
```

### 7. Lint code
```bash
npm run lint
```

## 📁 Cấu trúc dự án

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components
│   │   ├── Header/      # App header với navigation
│   │   ├── LazyImage/   # Image với lazy loading
│   │   ├── Loading/     # Loading states & skeletons
│   │   └── Pagination/  # Pagination component
│   └── comic/           # Comic-specific components
│       ├── ComicCard/   # Comic card component
│       ├── ComicGrid/   # Grid layout cho comics
│       └── HotComicsSection/ # Hot comics section
├── contexts/            # React contexts
│   └── AppContext.tsx   # Global app state
├── hooks/               # Custom React hooks
│   ├── useApi.ts        # API hooks
│   ├── useFavorites.ts  # Favorites management
│   ├── useLocalStorage.ts # LocalStorage utilities
│   ├── useReadingHistory.ts # Reading history
│   └── useIntersectionObserver.ts # Intersection observer
├── pages/               # Page components
│   ├── Home/            # Trang chủ
│   ├── Search/          # Trang tìm kiếm
│   ├── Categories/      # Danh sách thể loại
│   ├── Category/        # Trang thể loại cụ thể
│   ├── ComicDetail/     # Chi tiết truyện
│   ├── Reader/          # Trang đọc truyện
│   ├── Favorites/       # Truyện yêu thích
│   └── History/         # Lịch sử đọc
├── router/              # Routing configuration
│   ├── AppRouter.tsx    # Main router setup
│   └── Layout.tsx       # App layout
├── services/            # API services
│   ├── api.ts           # Generic API utilities
│   ├── otruyenApi.ts    # OTruyen API integration
│   └── storage.ts       # Local storage services
├── types/               # TypeScript type definitions
│   ├── api.types.ts     # API response types
│   ├── comic.types.ts   # Comic data types
│   └── user.types.ts    # User-related types
├── utils/               # Utility functions
│   ├── constants.ts     # App constants
│   └── helpers.ts       # Helper functions
└── styles/              # Global styles
    └── index.css        # Tailwind imports
```

## 🌐 API Integration

Dự án sử dụng **OTruyen API** (https://otruyenapi.com/v1/api) để lấy dữ liệu truyện tranh.

### API Endpoints chính:
- `GET /danh-sach/truyen-tranh` - Truyện hot/phổ biến
- `GET /danh-sach/truyen-moi` - Truyện mới cập nhật
- `GET /danh-sach/hoan-thanh` - Truyện đã hoàn thành
- `GET /truyen-tranh/{slug}` - Chi tiết truyện
- `GET /the-loai` - Danh sách thể loại
- `GET /tim-kiem` - Tìm kiếm truyện

Xem file `services/otruyenApi.ts` để biết chi tiết implementation.

## 🛣️ Routes & Navigation

| Route | Component | Mô tả |
|-------|-----------|--------|
| `/` | HomePage | Trang chủ |
| `/search` | SearchPage | Tìm kiếm truyện |
| `/categories` | CategoriesPage | Danh sách thể loại |
| `/category/:slug` | CategoryPage | Truyện theo thể loại |
| `/comic/:slug` | ComicDetailPage | Chi tiết truyện |
| `/comic/:slug/chapter/:chapter` | ReaderPage | Đọc chương |
| `/favorites` | FavoritesPage | Truyện yêu thích |
| `/history` | HistoryPage | Lịch sử đọc |

## 🔧 Scripts

| Command | Mô tả |
|---------|--------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build cho production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code với ESLint |

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach với breakpoints cho tablet và desktop
- **Dark/Light Theme**: Chuyển đổi theme với smooth transitions
- **Loading States**: Skeleton loading cho better UX
- **Lazy Loading**: Images load khi vào viewport
- **Smooth Navigation**: React Router với transition effects
- **Accessibility**: ARIA labels và keyboard navigation

## 📱 Performance Optimizations

- **Code Splitting**: Dynamic imports cho pages
- **Image Optimization**: Lazy loading và responsive images
- **API Caching**: Cache responses để giảm API calls
- **Bundle Optimization**: Vite tree-shaking và minification
- **Service Worker**: PWA support (sắp tới)

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này sử dụng license MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **GitHub**: [lamngoctuu18](https://github.com/lamngoctuu18)
- **Repository**: [web_truyen_net](https://github.com/lamngoctuu18/web_truyen_net)

---

**Lưu ý**: Dự án đang trong quá trình phát triển. Một số tính năng có thể chưa hoàn thiện.

Xem `DESIGN_SPEC.md` để biết chi tiết về thiết kế và kiến trúc hệ thống.
