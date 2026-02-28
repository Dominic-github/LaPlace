import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { accommodationApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, slugify } from '@/lib/utils';
import { FiMapPin, FiStar } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';

export const metadata: Metadata = { 
  title: 'Phòng trọ cho thuê', 
  description: 'Cho thuê phòng trọ giá rẻ, uy tín, chính chủ toàn quốc' 
};

export default async function PhongTroPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  let listings: any[] = [];
  let pagination = { totalPages: 1, total: 0 };

  try {
    const res = await accommodationApi.getAll({ type: 'phong-tro', page, limit: 12 });
    if (res.data?.data) {
      listings = res.data.data.items;
      pagination = res.data.data.pagination;
    }
  } catch (error) {
    console.error('Error fetching Phong tro:', error);
  }

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Phòng trọ' }]} />
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Phòng trọ cho thuê</h1>
        <p className="text-gray-500">Hàng ngàn phòng trọ giá rẻ, trực tiếp chính chủ, không qua trung gian</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-xl">
        <Link href="/tim-phong?type=phong-tro" className="btn-primary btn-sm px-6">
          Sử dụng bộ lọc chi tiết
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {listings.length > 0 ? (
          listings.map((listing: any) => (
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
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-lg">{formatCurrency(Number(listing.price))} <span className="text-xs text-gray-400 font-normal">/tháng</span></span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.area} m²</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">Hiện chưa có phòng trọ nào phù hợp.</p>
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={pagination.totalPages} baseUrl="/phong-tro" />
    </div>
  );
}
