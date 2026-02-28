import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Căn hộ cho thuê' };
export default function CanHoDetailPage() {
  return <div className="container-page pb-16"><Breadcrumbs items={[{ label: 'Căn hộ', href: '/can-ho' }, { label: 'Chi tiết' }]} /><p className="text-gray-500 py-20 text-center">Trang chi tiết căn hộ - Cùng layout với /phong-tro/[slug]</p></div>;
}
