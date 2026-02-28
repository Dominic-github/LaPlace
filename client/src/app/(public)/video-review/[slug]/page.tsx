import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { videoReviewApi } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiEye, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await videoReviewApi.getBySlug(resolvedParams.slug);
    if(res.data?.data) {
      return { title: res.data.data.title, description: res.data.data.description };
    }
  } catch (e) {}
  return { title: 'Video Review' };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let video: any = null;
  let relatedVideos: any[] = [];

  try {
    const [res, relatedRes] = await Promise.all([
      videoReviewApi.getBySlug(resolvedParams.slug),
      videoReviewApi.getAll({ limit: 5 })
    ]);
    if (res.data?.data) video = res.data.data;
    if (relatedRes.data?.data?.items) {
      relatedVideos = relatedRes.data.data.items.filter((v: any) => v.video_id !== video?.video_id).slice(0, 4);
    }
  } catch (error) {
    console.error('Failed to fetch video detail:', error);
  }

  if (!video) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy video</h1>
        <Link href="/video-review" className="btn-primary">Về danh sách Video</Link>
      </div>
    );
  }

  // extract youtube ID to embed
  let youtubeId = '';
  if (video.video_url?.includes('youtube.com/watch?v=')) {
    youtubeId = video.video_url.split('v=')[1]?.split('&')[0];
  } else if (video.video_url?.includes('youtu.be/')) {
    youtubeId = video.video_url.split('youtu.be/')[1]?.split('?')[0];
  }

  return (
    <div className="container-page pb-16 pt-4">
      <Breadcrumbs items={[{ label: 'Video Review', href: '/video-review' }, { label: 'Chi tiết' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 shadow-lg shadow-black/10">
            {youtubeId ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} 
                title={video.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                 <p className="mb-2">⚠️ Định dạng video không được hỗ trợ để nhúng tự động.</p>
                 <a href={video.video_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Nhấn vào đây để xem video trực tiếp</a>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{video.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5 font-medium"><FiEye className="text-primary" /> {video.views?.toLocaleString() || 0} lượt xem</span>
            <span>Đăng ngày {format(new Date(video.createdAt), 'dd MMMM, yyyy', { locale: vi })}</span>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            {video.description || 'Chưa có mô tả chi tiết cho video này.'}
          </div>

          {/* Accommodation linkage */}
          {video.accommodation && (
            <div className="mt-8 p-6 bg-primary-50/50 rounded-2xl border border-primary-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div>
                 <h3 className="font-bold text-gray-900 mb-2">Thông tin phòng trọ</h3>
                 <p className="font-semibold text-primary text-xl mb-1">{formatCurrency(Number(video.accommodation.price))}/tháng</p>
                 <p className="text-sm text-gray-600 flex items-center gap-1"><FiMapPin className="text-gray-400 shrink-0" /> {video.accommodation.location}</p>
              </div>
              <Link href={`/${video.accommodation.type}/${video.accommodation.slug}?id=${video.accommodation.accommodation_id}`} className="btn-primary whitespace-nowrap shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform w-full sm:w-auto">
                 Xem chi tiết phòng
              </Link>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Video liên quan</h3>
          <div className="space-y-4">
            {relatedVideos.map((item) => (
              <Link key={item.video_id} href={`/video-review/${item.slug}`} className="flex gap-4 cursor-pointer group bg-white hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
                <div className="w-32 aspect-video bg-gray-900 rounded-lg shrink-0 overflow-hidden relative shadow-sm">
                   {item.thumbnail ? (
                       <Image src={item.thumbnail} alt={item.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                       <div className="w-full h-full bg-slate-200"></div>
                   )}
                </div>
                <div className="flex-1 min-w-0 py-1">
                   <h4 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-snug">{item.title}</h4>
                   <p className="text-xs font-medium text-gray-500"><FiEye className="inline mr-1" />{item.views?.toLocaleString() || 0}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
