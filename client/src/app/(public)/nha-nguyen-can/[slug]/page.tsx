import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Nhà nguyên căn cho thuê' };
export default function NhaNCDetailPage() {
  return <div className="container-page pb-16"><Breadcrumbs items={[{ label: 'Nhà nguyên căn', href: '/nha-nguyen-can' }, { label: 'Chi tiết' }]} /><p className="text-gray-500 py-20 text-center">Trang chi tiết nhà nguyên căn - Cùng layout với /phong-tro/[slug]</p></div>;
}
