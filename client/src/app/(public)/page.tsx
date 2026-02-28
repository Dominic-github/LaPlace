import Link from 'next/link';
import SearchBar from '@/components/shared/SearchBar';
import { ACCOMMODATION_TYPES, formatCurrency, slugify } from '@/lib/utils';
import { FiCheckCircle, FiSearch, FiKey, FiShield, FiHeadphones, FiArrowRight, FiStar, FiMapPin } from 'react-icons/fi';
import type { Metadata } from 'next';
import { accommodationApi, statsApi } from '@/lib/api';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'LaPlace - Nền tảng thuê phòng thông minh hiện đại',
  description: 'Tìm kiếm phòng trọ, nhà nguyên căn, căn hộ, ký túc xá cho thuê uy tín, giá rẻ toàn quốc. Giao diện trực quan, hợp đồng số an toàn.',
};

export default async function HomePage() {
  let stats = { total_accommodations: 10000, total_provinces: 50, satisfaction_rate: 98 };
  let featuredListings: any[] = [];

  try {
    const [statsRes, featuredRes] = await Promise.all([
      statsApi.getOverview(),
      accommodationApi.getFeatured({ limit: 8 })
    ]);
    if (statsRes.data?.data) stats = statsRes.data.data;
    if (featuredRes.data?.data) featuredListings = featuredRes.data.data;
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
  }

  // Format numbers for display
  const formatStat = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    return num + '+';
  };

  return (
    <>
      {/* ======================= HERO SECTION ======================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface-50 -mt-32 md:-mt-36 pt-32 md:pt-36">
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary-400/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-accent/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="container-page relative z-10 py-12 md:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8 border border-white/60 shadow-glass">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-surface-700 font-semibold text-sm tracking-wide">Nền tảng PROP-TECH #1 Việt Nam</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 leading-[1.1] mb-8 font-display tracking-tight">
              Tìm không gian sống <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 pb-2 inline-block">
                chuẩn gu của bạn
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-surface-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Trải nghiệm thuê chổ ở thông minh với hàng ngàn không gian tuyệt đẹp đã được xác minh. Hợp đồng rõ ràng, dọn vào ngay.
            </p>
            
            {/* Search Bar Container */}
            <div className="max-w-4xl mx-auto glass p-3 md:p-4 rounded-3xl shadow-soft border border-white/60">
              <SearchBar />
            </div>
            
            {/* Quick Stats */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-surface-600">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-surface-800">{formatStat(stats.total_accommodations)}</span>
                <span className="text-sm font-medium mt-1">Phòng đã duyệt</span>
              </div>
              <div className="w-px h-12 bg-surface-200 hidden md:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-surface-800">{stats.total_provinces}+</span>
                <span className="text-sm font-medium mt-1">Tỉnh thành</span>
              </div>
              <div className="w-px h-12 bg-surface-200 hidden md:block"></div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-surface-800">{stats.satisfaction_rate}%</span>
                <span className="text-sm font-medium mt-1">Hài lòng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CATEGORIES ======================= */}
      <section className="container-page pb-20 pt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ACCOMMODATION_TYPES.map((t, i) => (
            <Link key={t.slug} href={`/${t.slug}`} className="flex flex-col p-6 glass rounded-3xl border border-white/50 hover:border-primary-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface-100 to-white flex items-center justify-center text-3xl mb-5 shadow-sm group-hover:bg-gradient-to-br group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:text-white transition-all">
                {t.icon}
              </div>
              <h3 className="font-bold text-surface-900 text-lg mb-1">{t.label}</h3>
              <p className="text-sm text-surface-500 font-medium group-hover:text-primary-600 transition-colors flex items-center gap-1">
                Khám phá ngay <FiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================= FEATURED LISTINGS ======================= */}
      <section className="bg-white py-24 relative">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 mb-4 font-display tracking-tight">Không gian nổi bật</h2>
              <p className="text-lg text-surface-500 font-medium">Bất động sản được đánh giá cao nhất tuần qua</p>
            </div>
            <Link href="/tim-phong" className="btn-secondary rounded-full px-6 group shrink-0">
              Xem tất cả danh sách 
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {featuredListings.length > 0 ? (
              featuredListings.map((listing: any) => {
                const typeInfo = ACCOMMODATION_TYPES.find(t => t.slug === listing.type);
                return (
                <Link href={`/${listing.type}/${slugify(listing.name)}?id=${listing.accommodation_id}`} key={listing.accommodation_id} className="group block rounded-2xl bg-white border border-surface-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <Image 
                        src={listing.images[0].image_url} 
                        alt={listing.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50"></div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Type badge */}
                    {typeInfo && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600/90 backdrop-blur-sm rounded-lg text-[11px] font-bold text-white tracking-wide uppercase">
                        {typeInfo.icon} {typeInfo.label}
                      </div>
                    )}
                    
                    {/* Rating */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-bold text-surface-800 shadow-sm flex items-center gap-1">
                      <FiStar className="text-amber-400 fill-amber-400 w-3.5 h-3.5" /> 4.9
                    </div>

                    {/* Price overlay on hover */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between">
                        <span className="font-bold text-primary-600 text-sm">{formatCurrency(Number(listing.price))}/tháng</span>
                        <span className="text-xs text-surface-500 font-medium">{listing.area} m²</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-surface-900 text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-[2.75rem]" title={listing.name}>
                      {listing.name}
                    </h3>
                    <p className="text-surface-400 text-xs font-medium flex items-center gap-1 mb-3 line-clamp-1">
                      <FiMapPin className="text-surface-300 shrink-0 w-3.5 h-3.5" /> {listing.location}
                    </p>
                    
                    {/* Info row */}
                    <div className="flex items-center gap-3 text-xs text-surface-500 mb-3 pb-3 border-b border-surface-50">
                      {listing.bedrooms && (
                        <span className="flex items-center gap-1">🛏 {listing.bedrooms} PN</span>
                      )}
                      {listing.bathrooms && (
                        <span className="flex items-center gap-1">🚿 {listing.bathrooms} WC</span>
                      )}
                      <span className="flex items-center gap-1">📐 {listing.area} m²</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-primary-600 font-display text-lg tracking-tight">
                        {formatCurrency(Number(listing.price))}
                        <span className="text-[10px] text-surface-400 font-medium ml-0.5">/tháng</span>
                      </span>
                      <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        Xem →
                      </span>
                    </div>
                  </div>
                </Link>
              )})
            ) : (
              [...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-surface-100 overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-surface-100 to-surface-50 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-surface-100 rounded-lg w-4/5 animate-pulse" />
                    <div className="h-4 bg-surface-100 rounded-lg w-3/5 animate-pulse" />
                    <div className="h-px bg-surface-50 my-2" />
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-surface-100 rounded-lg w-1/3 animate-pulse" />
                      <div className="h-8 bg-surface-100 rounded-full w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-14 text-center md:hidden">
            <Link href="/tim-phong" className="btn-primary rounded-full w-full">Khám phá tất cả phòng trọ</Link>
          </div>
        </div>
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className="py-24 bg-surface-50 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/50 rounded-full blur-[100px]"></div>
        <div className="container-page relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-surface-900 mb-4 font-display tracking-tight">Thuê nhà dễ như đặt xe</h2>
            <p className="text-lg text-surface-500 font-medium mx-auto max-w-xl">Trải nghiệm dọn vào nhà mới mượt mà, minh bạch với quy trình trực tuyến 100%</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-surface-200 z-0 border-t-2 border-dashed border-surface-300"></div>

            {[
              { icon: <FiSearch />, step: '01', title: 'Tìm kiếm & Chọn lọc', desc: 'Sử dụng bộ lọc thông minh để tìm không gian phù hợp với nhu cầu và ngân sách của bạn' },
              { icon: <FiCheckCircle />, step: '02', title: 'Đặt phòng trực tuyến', desc: 'Liên hệ chủ nhà, chốt lịch xem nhà và đặt phòng ngay trên hệ thống LaPlace' },
              { icon: <FiKey />, step: '03', title: 'Ký HĐ & Nhận chìa khóa', desc: 'Ký hợp đồng điện tử pháp lý rõ ràng, thanh toán an toàn và dọn đồ đến ở' },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-32 h-32 rounded-full glass border-2 border-white shadow-xl flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl shadow-inner shadow-white/20">
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-surface-900 text-white flex items-center justify-center font-extrabold shadow-lg border-2 border-white">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{s.title}</h3>
                <p className="text-surface-500 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= WHY CHOOSE US ======================= */}
      <section className="bg-surface-900 py-24 text-white relative overflow-hidden">
        {/* Dark theme decors */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-secondary-900/40 to-transparent"></div>
        
        <div className="container-page relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-secondary-400 font-bold tracking-widest uppercase text-sm mb-4 block">Bảo chứng niềm tin</span>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-display tracking-tight leading-tight">Tại sao Gen-Z tin chọn LaPlace?</h2>
              <p className="text-surface-400 text-lg mb-8 font-medium">Chúng tôi xây dựng hệ sinh thái thuê trọ công bằng, nói KHÔNG với cò mồi, lừa đảo và giá đăng ảo.</p>
              <div className="flex gap-4">
                <Link href="/tim-phong" className="btn bg-white text-surface-900 hover:bg-surface-100 rounded-full px-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]">Tìm phòng ngay</Link>
                <Link href="/gioi-thieu" className="btn-ghost text-white hover:bg-white/10 rounded-full px-6">Tìm hiểu thêm</Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[
                { icon: <FiShield />, title: '100% Xác Minh', color: 'from-blue-500 to-indigo-600' },
                { icon: <FiCheckCircle />, title: 'Hợp Đồng Số', color: 'from-emerald-400 to-teal-500' },
                { icon: <FiKey />, title: 'Thanh Toán An Toàn', color: 'from-orange-400 to-red-500' },
                { icon: <FiHeadphones />, title: 'Hỗ Trợ 24/7', color: 'from-fuchsia-500 to-pink-600' },
              ].map((f, i) => (
                <div key={i} className="glass-dark rounded-3xl p-6 hover:-translate-y-1 transition-transform border border-white/10 hover:border-white/30">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white text-2xl mb-5 shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                  <p className="text-surface-400 text-sm font-medium">Bảo vệ quyền lợi tối đa cho người thuê và cho thuê.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CTA LANDLORD SECTION ======================= */}
      <section className="py-24 bg-white relative">
        <div className="container-page">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-primary-600 to-secondary-500 p-8 md:p-16 text-center shadow-2xl">
            {/* Glowing inner effect */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 font-display tracking-tight drop-shadow-md">Bạn có phòng trống?</h2>
              <p className="text-white/90 text-xl font-medium mb-10 leading-relaxed">
                Đăng tin hoàn toàn miễn phí, quản lý hợp đồng số và nhận tiền trọ tận tay với hệ thống mạnh mẽ từ LaPlace.
              </p>
              <Link href="/chu-tro/dang-tin" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-surface-900 font-extrabold text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                Đăng tin cho thuê ngay <FiArrowRight className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
