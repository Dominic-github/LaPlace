import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LaPlace - Tìm phòng trọ, nhà trọ, căn hộ cho thuê',
    template: '%s | LaPlace',
  },
  description: 'LaPlace - Kênh tìm kiếm phòng trọ, nhà nguyên căn, căn hộ, ký túc xá cho thuê uy tín, giá rẻ trên toàn quốc.',
  keywords: ['phòng trọ', 'nhà trọ', 'căn hộ cho thuê', 'ký túc xá', 'thuê phòng', 'cho thuê nhà'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'LaPlace',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
