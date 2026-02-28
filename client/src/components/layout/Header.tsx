'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSearch, FiHeart, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { ACCOMMODATION_TYPES } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="container-page">
        <div className={`flex items-center justify-between h-16 px-6 transition-all duration-300 rounded-3xl ${scrolled ? 'glass shadow-glass border-white/40' : 'bg-white/90 backdrop-blur-md shadow-sm border border-surface-200'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-neon transition-all duration-300 group-hover:-translate-y-0.5">
              <span className="text-white font-bold text-xl font-display">L</span>
            </div>
            <span className="text-2xl font-extrabold text-gradient font-display tracking-tight">LaPlace</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all ${catOpen ? 'text-primary-600 bg-primary-50' : 'text-surface-600 hover:text-primary-600 hover:bg-surface-100/50'}`}>
                Danh mục <FiChevronDown className={`transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 py-3 min-w-[240px] animate-slide-up grid grid-cols-1 gap-1">
                  {ACCOMMODATION_TYPES.map((t) => (
                    <Link key={t.slug} href={`/${t.slug}`} className="flex items-center gap-3 px-4 py-2.5 mx-2 hover:bg-surface-50 rounded-xl text-sm font-medium text-surface-700 hover:text-primary-600 transition-colors group/item">
                      <span className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center group-hover/item:bg-primary-100 group-hover/item:text-primary-600 transition-colors">{t.icon}</span> 
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {[
              { href: '/tim-phong', label: 'Tìm phòng' },
              { href: '/video-review', label: 'Video Review' },
              { href: '/tin-tuc', label: 'Tin tức' },
              { href: '/lien-he', label: 'Liên hệ' }
            ].map(link => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${pathname === link.href ? 'text-primary-600 bg-primary-50' : 'text-surface-600 hover:text-primary-600 hover:bg-surface-100/50'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link href="/tim-phong" className="w-10 h-10 lg:hidden flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
              <FiSearch className="text-lg" />
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <Link href="/tai-khoan/yeu-thich" className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <FiHeart className="text-lg" />
                </Link>
                <Link href="/tai-khoan/thong-bao" className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all relative">
                  <FiBell className="text-lg" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary-500 border-2 border-white rounded-full animate-pulse-slow" />
                </Link>
                <Link href="/tai-khoan" className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-surface-50 border border-surface-200 hover:border-primary-200 hover:bg-primary-50 rounded-full transition-all ml-2 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-105 transition-transform">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-surface-800">{user?.firstName}</span>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/dang-nhap" className="text-sm font-bold text-surface-700 hover:text-primary-600 transition-colors">Đăng nhập</Link>
                <Link href="/dang-ky" className="btn-primary rounded-full px-5 py-2.5 text-sm shadow-glass">Đăng ký</Link>
              </div>
            )}

            {/* Landlord CTA */}
            <Link href="/chu-tro/dang-tin" className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm bg-surface-900 text-white hover:bg-surface-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Đăng tin
            </Link>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="w-10 h-10 flex items-center justify-center text-surface-600 lg:hidden hover:bg-surface-100 rounded-full transition-colors">
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-[calc(100%+10px)] left-4 right-4 glass rounded-3xl p-4 shadow-xl border border-white/60 animate-slide-up transform origin-top">
            <nav className="flex flex-col gap-1.5">
              <div className="text-xs font-bold text-surface-400 uppercase tracking-wider px-3 mb-1 mt-2">Danh mục</div>
              {ACCOMMODATION_TYPES.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50/80 rounded-2xl text-sm font-semibold text-surface-700 transition-colors">
                  <span className="text-lg bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm">{t.icon}</span> 
                  {t.label}
                </Link>
              ))}
              <div className="h-px bg-surface-200/50 my-2 mx-2" />
              
              {/* Other Links */}
              {[
                { href: '/tim-phong', icon: '🔍', label: 'Tìm phòng' },
                { href: '/video-review', icon: '🎬', label: 'Video Review' },
                { href: '/tin-tuc', icon: '📰', label: 'Tin tức' },
                { href: '/lien-he', icon: '📞', label: 'Liên hệ' }
              ].map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50/80 rounded-2xl text-sm font-semibold text-surface-700">
                  <span className="text-base w-8 text-center">{link.icon}</span> {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="h-px bg-surface-200/50 my-2 mx-2" />
                  <Link href="/tai-khoan" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-2xl text-sm font-semibold text-primary-700">
                    <span className="text-base w-8 text-center">👤</span> Tài khoản của tôi
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-2xl text-sm font-semibold text-red-600 text-left w-full">
                    <span className="text-base w-8 text-center">🚪</span> Đăng xuất
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link href="/dang-nhap" className="btn-secondary w-full">Đăng nhập</Link>
                  <Link href="/dang-ky" className="btn-primary w-full">Đăng ký</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
