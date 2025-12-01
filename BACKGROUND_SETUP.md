# 🎨 Hướng dẫn thêm ảnh nền Anime Characters

## Bước 1: Lưu ảnh
Lưu bức ảnh anime characters vào thư mục:
```
src/assets/anime-characters-bg.jpg
```

Hoặc bất kỳ định dạng nào:
- `anime-characters-bg.jpg`
- `anime-characters-bg.png`
- `anime-characters-bg.webp`

## Bước 2: Cập nhật Layout.tsx

Mở file `src/router/Layout.tsx` và:

1. **Uncomment dòng import:**
```typescript
// Từ:
// import animeCharactersBg from '../assets/anime-characters-bg.jpg';

// Thành:
import animeCharactersBg from '../assets/anime-characters-bg.jpg';
```

2. **Đổi background:**
```typescript
// Từ:
const bgImage = demonSlayerBg;

// Thành:
const bgImage = animeCharactersBg;
```

## Bước 3: Lưu và refresh browser

Vite sẽ tự động reload và hiển thị ảnh nền mới!

## 🎯 Tùy chỉnh thêm

### Điều chỉnh overlay (nếu cần)
Trong `Layout.tsx`, tìm dòng:
```typescript
<div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90...">
```

Thay đổi opacity:
- `/80` = 80% overlay (tối)
- `/50` = 50% overlay (sáng hơn)
- `/90` = 90% overlay (rất tối)

### Thay đổi background-position
Nếu muốn focus vào phần khác của ảnh:
```typescript
backgroundPosition: 'center top',  // Phía trên
backgroundPosition: 'center bottom', // Phía dưới
backgroundPosition: 'left center',   // Bên trái
backgroundPosition: 'right center',  // Bên phải
```

---

✨ **Lưu ý:** Vite sẽ tự động optimize ảnh khi build production!
