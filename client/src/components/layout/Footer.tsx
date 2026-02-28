import Link from 'next/link';
import { ACCOMMODATION_TYPES } from '@/lib/utils';
import { FiFacebook, FiYoutube, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 relative overflow-hidden border-t border-surface-800">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-primary-600/20 via-secondary-500/20 to-accent/20 blur-3xl opacity-50 rounded-full shrink-0 pointers-event-none"></div>

      {/* Main Footer */}
      <div className="container-page py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group w-max">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-neon group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-xl font-display">L</span>
              </div>
              <span className="text-2xl font-extrabold text-white font-display tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-300 group-hover:to-secondary-300 transition-all">LaPlace</span>
            </Link>
            <p className="text-sm leading-relaxed text-surface-400 mb-6 font-medium">
              Nền tảng tìm kiếm phòng trọ, nhà nguyên căn, căn hộ cho thuê thông minh, hiện đại và uy tín hàng đầu Việt Nam.
            </p>
            <div className="flex gap-3 mt-auto">
              {[
                { icon: <FiFacebook />, href: '#' },
                { icon: <FiYoutube />, href: '#' },
                { icon: <FiTwitter />, href: '#' },
                { icon: <FiInstagram />, href: '#' }
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-10 h-10 bg-surface-800 hover:bg-gradient-to-tr hover:from-primary-600 hover:to-secondary-500 rounded-full flex items-center justify-center text-white text-lg transition-all shadow-sm hover:shadow-neon hover:-translate-y-1">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Danh mục</h4>
            <ul className="space-y-3.5">
              {ACCOMMODATION_TYPES.map(t => (
                <li key={t.slug}>
                  <Link href={`/${t.slug}`} className="text-sm font-medium hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-700 group-hover:bg-primary-500 transition-colors"></span>
                    {t.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/video-review" className="text-sm font-medium hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-surface-700 group-hover:bg-primary-500 transition-colors"></span>
                  Video Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Giới thiệu về chúng tôi', href: '/gioi-thieu' },
                { label: 'Liên hệ', href: '/lien-he' },
                { label: 'Tin tức & Blog', href: '/tin-tuc' },
                { label: 'Điều khoản sử dụng', href: '/chinh-sach/dieu-khoan' },
                { label: 'Chính sách bảo mật', href: '/chinh-sach/bao-mat' },
                { label: 'Chính sách hoàn tiền', href: '/chinh-sach/hoan-tien' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm font-medium hover:text-secondary-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-700 group-hover:bg-secondary-500 transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-wide">Thâm tin liên hệ</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3 group">
                <FiMapPin className="text-primary-500 text-lg shrink-0 mt-0.5" /> 
                <span className="group-hover:text-white transition-colors">123 Đường Ngọc Trai, KĐT Mỹ Gia, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 group">
                <FiPhone className="text-primary-500 text-lg shrink-0" /> 
                <a href="tel:0123456789" className="hover:text-white transition-colors text-lg font-bold tracking-wider text-surface-200">0123 456 789</a>
              </li>
              <li className="flex items-center gap-3 group">
                <FiMail className="text-primary-500 text-lg shrink-0" /> 
                <a href="mailto:hello@laplace.vn" className="hover:text-white transition-colors">hello@laplace.vn</a>
              </li>
              <li className="flex items-center gap-3 group">
                <FiClock className="text-primary-500 text-lg shrink-0" /> 
                <span className="group-hover:text-white transition-colors">8:00 - 22:00, Tất cả các ngày</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              <Link href="/ung-dung" className="flex-1 flex flex-col items-center justify-center py-2.5 bg-surface-800 hover:bg-primary-600 rounded-xl transition-colors border border-surface-700 hover:border-primary-500">
                <span className="text-[10px] text-surface-400 uppercase font-bold tracking-widest mb-0.5">Tải trên</span>
                <span className="text-sm font-bold text-white">App Store</span>
              </Link>
              <Link href="/ung-dung" className="flex-1 flex flex-col items-center justify-center py-2.5 bg-surface-800 hover:bg-secondary-600 rounded-xl transition-colors border border-surface-700 hover:border-secondary-500">
                <span className="text-[10px] text-surface-400 uppercase font-bold tracking-widest mb-0.5">Tải trên</span>
                <span className="text-sm font-bold text-white">Google Play</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Separator */}
      <div className="border-t border-surface-800/50 bg-surface-950/50">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-surface-500">
          <p>© {new Date().getFullYear()} LaPlace Platform. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link href="/chinh-sach/dieu-khoan" className="hover:text-white transition-colors">Điều khoản</Link>
            <div className="w-1 h-1 bg-surface-700 rounded-full"></div>
            <Link href="/chinh-sach/bao-mat" className="hover:text-white transition-colors">Bảo mật</Link>
            <div className="w-1 h-1 bg-surface-700 rounded-full"></div>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
