export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ/tháng';
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const ACCOMMODATION_TYPES = [
  { slug: 'phong-tro', label: 'Nhà trọ, phòng trọ', icon: '🏠' },
  { slug: 'nha-nguyen-can', label: 'Nhà nguyên căn', icon: '🏡' },
  { slug: 'can-ho', label: 'Căn hộ', icon: '🏢' },
  { slug: 'ky-tuc-xa', label: 'Ký túc xá', icon: '🛏️' },
] as const;

export const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0, max: 0 },
  { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { label: '1 - 3 triệu', min: 1000000, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: 'Trên 10 triệu', min: 10000000, max: 0 },
];

export const AREA_RANGES = [
  { label: 'Tất cả diện tích', min: 0, max: 0 },
  { label: 'Dưới 20 m²', min: 0, max: 20 },
  { label: '20 - 40 m²', min: 20, max: 40 },
  { label: '40 - 60 m²', min: 40, max: 60 },
  { label: 'Trên 60 m²', min: 60, max: 0 },
];

export const FACILITIES = [
  'WiFi', 'Điều hòa', 'Nóng lạnh', 'Giường', 'Tủ', 'Bàn ghế',
  'Bếp', 'Máy giặt', 'Tủ lạnh', 'Ban công', 'Thang máy',
  'Gác lửng', 'Chỗ để xe', 'Camera', 'Thú cưng OK', 'Tự do giờ giấc',
];
