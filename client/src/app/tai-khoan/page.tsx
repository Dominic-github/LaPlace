import { FiCalendar, FiFileText, FiDollarSign, FiHeart } from 'react-icons/fi';
import Link from 'next/link';

export default function AccountDashboard() {
  const stats = [
    { icon: <FiCalendar />, label: 'Đặt phòng', value: '3', color: 'bg-blue-50 text-blue-600', href: '/tai-khoan/dat-phong' },
    { icon: <FiFileText />, label: 'Hợp đồng', value: '1', color: 'bg-green-50 text-green-600', href: '/tai-khoan/hop-dong' },
    { icon: <FiDollarSign />, label: 'Thanh toán', value: '5', color: 'bg-amber-50 text-amber-600', href: '/tai-khoan/thanh-toan' },
    { icon: <FiHeart />, label: 'Yêu thích', value: '12', color: 'bg-red-50 text-red-600', href: '/tai-khoan/yeu-thich' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
      <div className="bg-white rounded-2xl border border-gray-100">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse shrink-0" />
            <div className="flex-1"><div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mb-1" /><div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse" /></div>
            <span className="text-xs text-gray-400">2 ngày trước</span>
          </div>
        ))}
      </div>
    </div>
  );
}
