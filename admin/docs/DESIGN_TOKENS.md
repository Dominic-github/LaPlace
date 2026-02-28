# 🎨 Hệ thống màu sắc (Design Tokens)

## Tổng quan

Admin panel sử dụng hệ thống **CSS Variables** để quản lý màu sắc. Điều này cho phép:
- Dễ dàng thay đổi màu thương hiệu
- Hỗ trợ Dark/Light mode tự động
- Nhất quán màu sắc trên toàn ứng dụng

## 🔧 Cách thay đổi màu thương hiệu

Mở file `src/index.css` và thay đổi các giá trị trong phần **BRAND COLORS**:

```css
:root {
  /* === BRAND PRIMARY === */
  --brand-primary-h: 263.4;    /* Hue: 0-360 (Tím = 263, Xanh = 217, Đỏ = 0) */
  --brand-primary-s: 70%;      /* Saturation: 0-100% */
  --brand-primary-l: 50.4%;    /* Lightness: 0-100% */
}
```

### Ví dụ thay đổi màu:

| Màu | Hue (h) | Saturation (s) | Lightness (l) |
|-----|---------|----------------|---------------|
| Tím (mặc định) | 263 | 70% | 50% |
| Xanh dương | 217 | 91% | 60% |
| Xanh lá | 142 | 76% | 36% |
| Cam | 25 | 95% | 53% |
| Đỏ | 0 | 84% | 60% |

## 📋 Danh sách biến màu

### Backgrounds
| Biến | Light Mode | Dark Mode | Mô tả |
|------|------------|-----------|-------|
| `--color-background` | Trắng | Đen | Nền chính |
| `--color-card` | Trắng | Đen | Nền card |
| `--color-popover` | Trắng | Đen | Dropdown, modal |
| `--color-secondary` | Xám nhạt | Xám đậm | Nền phụ |
| `--color-muted` | Xám nhạt | Xám đậm | Nền disabled |
| `--color-accent` | Xám nhạt | Xám đậm | Hover state |

### Text (Foregrounds)
| Biến | Light Mode | Dark Mode | Mô tả |
|------|------------|-----------|-------|
| `--color-foreground` | Đen | Trắng | Text chính |
| `--color-muted-foreground` | Xám | Xám nhạt | Text phụ |

### Brand Colors
| Biến | Mô tả |
|------|-------|
| `--color-primary` | Màu chính (nút, link, active) |
| `--color-destructive` | Màu nguy hiểm (xóa, lỗi) |
| `--color-success` | Màu thành công |
| `--color-warning` | Màu cảnh báo |

### Sidebar
| Biến | Mô tả |
|------|-------|
| `--color-sidebar` | Nền sidebar |
| `--color-sidebar-foreground` | Text sidebar |
| `--color-sidebar-primary` | Menu item active |
| `--color-sidebar-accent` | Menu item hover |

## 🎯 Sử dụng trong Tailwind CSS

```tsx
// Background
<div className="bg-background" />
<div className="bg-card" />
<div className="bg-primary" />

// Text
<p className="text-foreground" />
<p className="text-muted-foreground" />
<p className="text-primary" />

// Border
<div className="border border-border" />

// Focus ring
<input className="focus:ring-ring" />
```

## 🎨 Sử dụng trong inline styles

```tsx
<div style={{ backgroundColor: 'var(--color-popover)' }} />
<span style={{ color: 'var(--color-primary)' }} />
```

## 📦 Component Colors

### Button variants
- **default**: `bg-primary text-primary-foreground`
- **secondary**: `bg-secondary text-secondary-foreground`
- **destructive**: `bg-destructive text-destructive-foreground`
- **outline**: `border border-input bg-background`
- **ghost**: `hover:bg-accent`

### Badge variants
- **default**: `bg-primary`
- **secondary**: `bg-secondary`
- **destructive**: `bg-destructive`
- **success**: `bg-success`
- **warning**: `bg-warning`

## 🌙 Theme Classes

ThemeProvider sẽ tự động thêm class `.dark` vào `<html>` khi chọn Dark mode.

```tsx
// Sử dụng trong component
import { useTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current: {resolvedTheme}
    </button>
  );
}
```
