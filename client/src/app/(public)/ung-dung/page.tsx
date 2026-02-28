import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiSmartphone, FiUsers, FiFileText, FiAlertCircle, FiMessageCircle } from 'react-icons/fi';
export const metadata: Metadata = { title: 'Tải ứng dụng LaPlace' };
export default function AppPage() {
  const features = [
    { icon: <FiUsers />, title: 'Kết nối người thuê và chủ trọ', desc: 'Liên lạc trực tiếp, nhanh chóng' },
    { icon: <FiFileText />, title: 'Quản lý hợp đồng online', desc: 'Ký hợp đồng điện tử tiện lợi' },
    { icon: <FiSmartphone />, title: 'Nhận hóa đơn điện tử', desc: 'Theo dõi chi phí minh bạch' },
    { icon: <FiAlertCircle />, title: 'Báo cáo sự cố', desc: 'Gửi phản ánh nhanh tới chủ trọ' },
    { icon: <FiMessageCircle />, title: 'Nhắn tin trực tiếp', desc: 'Chat real-time trong ứng dụng' },
  ];
  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Ứng dụng' }]} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">📱 Tải ứng dụng LaPlace</h1>
          <p className="text-lg text-gray-500 mb-8">Quản lý việc thuê trọ mọi lúc mọi nơi</p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <button className="btn-primary btn-lg">🍎 App Store</button>
            <button className="btn-primary btn-lg">▶️ Google Play</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-2xl text-center hover:bg-primary-50 transition-colors">
              <div className="w-12 h-12 bg-primary-100 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
