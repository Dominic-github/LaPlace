import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Ký túc xá chi tiết' };
export default function KTXDetailPage() {
  return <div className="container-page pb-16"><Breadcrumbs items={[{ label: 'Ký túc xá', href: '/ky-tuc-xa' }, { label: 'Chi tiết' }]} /><p className="text-gray-500 py-20 text-center">Trang chi tiết KTX - Cùng layout với /phong-tro/[slug]</p></div>;
}
