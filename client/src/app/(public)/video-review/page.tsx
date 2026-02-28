import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiPlay, FiMapPin, FiEye } from 'react-icons/fi';
import { videoReviewApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import Pagination from '@/components/shared/Pagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const metadata: Metadata = { 
  title: 'Video Review phòng trọ', 
  description: 'Xem video review thực tế phòng trọ, căn hộ từ đội ngũ LaPlace' 
};

export default async function VideoReviewPage({ searchParams }: { searchParams: Promise<{ page?: string, province?: string }> }) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const provinceCode = params.province || '';

  let videos: any[] = [];
  let pagination = { totalPages: 1, total: 0 };

  try {
    const res = await videoReviewApi.getAll({
      page,
      limit: 12,
      province: provinceCode || undefined
    });
    
    if (res.data?.data) {
      videos = res.data.data.items;
      pagination = res.data.data.pagination;
    }
  } catch (error) {
    console.error('Failed to fetch video reviews:', error);
  }

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Video Review' }]} />
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎬 Video Review phòng trọ</h1>
        <p className="text-gray-500">Trải nghiệm trọ thực tế qua video review từ đội ngũ LaPlace</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Link href={`/video-review/${video.slug}`} key={video.video_id} className="card group cursor-pointer block rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {video.thumbnail ? (
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-200"></div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform">
                    <FiPlay className="w-6 h-6 text-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{video.title}</h3>
                
                {video.accommodation && (
                  <>
                    <p className="flex items-center gap-1 text-xs text-gray-500 mb-3 line-clamp-1">
                      <FiMapPin className="text-gray-400 shrink-0" /> {video.accommodation.location}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <span className="font-bold text-primary text-sm">{formatCurrency(Number(video.accommodation.price))}/tháng</span>
                      <span className="flex items-center gap-1"><FiEye /> {video.views?.toLocaleString() || 0}</span>
                    </div>
                  </>
                )}
                {!video.accommodation && (
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span>{format(new Date(video.createdAt), 'dd/MM/yyyy')}</span>
                    <span className="flex items-center gap-1"><FiEye /> {video.views?.toLocaleString() || 0}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Hiện chưa có video review nào.
          </div>
        )}
      </div>

      <Pagination currentPage={page} totalPages={pagination.totalPages} baseUrl="/video-review" />
    </div>
  );
}
