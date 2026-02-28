import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { accommodationApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { FiCheck, FiX } from 'react-icons/fi';

export const metadata: Metadata = { title: 'So sánh phòng', description: 'So sánh các phòng trọ để chọn phòng phù hợp nhất' };

export default async function SoSanhPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const params = await searchParams;
  const idsParam = params.ids;
  let accommodations: any[] = [];

  if (idsParam) {
    const ids = idsParam.split(',').filter(id => id.trim() !== '');
    if (ids.length > 0) {
      try {
        const promises = ids.slice(0, 4).map(id => accommodationApi.getById(id));
        const results = await Promise.all(promises);
        accommodations = results.map(res => res.data?.data).filter(item => item != null);
      } catch (error) {
         console.error('Lỗi lấy dữ liệu so sánh:', error);
      }
    }
  }

  // Define 4 columns total max for comparison
  const cols = [0, 1, 2, 3];

  return (
    <div className="container-page pb-16 pt-4">
      <Breadcrumbs items={[{ label: 'So sánh phòng' }]} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 mt-4">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">⚖️ So sánh phòng</h1>
            <p className="text-gray-500">Đối chiếu chi tiết các phòng trọ để có quyết định tốt nhất</p>
         </div>
         {accommodations.length > 0 && (
            <Link href="/so-sanh" className="btn-secondary whitespace-nowrap">Xoá tất cả</Link>
         )}
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-2 pb-6">
        <table className="w-full min-w-[900px]">
          <thead>
             <tr>
                <th className="text-left p-4 text-sm font-bold text-gray-600 w-48 align-bottom bg-gray-50/50 rounded-tl-2xl border-b-2 border-primary/20">
                   Thông tin chung
                </th>
                {cols.map((colIndex) => {
                   const item = accommodations[colIndex];
                   return (
                     <th key={colIndex} className="p-4 w-[280px] align-top border-b-2 border-gray-100">
                        {item ? (
                           <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm mb-4 border border-gray-100 group">
                              {item.images && item.images.length > 0 ? (
                                  <Image src={item.images[0].image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-gray-400">Không có ảnh</div>
                              )}
                              <div className="absolute top-2 right-2 flex gap-2">
                                 {/* Helper client link to remove this ID from URL */}
                                 {/* Simple implementation via raw Link for now */}
                              </div>
                           </div>
                        ) : (
                           <div className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 text-sm mb-4">
                             <span className="text-2xl mb-1">+</span> Thêm phòng
                           </div>
                        )}
                        
                        {item ? (
                           <Link href={`/${item.type}/${item.slug}?id=${item.accommodation_id}`} className="text-sm font-bold text-gray-800 hover:text-primary line-clamp-2 text-left px-1">
                              {item.name}
                           </Link>
                        ) : (
                           <div className="h-10"></div>
                        )}
                     </th>
                   );
                })}
             </tr>
          </thead>
          <tbody>
            {[
              { key: 'price', label: 'Giá thuê / tháng', render: (item: any) => <span className="text-lg font-bold text-primary">{formatCurrency(Number(item.price))}</span> },
              { key: 'area', label: 'Diện tích', render: (item: any) => <span className="font-semibold text-gray-700">{item.area} m²</span> },
              { key: 'type', label: 'Loại hình', render: (item: any) => <span className="bg-primary/10 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">{item.type}</span> },
              { key: 'details', label: 'Chi tiết phòng', render: (item: any) => 
                 <div className="space-y-1 text-sm text-gray-600">
                    <p>🛏️ {item.bedrooms || 1} phòng ngủ</p>
                    <p>🚿 {item.bathrooms || 1} phòng tắm</p>
                 </div>
              },
              { key: 'deposit', label: 'Tiền cọc', render: (item: any) => <span className="text-gray-700">{item.deposit_months || 1} tháng</span> },
              { key: 'location', label: 'Khu vực', render: (item: any) => <span className="text-sm text-gray-600 line-clamp-2 flex gap-1"><FiMapPin className="shrink-0 mt-0.5" />{item.location}</span> },
              { key: 'facilities', label: 'Tiện nghi nổi bật', render: (item: any) => 
                 <div className="flex flex-wrap gap-1.5">
                    {item.facilities?.slice(0, 5).map((f: any) => (
                       <span key={f.facility_id} className="text-[11px] font-semibold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                         <FiCheck /> {f.name}
                       </span>
                    ))}
                    {item.facilities?.length > 5 && <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded">+{item.facilities.length - 5}</span>}
                    {(!item.facilities || item.facilities.length === 0) && <span className="text-gray-400 text-sm">Chưa cập nhật</span>}
                 </div>
              },
              { key: 'time', label: 'Đăng ngày', render: (item: any) => <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span> },
            ].map((row, index) => (
              <tr key={row.key} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                 <td className="p-4 text-sm font-bold text-gray-700 bg-white shadow-[10px_0_15px_-15px_rgba(0,0,0,0.1)] relative z-10 border-r border-gray-100/50">
                    {row.label}
                 </td>
                 {cols.map(c => (
                    <td key={c} className="p-4 text-center align-middle relative border-gray-100/50">
                       {accommodations[c] ? row.render(accommodations[c]) : <span className="text-gray-300 font-bold">—</span>}
                    </td>
                 ))}
              </tr>
            ))}
          </tbody>
        </table>

        {accommodations.length === 0 && (
           <div className="py-20 text-center text-gray-500 bg-gray-50/50 mt-4 rounded-xl border border-dashed border-gray-200">
             Chưa có phòng trọ nào được chọn để so sánh.<br/>
             <Link href="/tim-phong" className="text-primary font-bold hover:underline mt-2 inline-block">Khám phá các phòng trọ ngay!</Link>
           </div>
        )}
      </div>
    </div>
  );
}
