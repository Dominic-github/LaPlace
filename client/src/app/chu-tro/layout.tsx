'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiHome, FiPlusCircle, FiList, FiInbox, FiFileText, FiDollarSign, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/chu-tro', icon: <FiHome />, label: 'Dashboard' },
  { href: '/chu-tro/dang-tin', icon: <FiPlusCircle />, label: 'Đăng tin' },
  { href: '/chu-tro/tin-dang', icon: <FiList />, label: 'Tin đăng' },
  { href: '/chu-tro/yeu-cau-dat-phong', icon: <FiInbox />, label: 'Yêu cầu đặt phòng' },
  { href: '/chu-tro/hop-dong', icon: <FiFileText />, label: 'Hợp đồng' },
  { href: '/chu-tro/thu-chi', icon: <FiDollarSign />, label: 'Thu chi' },
  { href: '/chu-tro/thong-ke', icon: <FiBarChart2 />, label: 'Thống kê' },
];

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-gray-50 pt-28">
        <div className="container-page py-6">
          <div className="flex gap-6">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">{user?.firstName?.[0] || 'C'}</div>
                  <div><p className="font-semibold text-gray-900 text-sm">{user?.firstName || 'Chủ trọ'}</p><p className="text-xs text-accent font-medium">Chủ trọ ✓</p></div>
                </div>
                <nav className="space-y-1">
                  {NAV.map(n => (
                    <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${pathname === n.href ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {n.icon} {n.label}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <Link href="/tai-khoan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">👤 Tài khoản</Link>
                  <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full"><FiLogOut /> Đăng xuất</button>
                </nav>
              </div>
            </aside>
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
