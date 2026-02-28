---
description: Quy trình tối ưu SEO cho website LaPlace
---

# 🔍 SEO OPTIMIZATION WORKFLOW

---

## TECHNICAL SEO

### Next.js Metadata

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'LaPlace - Tìm phòng trọ, nhà thuê dễ dàng',
    template: '%s | LaPlace'
  },
  description: 'Tìm phòng trọ, căn hộ, nhà nguyên căn cho thuê. Đặt phòng online, hợp đồng điện tử, thanh toán an toàn.',
  openGraph: {
    siteName: 'LaPlace',
    locale: 'vi_VN',
  }
};
```

### Dynamic Metadata

```tsx
// app/phong-tro/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const accommodation = await getAccommodation(params.slug);
  return {
    title: accommodation.title,
    description: `Cho thuê ${accommodation.type} tại ${accommodation.address}. Giá ${formatPrice(accommodation.price)}/tháng. Diện tích ${accommodation.area}m².`,
    openGraph: { images: accommodation.images }
  };
}
```

---

## STRUCTURED DATA

### Accommodation Schema

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: accommodation.title,
  image: accommodation.images,
  address: {
    '@type': 'PostalAddress',
    streetAddress: accommodation.address,
    addressLocality: accommodation.district,
    addressRegion: accommodation.province,
    addressCountry: 'VN',
  },
  priceRange: formatPrice(accommodation.price) + '/tháng',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: accommodation.averageRating,
    reviewCount: accommodation.reviewCount,
  }
};
```

### Breadcrumb

```tsx
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Tìm phòng', item: '/tim-phong' },
    { '@type': 'ListItem', position: 3, name: accommodation.title }
  ]
};
```

---

## URL STRUCTURE

| Page | URL Pattern |
|------|-------------|
| Search | `/tim-phong?q={query}&type={type}&price_min={min}&price_max={max}` |
| Detail | `/phong-tro/{accommodation-slug}` |
| News | `/tin-tuc/{post-slug}` |
| Location | `/khu-vuc/{province-slug}` |

---

## SITEMAP

```tsx
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const accommodations = await getAccommodations();

  return [
    { url: 'https://laplace.vn', lastModified: new Date(), priority: 1.0 },
    { url: 'https://laplace.vn/tim-phong', lastModified: new Date(), priority: 0.9 },
    { url: 'https://laplace.vn/lien-he', lastModified: new Date(), priority: 0.5 },
    ...accommodations.map(a => ({
      url: `https://laplace.vn/phong-tro/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      priority: 0.8,
    }))
  ];
}
```

---

## ROBOTS.TXT

```tsx
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/tai-khoan/', '/api/'],
    },
    sitemap: 'https://laplace.vn/sitemap.xml',
  };
}
```

---

## CHECKLIST

- [ ] Title tags unique và descriptive
- [ ] Meta descriptions compelling (chứa giá, địa chỉ, diện tích)
- [ ] H1 duy nhất mỗi page
- [ ] Images có alt text descriptive
- [ ] Canonical URLs correct
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Core Web Vitals pass
- [ ] Structured data (LodgingBusiness) cho accommodation
- [ ] Vietnamese locale (vi_VN) set correctly
