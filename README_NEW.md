# TruyenNet - Web Đọc Truyện Tranh

Ứng dụng web đọc truyện tranh hiện đại được xây dựng với React + TypeScript + TailwindCSS, tích hợp với OTruyen API.

## 🚀 Tính năng chính

- **Trang chủ**: Hiển thị truyện hot, truyện mới, truyện hoàn thành
- **Tìm kiếm**: Tìm kiếm truyện theo tên với auto-complete
- **Danh mục**: Browsing theo thể loại truyện
- **Chi tiết truyện**: Thông tin chi tiết, danh sách chương
- **Đọc truyện**: Giao diện đọc tối ưu với lazy loading
- **Lịch sử đọc**: Lưu tiến độ đọc trong localStorage
- **Yêu thích**: Bookmark truyện yêu thích
- **Dark/Light mode**: Chuyển đổi theme
- **Responsive**: Tối ưu cho mobile và desktop

## 🛠 Công nghệ sử dụng

- **Frontend**: React 19.2.0 + TypeScript
- **Styling**: TailwindCSS 3.4.17
- **Build Tool**: Vite 7.2.2
- **Icons**: Lucide React
- **HTTP Client**: Fetch API với custom service layer
- **State Management**: React Context + useReducer
- **Storage**: LocalStorage cho user data

## 📋 Requirements

- Node.js 18+ 
- npm hoặc yarn

## 🚀 Cài đặt và chạy

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Chạy development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── common/         # Common components
│   │   ├── Header/     # App header với navigation
│   │   ├── Loading/    # Loading states & skeletons
│   │   └── LazyImage/  # Image với lazy loading
│   └── comic/          # Comic-specific components
│       ├── ComicCard/  # Comic card component
│       └── ComicGrid/  # Grid layout cho comics
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── utils/              # Utilities
└── styles/             # Styling
```

## 🌐 API Integration

Dự án sử dụng **OTruyen API** để lấy dữ liệu truyện tranh.

## 🔧 Environment Variables

Tạo file `.env` với:

```env
VITE_API_BASE_URL=https://otruyenapi.com/v1/api
VITE_APP_TITLE=TruyenNet
VITE_STORAGE_PREFIX=truyennet_
```

Xem file `DESIGN_SPEC.md` để biết chi tiết đầy đủ về thiết kế và kiến trúc.