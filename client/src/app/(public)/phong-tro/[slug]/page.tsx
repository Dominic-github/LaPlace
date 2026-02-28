import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiStar, FiMapPin, FiMaximize, FiHeart, FiShare2, FiPhone, FiMessageCircle, FiCalendar } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import { accommodationApi } from '@/lib/api';
import { formatCurrency, ACCOMMODATION_TYPES, slugify } from '@/lib/utils';
import Image from 'next/image';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const sp = await searchParams;
  if (sp.id) {
    try {
      const res = await accommodationApi.getById(sp.id);
      if (res.data?.data) {
        return { title: res.data.data.name };
      }
    } catch (e) {}
  }
  return { title: 'Chi tiết phòng' };
}

export default async function AccommodationDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ id?: string }> }) {
  const [resolvedParams, sp] = await Promise.all([params, searchParams]);
  const accommodationId = sp.id;
  let accommodation: any = null;

  if (accommodationId) {
    try {
      const res = await accommodationApi.getById(accommodationId);
      accommodation = res.data?.data;
    } catch (error) {
      console.error('Failed to fetch accommodation details:', error);
    }
  }

  if (!accommodation) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy phòng</h1>
        <Link href="/" className="btn-primary">Về trang chủ</Link>
      </div>
    );
  }

  // Related properties (for now, simply featured items mapped as placeholders)
  let related: any[] = [];
  try {
    const res = await accommodationApi.getFeatured({ limit: 4, type: accommodation.type });
    related = res.data?.data || [];
  } catch (e) {}

  const typeData = ACCOMMODATION_TYPES.find(t => t.slug === accommodation.type) || ACCOMMODATION_TYPES[0];

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[
        { label: typeData.label, href: `/${accommodation.type}` }, 
        { label: accommodation.name }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden aspect-[4/3] md:aspect-video bg-gray-100">
            {accommodation.images && accommodation.images.length > 0 ? (
              <>
                <div className={`relative ${accommodation.images.length === 1 ? 'col-span-4 row-span-2' : 'col-span-4 md:col-span-2 md:row-span-2'}`}>
                  <Image src={accommodation.images[0].image_url} alt="Image 1" fill className="object-cover" />
                </div>
                {accommodation.images.slice(1, 5).map((img: any, idx: number) => {
                  const isLast = idx === 3 && accommodation.images.length > 5;
                  return (
                    <div key={img.image_id} className="hidden md:block relative aspect-[4/3]">
                      <Image src={img.image_url} alt={`Image ${idx + 2}`} fill className="object-cover" />
                      {isLast && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black/60 transition-colors">
                          +{accommodation.images.length - 4} ảnh
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="col-span-4 row-span-2 flex items-center justify-center text-gray-400">Không có hình ảnh</div>
            )}
          </div>

          {/* Title & Actions */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="badge-primary">{typeData.label}</span>
                  <span className={`badge-success ${accommodation.status !== 'available' ? 'bg-red-100 text-red-600' : ''}`}>
                    {accommodation.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{accommodation.name}</h1>
                <p className="flex items-center gap-1 text-gray-500"><FiMapPin className="w-4 h-4 text-gray-400" /> {accommodation.location}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"><FiHeart className="w-5 h-5" /></button>
                <button className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary-200 transition-colors shadow-sm"><FiShare2 className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map(s => <FiStar key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />)}
              <span className="text-sm font-medium text-gray-600 ml-1">
                4.8 <span className="text-gray-400 font-normal">({accommodation.reviews?.length || 0} đánh giá)</span>
              </span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50/80 border border-gray-100 rounded-2xl">
            {[
              { icon: <FiMaximize />, label: 'Diện tích', value: `${accommodation.area} m²` },
              { icon: <IoBedOutline />, label: 'Phòng ngủ', value: accommodation.bedrooms || '1' },
              { icon: <LuBath />, label: 'Phòng tắm', value: accommodation.bathrooms || '1' },
              { icon: <FiCalendar />, label: 'Đặt cọc', value: `${accommodation.deposit_months || 1} tháng` },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 text-primary shadow-sm">{s.icon}</div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">{s.label}</p>
                <p className="font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {['Mô tả', 'Tiện nghi', 'Vị trí', 'Đánh giá'].map((tab, i) => (
                <button key={tab} className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{tab}</button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
            {accommodation.description}
          </div>

          {/* Facilities */}
          {accommodation.facilities && accommodation.facilities.length > 0 && (
            <div className="pt-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Tiện nghi có sẵn</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {accommodation.facilities.map((f: any) => (
                  <div key={f.facility_id} className="flex items-center gap-3 p-3 lg:p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs shrink-0">✓</span> {f.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center justify-between">
              Đánh giá ({accommodation.reviews?.length || 0})
              <button className="text-sm font-medium text-primary hover:underline">Viết đánh giá</button>
            </h3>
            <div className="space-y-4">
              {accommodation.reviews && accommodation.reviews.length > 0 ? (
                accommodation.reviews.map((r: any) => (
                  <div key={r.review_id} className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {r.user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{r.user?.full_name || 'Người dùng ẩn danh'}</p>
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <FiStar key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-xl">Chưa có đánh giá nào cho phòng này.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="text-center mb-6 py-4 bg-gray-50 rounded-2xl">
                <p className="text-3xl font-extrabold text-primary">{formatCurrency(Number(accommodation.price))}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">/ tháng</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="input-label">Ngày dự kiến vào ở</label>
                  <input type="date" className="input-field shadow-sm bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="input-label">Số người ở</label>
                  <select className="input-field shadow-sm bg-gray-50 focus:bg-white">
                    <option>1 người</option>
                    <option>2 người</option>
                    <option>3 người</option>
                    <option>4+ người</option>
                  </select>
                </div>
              </div>

              <button className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Gửi yêu cầu đặt phòng
              </button>
              <button className="btn-secondary w-full py-3.5 mt-3 text-base font-semibold group">
                <FiMessageCircle className="group-hover:scale-110 transition-transform" /> Chat với chủ phòng
              </button>
            </div>

            {/* Landlord Info */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thông tin chủ phòng</h4>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                  {accommodation.user?.full_name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{accommodation.user?.full_name || 'Chưa cập nhật'}</p>
                  <p className="text-xs font-semibold text-green-600 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Đã xác minh danh tính
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <a href={`tel:${accommodation.user?.phone || ''}`} className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-primary py-3 rounded-xl transition-colors border border-gray-200">
                  <FiPhone className="w-4 h-4 text-primary" /> {accommodation.user?.phone || 'Liên hệ để xem'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20 pt-10 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display">Phòng trọ tương tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((listing: any) => (
               <Link href={`/${listing.type}/${slugify(listing.name)}?id=${listing.accommodation_id}`} key={listing.accommodation_id} className="card group block">
                 <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                   {listing.images && listing.images.length > 0 ? (
                       <Image src={listing.images[0].image_url} alt={listing.name || 'Image'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                       <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                   )}
                   <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow flex gap-1 items-center">
                       <FiStar className="text-accent fill-accent" /> 4.9
                   </div>
                 </div>
                 <div className="p-4 border border-t-0 border-gray-100 rounded-b-2xl">
                   <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">{listing.name}</h3>
                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                     <span className="font-bold text-primary text-lg">{formatCurrency(Number(listing.price))}</span>
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.area} m²</span>
                   </div>
                 </div>
               </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
