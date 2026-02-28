import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export const metadata: Metadata = { title: 'Chính sách bảo mật' };
export default function BaoMatPage() {
  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Chính sách', href: '#' }, { label: 'Bảo mật' }]} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chính sách bảo mật</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <section><h2>1. Thu thập thông tin</h2><p>Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đăng tin hoặc sử dụng dịch vụ.</p></section>
          <section><h2>2. Sử dụng thông tin</h2><p>Thông tin của bạn được sử dụng để cung cấp dịch vụ, cải thiện trải nghiệm và liên lạc khi cần thiết.</p></section>
          <section><h2>3. Bảo vệ thông tin</h2><p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin cá nhân của bạn.</p></section>
          <section><h2>4. Chia sẻ thông tin</h2><p>Chúng tôi không bán hoặc chia sẻ thông tin cá nhân cho bên thứ ba mà không có sự đồng ý của bạn.</p></section>
        </div>
      </div>
    </div>
  );
}
