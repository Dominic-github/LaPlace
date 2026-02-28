import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { ACCOMMODATION_TYPES, formatCurrency, slugify } from '@/lib/utils';
import Pagination from '@/components/shared/Pagination';
import { locationApi, accommodationApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiStar } from 'react-icons/fi';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ code?: string }> }): Promise<Metadata> {
  const [resolvedParams, sp] = await Promise.all([params, searchParams]);
  const code = sp.code;
  if (code) {
    try {
       const res = await locationApi.getProvinceByCode(code);
       if (res.data?.data) return { title: `Thuê phòng trọ tại ${res.data.data.name}` };
    } catch (e) {}
  }
  const name = resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return { title: `Thuê phòng trọ tại ${name}` };
}

export default async function TinhThanhDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ code?: string, page?: string, type?: string, district?: string }> }) {
  const [resolvedParams, sp] = await Promise.all([params, searchParams]);
  const code = sp.code;
  const page = sp.page ? parseInt(sp.page as string) : 1;
  const typeFilter = sp.type || 'all';
  const districtCode = sp.district || '';

  let province: any = null;
  let wards: any[] = [];
  let accommodations: any[] = [];
  let pagination = { totalPages: 1, total: 0 };

  if (code) {
    try {
      const [provRes, wardsRes, accRes] = await Promise.all([
        locationApi.getProvinceByCode(code),
        locationApi.getWardsByProvince(code),
        accommodationApi.getAll({ 
          province_code: code, 
          ward_code: districtCode || undefined,
          type: typeFilter === 'all' ? undefined : typeFilter,
          page, 
          limit: 12 
        })
      ]);
      
      if (provRes.data?.data) province = provRes.data.data;
      if (wardsRes.data?.data) wards = wardsRes.data.data;
      if (accRes.data?.data) {
        accommodations = accRes.data.data.items;
        pagination = accRes.data.data.pagination;
      }
    } catch (error) {
      console.error('Failed to fetch province details:', error);
    }
  }

  const displayName = province?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const baseUrl = `/tinh-thanh/${params.slug}?code=${code}`;

  return (
    <div className="container-page pb-16 pt-4">
      <Breadcrumbs items={[{ label: 'Tỉnh thành', href: '/tinh-thanh' }, { label: displayName }]} />
      
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Cho thuê phòng trọ tại {displayName}</h1>
        <p className="text-gray-500">Khám phá {pagination.total || 0} phòng trọ, nhà nguyên căn, căn hộ tại {displayName}</p>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <Link 
          href={`${baseUrl}${districtCode ? `&district=${districtCode}` : ''}`} 
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${typeFilter === 'all' ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'}`}
        >
          Tất cả
        </Link>
        {ACCOMMODATION_TYPES.map(t => (
          <Link 
            key={t.slug} 
            href={`${baseUrl}&type=${t.slug}${districtCode ? `&district=${districtCode}` : ''}`} 
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${typeFilter === t.slug ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'}`}
          >
            {t.icon} {t.label}
          </Link>
        ))}
      </div>

      {/* District chips */}
      {wards.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <span className="text-sm font-bold text-gray-700 mr-2 flex items-center gap-1"><FiMapPin className="text-primary" /> Phường/Xã/Quận:</span>
          {districtCode && (
            <Link href={`${baseUrl}&type=${typeFilter}`} className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              ✕ Xóa chọn
            </Link>
          )}
          {wards.map(w => (
            <Link 
              key={w.code} 
              href={`${baseUrl}&type=${typeFilter}&district=${w.code}`} 
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1 ${districtCode === w.code ? 'bg-primary-50 border border-primary-200 text-primary-700 shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary'}`}
            >
              {w.name}
              {w.accommodations_count ? <span className="opacity-60 text-xs text-inherit">({w.accommodations_count})</span> : null}
            </Link>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {accommodations.length > 0 ? (
          accommodations.map((listing: any) => (
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
                 <p className="text-sm text-gray-500 line-clamp-1 mb-3 flex items-center gap-1 opacity-80">
                   <FiMapPin className="text-gray-400" /> {listing.location}
                 </p>
                 <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                   <span className="font-bold text-primary text-lg">{formatCurrency(Number(listing.price))}</span>
                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{listing.area} m²</span>
                 </div>
               </div>
             </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Chưa có phòng trọ nào phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        baseUrl={`/tinh-thanh/${params.slug}`}
        extraParams={`&code=${code}&type=${typeFilter}${districtCode ? `&district=${districtCode}` : ''}`}
      />
    </div>
  );
}
