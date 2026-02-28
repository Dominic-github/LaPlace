import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { locationApi } from '@/lib/api';

export const metadata: Metadata = { 
  title: 'Tỉnh thành nổi bật', 
  description: 'Tìm phòng trọ theo tỉnh thành trên toàn quốc' 
};

// Fallback colors for highlighted provinces
const COLORS = [
  'from-orange-400 to-red-500',
  'from-blue-400 to-indigo-500',
  'from-cyan-400 to-blue-500',
  'from-green-400 to-emerald-500',
  'from-purple-400 to-violet-500',
  'from-amber-400 to-orange-500',
];

export default async function TinhThanhPage() {
  let provinces: any[] = [];

  try {
    const res = await locationApi.getProvinces();
    if (res.data?.data) {
      provinces = res.data.data;
      // Optionally sort by count if the API returns accommodation count
      provinces.sort((a, b) => (b.accommodations_count || 0) - (a.accommodations_count || 0));
    }
  } catch (error) {
    console.error('Failed to fetch provinces', error);
  }

  const limitFeatured = provinces.slice(0, 6);

  return (
    <div className="container-page pb-16 pt-4">
      <Breadcrumbs items={[{ label: 'Tỉnh thành' }]} />
      
      <div className="mb-10 mt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Khám phá theo Tỉnh thành</h1>
        <p className="text-gray-500">Danh sách các khu vực có phòng trọ, căn hộ cho thuê trên toàn quốc</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-5">🔥 Nổi bật nhất</h2>
      {limitFeatured.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {limitFeatured.map((p, idx) => (
            <Link key={p.code} href={`/tinh-thanh/${p.code_name || p.code}?code=${p.code}`} className="relative rounded-3xl overflow-hidden group h-44 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 block">
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[idx % COLORS.length]}`} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-6 text-white text-shadow-sm">
                <h3 className="text-2xl font-bold mb-1 group-hover:scale-105 origin-left transition-transform">{p.name}</h3>
                <p className="text-sm font-medium text-white/90">{p.accommodations_count || 0} phòng cho thuê</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
         <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-2xl mb-12">Chưa có dữ liệu tỉnh thành.</div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-5">📍 Tất cả tỉnh thành ({provinces.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {provinces.map(p => (
          <Link key={p.code} href={`/tinh-thanh/${p.code_name || p.code}?code=${p.code}`} className="flex items-center justify-between p-4 bg-white border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md rounded-2xl transition-all group">
            <span className="text-sm font-bold text-gray-700 group-hover:text-primary-600 truncate mr-2">{p.name}</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">{p.accommodations_count || 0}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
