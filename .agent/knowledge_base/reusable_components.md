# 🧩 REUSABLE COMPONENTS - LAPLACE

## Admin Component Structure (Refine + Ant Design)

```
admin/src/
├── components/          # 49 files
│   ├── dashboard/       # Dashboard widgets
│   ├── layout/          # Layout components
│   └── ...              # Other shared components
├── pages/               # 34 resource directories
│   ├── listings/        # Main accommodation management
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── dashboard/
│   ├── reports/
│   ├── posts/
│   ├── post-categories/
│   ├── post-tags/
│   ├── banners/
│   ├── media/
│   ├── menus/
│   ├── settings/
│   ├── activity-logs/
│   ├── locations/
│   ├── brokers/
│   ├── projects/
│   ├── staticPages/
│   ├── policy-widgets/
│   ├── login/
│   ├── profile/
│   └── ... (13 legacy e-commerce modules)
├── providers/           # Auth & Data
├── styles/              # CSS Styles
├── lib/                 # Utilities
├── utils/               # Utility functions
├── authProvider.ts
├── dataProvider.ts
└── App.tsx
```

---

## Client Component Structure (Next.js 15 + Tailwind)

```
client/src/
├── components/
│   ├── accommodation/   # AccommodationCard
│   ├── layout/          # Header, Footer
│   └── shared/          # Shared components (3 files)
├── app/
│   ├── (public)/        # 14 public page groups
│   │   ├── page.tsx             # Homepage
│   │   ├── tim-phong/           # Tìm phòng
│   │   ├── phong-tro/           # Phòng trọ
│   │   ├── can-ho/              # Căn hộ
│   │   ├── nha-nguyen-can/      # Nhà nguyên căn
│   │   ├── ky-tuc-xa/           # Ký túc xá
│   │   ├── tinh-thanh/          # Tỉnh thành
│   │   ├── tin-tuc/             # Tin tức
│   │   ├── video-review/        # Video review
│   │   ├── gioi-thieu/          # Giới thiệu
│   │   ├── lien-he/             # Liên hệ
│   │   ├── so-sanh/             # So sánh
│   │   ├── ung-dung/            # Ứng dụng
│   │   └── chinh-sach/          # Chính sách
│   ├── (auth)/          # 5 auth pages
│   │   ├── dang-nhap/
│   │   ├── dang-ky/
│   │   ├── quen-mat-khau/
│   │   ├── dat-lai-mat-khau/
│   │   └── xac-thuc/
│   ├── tai-khoan/       # 8 account pages
│   │   ├── page.tsx             # Dashboard
│   │   ├── dat-phong/
│   │   ├── hop-dong/
│   │   ├── thanh-toan/
│   │   ├── danh-gia/
│   │   ├── yeu-thich/
│   │   ├── thong-bao/
│   │   └── thong-tin/
│   └── chu-tro/         # 7 landlord pages
│       ├── page.tsx             # Dashboard
│       ├── dang-tin/
│       ├── tin-dang/
│       ├── yeu-cau-dat-phong/
│       ├── hop-dong/
│       ├── thu-chi/
│       └── thong-ke/
├── lib/
│   ├── api.ts           # API client
│   └── utils.ts         # Helpers (cn, format)
└── store/               # Zustand stores
```

---

## Admin Components

### StatusTag

```tsx
import { Tag } from "antd";

const statusColors = {
  available: 'green',
  occupied: 'blue',
  maintenance: 'orange',
  pending: 'gold',
  confirmed: 'cyan',
  completed: 'green',
  cancelled: 'red',
  active: 'green',
  expired: 'default',
  terminated: 'red',
};

const statusLabels = {
  available: 'Còn trống',
  occupied: 'Đã thuê',
  maintenance: 'Bảo trì',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  active: 'Đang hiệu lực',
  expired: 'Hết hạn',
  terminated: 'Đã chấm dứt',
};

export function StatusTag({ status }: { status: string }) {
  return (
    <Tag color={statusColors[status] || 'default'}>
      {statusLabels[status] || status}
    </Tag>
  );
}
```

### PriceDisplay

```tsx
export function PriceDisplay({ price, period = 'tháng' }: { price: number; period?: string }) {
  return (
    <span className="text-lg font-bold text-blue-600">
      {price?.toLocaleString('vi-VN')}đ/{period}
    </span>
  );
}
```

---

## Client Components

### AccommodationCard

```tsx
import Link from 'next/link';
import Image from 'next/image';

export function AccommodationCard({ accommodation }) {
  return (
    <Link href={`/phong-tro/${accommodation.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm
                      hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] relative">
          <Image
            src={accommodation.thumbnail}
            alt={accommodation.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium text-white
            ${accommodation.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
            {accommodation.status === 'available' ? 'Còn trống' : 'Đã thuê'}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary">
            {accommodation.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            📍 {accommodation.address}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {accommodation.price?.toLocaleString('vi-VN')}đ/tháng
            </span>
            <span className="text-sm text-gray-400">
              {accommodation.area}m²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### SearchBar

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-phong?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm phòng trọ theo địa chỉ, khu vực..."
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300
                   focus:ring-2 focus:ring-primary focus:border-primary outline-none"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-primary text-white rounded-lg font-medium
                   hover:bg-primary-dark transition-colors"
      >
        Tìm kiếm
      </button>
    </form>
  );
}
```

---

## Price Formatting Utility

```typescript
// lib/format.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function formatPricePerMonth(price: number): string {
  return formatPrice(price) + '/tháng';
}

export function formatArea(area: number): string {
  return `${area}m²`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}
```

---

*Design System: Tailwind CSS + Ant Design 5*  
*Updated: 2026-02-24*
