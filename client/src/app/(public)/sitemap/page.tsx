import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiHome, FiSearch, FiGrid, FiMapPin, FiFileText, FiVideo, FiPhone, FiHelpCircle, FiBookOpen, FiInfo } from 'react-icons/fi';
import { ACCOMMODATION_TYPES } from '@/lib/utils';
import { locationApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Sơ đồ trang | LaPlace',
  description: 'Danh sách tất cả các trang trên LaPlace - nền tảng thuê phòng trọ, căn hộ, nhà nguyên căn thông minh.',
};

export default async function SitemapPage() {
  let provinces: any[] = [];
  try {
    const res = await locationApi.getProvinces();
    if (res.data?.data) provinces = res.data.data;
  } catch {}

  const sitemapSections = [
    {
      title: 'Trang chính',
      icon: <FiHome className="w-5 h-5" />,
      color: 'bg-blue-50 text-blue-600',
      links: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Tìm phòng', href: '/tim-phong' },
        { label: 'So sánh phòng', href: '/so-sanh' },
      ],
    },
    {
      title: 'Loại phòng',
      icon: <FiGrid className="w-5 h-5" />,
      color: 'bg-emerald-50 text-emerald-600',
      links: ACCOMMODATION_TYPES.map((t) => ({
        label: t.label,
        href: `/${t.slug}`,
      })),
    },
    {
      title: 'Tỉnh thành',
      icon: <FiMapPin className="w-5 h-5" />,
      color: 'bg-amber-50 text-amber-600',
      links: provinces.slice(0, 20).map((p: any) => ({
        label: p.name,
        href: `/tinh-thanh/${p.slug || p.code}`,
      })),
    },
    {
      title: 'Tin tức & Nội dung',
      icon: <FiFileText className="w-5 h-5" />,
      color: 'bg-purple-50 text-purple-600',
      links: [
        { label: 'Tin tức & Kinh nghiệm', href: '/tin-tuc' },
        { label: 'Video Review', href: '/video-review' },
      ],
    },
    {
      title: 'Hỗ trợ',
      icon: <FiHelpCircle className="w-5 h-5" />,
      color: 'bg-red-50 text-red-600',
      links: [
        { label: 'Liên hệ', href: '/lien-he' },
        { label: 'Về chúng tôi', href: '/gioi-thieu' },
        { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
        { label: 'Điều khoản dịch vụ', href: '/dieu-khoan' },
      ],
    },
    {
      title: 'Tài khoản',
      icon: <FiBookOpen className="w-5 h-5" />,
      color: 'bg-cyan-50 text-cyan-600',
      links: [
        { label: 'Đăng nhập', href: '/dang-nhap' },
        { label: 'Đăng ký', href: '/dang-ky' },
      ],
    },
  ];

  return (
    <div className="container-page pb-20 pt-4">
      <Breadcrumbs items={[{ label: 'Sơ đồ trang' }]} />

      {/* Header */}
      <div className="mb-12 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">
          Sơ đồ <span className="text-gradient">trang</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl">
          Tổng quan tất cả các trang trên LaPlace giúp bạn dễ dàng tìm kiếm nội dung
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {sitemapSections.map((section) => (
          <div key={section.title} className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center`}>
                {section.icon}
              </div>
              <h2 className="font-bold text-slate-900">{section.title}</h2>
            </div>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-primary-600 hover:pl-1.5 transition-all font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
