# 🎨 UI/UX DESIGN SYSTEM - LAPLACE

---

## BRAND COLORS

```typescript
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#3498db',
    dark: '#2980b9',
    light: '#5dade2',
  },
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  text: {
    DEFAULT: '#2c3e50',
    light: '#7f8c8d',
  },
  background: '#ecf0f1',
  border: '#bdc3c7',
}
```

---

## TYPOGRAPHY

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

| Use | Class |
|-----|-------|
| Page Title | `text-2xl font-bold text-gray-900` |
| Section Title | `text-xl font-semibold text-gray-800` |
| Card Title | `text-base font-medium text-gray-900` |
| Body | `text-sm text-gray-600` |
| Price | `text-lg font-bold text-primary` |
| Address | `text-sm text-gray-500` |

---

## SPACING

```tsx
// Container
<div className="container mx-auto px-4 max-w-7xl">

// Section
<section className="bg-white rounded-xl p-6 shadow-sm mb-6">

// Accommodation Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

---

## COMPONENTS

### Cards

```tsx
// Accommodation Card
<div className="bg-white rounded-xl overflow-hidden shadow-sm
                hover:shadow-lg transition-all duration-300 group">
  <div className="aspect-[4/3] relative overflow-hidden">
    <Image fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
  </div>
  <div className="p-4">
    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary">
    <p className="text-sm text-gray-500">📍 Address</p>
    <span className="text-lg font-bold text-primary">Price/tháng</span>
  </div>
</div>
```

### Buttons

```tsx
// Primary
<button className="bg-primary text-white px-6 py-3 rounded-lg font-medium
                   hover:bg-primary-dark transition-colors">

// Secondary
<button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium
                   hover:bg-gray-200 transition-colors">

// Outline
<button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium
                   hover:bg-primary hover:text-white transition-colors">
```

### Badges

```tsx
// Available
<span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
  Còn trống
</span>

// Occupied
<span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
  Đã thuê
</span>

// Featured
<span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
  Nổi bật
</span>
```

### Facility Icons

```tsx
// Facility tags
<div className="flex flex-wrap gap-2">
  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
    📶 WiFi
  </span>
  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
    ❄️ Điều hòa
  </span>
  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
    🅿️ Chỗ đỗ xe
  </span>
</div>
```

---

## RESPONSIVE

| Breakpoint | Width |
|------------|-------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

```tsx
// Mobile first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

---

## EFFECTS

```tsx
// Card hover
<div className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

// Image zoom on hover
<Image className="group-hover:scale-105 transition-transform duration-300" />

// Loading skeleton
<div className="animate-pulse bg-gray-200 rounded-xl">

// Fade in animation
<div className="animate-fadeIn">
```

---

## CHECKLIST

- [ ] Tailwind classes only (no inline styles)
- [ ] Colors from design system config
- [ ] Mobile first responsive
- [ ] Hover states với `transition-*`
- [ ] Price màu `text-primary` + `font-bold`
- [ ] Address có icon 📍
- [ ] `cursor-pointer` cho clickable elements
- [ ] `next/image` cho images
- [ ] Font Inter loaded
- [ ] Rounded corners (`rounded-xl` cho cards)
- [ ] Shadow effects (`shadow-sm`, `shadow-lg`)