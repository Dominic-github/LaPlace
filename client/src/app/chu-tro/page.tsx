import Link from 'next/link';
import { FiHome, FiInbox, FiDollarSign, FiList, FiTrendingUp, FiPercent } from 'react-icons/fi';

export default function LandlordDashboard() {
  const stats = [
    { icon: <FiHome />, label: 'Phòng trọ', value: '8', sub: '6 đang thuê', color: 'bg-blue-50 text-blue-600' },
    { icon: <FiInbox />, label: 'Yêu cầu mới', value: '3', sub: '2 chờ duyệt', color: 'bg-amber-50 text-amber-600' },
    { icon: <FiDollarSign />, label: 'Doanh thu tháng', value: '28.000.000', sub: '+12% vs tháng trước', color: 'bg-green-50 text-green-600' },
    { icon: <FiPercent />, label: 'Tỉ lệ lấp đầy', value: '75%', sub: '6/8 phòng', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Chủ trọ</h1>
        <Link href="/chu-tro/dang-tin" className="btn-accent btn-sm">+ Đăng tin mới</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value.includes('.') ? s.value + ' đ' : s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-xs text-green-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">📈 Doanh thu 6 tháng</h2>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">Chart Area - Doanh thu theo tháng</div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Yêu cầu gần đây</h2>
          <Link href="/chu-tro/yeu-cau-dat-phong" className="text-sm text-primary hover:underline">Xem tất cả →</Link>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 bg-primary-100 text-primary rounded-full flex items-center justify-center font-bold text-sm">N</div>
            <div className="flex-1"><p className="text-sm font-medium text-gray-900">Nguyễn Văn A</p><p className="text-xs text-gray-500">Đặt phòng trọ Quận 1 — 3.5tr/tháng</p></div>
            <span className="badge-warning text-[10px]">Chờ duyệt</span>
          </div>
        ))}
      </div>
    </div>
  );
}
