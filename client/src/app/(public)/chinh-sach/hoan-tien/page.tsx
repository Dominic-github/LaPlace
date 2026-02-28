import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Chính sách hoàn tiền' };
export default function HoanTienPage() {
  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Chính sách', href: '#' }, { label: 'Hoàn tiền' }]} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính sách hoàn tiền</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <section><h2>1. Điều kiện hoàn tiền</h2><p>Hoàn tiền 100% nếu phòng không đúng mô tả hoặc chủ nhà không giải quyết được sự cố trong 48h.</p></section>
          <section><h2>2. Quy trình hoàn tiền</h2><p>Gửi yêu cầu qua hệ thống → Xác minh → Xử lý trong 5-7 ngày làm việc.</p></section>
          <section><h2>3. Trường hợp không hoàn tiền</h2><p>Không hoàn tiền nếu người thuê vi phạm hợp đồng hoặc đã sử dụng dịch vụ quá thời hạn quy định.</p></section>
        </div>
      </div>
    </div>
  );
}
