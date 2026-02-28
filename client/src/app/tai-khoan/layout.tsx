'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FiHome, FiCalendar, FiFileText, FiDollarSign, FiStar, FiHeart, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/tai-khoan', icon: <FiHome />, label: 'Dashboard' },
  { href: '/tai-khoan/dat-phong', icon: <FiCalendar />, label: 'Đặt phòng' },
  { href: '/tai-khoan/hop-dong', icon: <FiFileText />, label: 'Hợp đồng' },
  { href: '/tai-khoan/thanh-toan', icon: <FiDollarSign />, label: 'Thanh toán' },
  { href: '/tai-khoan/danh-gia', icon: <FiStar />, label: 'Đánh giá' },
  { href: '/tai-khoan/yeu-thich', icon: <FiHeart />, label: 'Yêu thích' },
  { href: '/tai-khoan/thong-bao', icon: <FiBell />, label: 'Thông báo' },
  { href: '/tai-khoan/thong-tin', icon: <FiUser />, label: 'Thông tin cá nhân' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-gray-50 pt-28">
        <div className="container-page py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-20">
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">{user?.firstName?.[0] || 'U'}</div>
                  <div><p className="font-semibold text-gray-900 text-sm">{user?.firstName || 'Người dùng'}</p><p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p></div>
                </div>
                <nav className="space-y-1">
                  {NAV.map(n => (
                    <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${pathname === n.href ? 'bg-primary-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {n.icon} {n.label}
                    </Link>
                  ))}
                  <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full transition-colors mt-2"><FiLogOut /> Đăng xuất</button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
