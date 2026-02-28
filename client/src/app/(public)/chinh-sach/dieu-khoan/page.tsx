import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Điều khoản sử dụng' };
export default function DieuKhoanPage() {
  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Chính sách', href: '#' }, { label: 'Điều khoản sử dụng' }]} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Điều khoản sử dụng</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <section><h2>1. Giới thiệu</h2><p>Chào mừng bạn đến với LaPlace. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau đây.</p></section>
          <section><h2>2. Tài khoản người dùng</h2><p>Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình. Mỗi người chỉ được đăng ký một tài khoản.</p></section>
          <section><h2>3. Quy tắc đăng tin</h2><p>Thông tin đăng tải phải chính xác, trung thực. Cấm đăng tin lừa đảo, sai sự thật hoặc vi phạm pháp luật.</p></section>
          <section><h2>4. Thanh toán</h2><p>Mọi giao dịch thanh toán được thực hiện an toàn qua hệ thống của LaPlace. Chúng tôi không chịu trách nhiệm cho các giao dịch ngoài hệ thống.</p></section>
          <section><h2>5. Giải quyết tranh chấp</h2><p>LaPlace cam kết hỗ trợ giải quyết tranh chấp giữa người thuê và chủ nhà một cách công bằng và minh bạch.</p></section>
        </div>
      </div>
    </div>
  );
}
