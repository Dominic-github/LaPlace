import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import Link from 'next/link';
import { FiCalendar, FiEye, FiShare2, FiArrowLeft, FiHeart, FiBookmark } from 'react-icons/fi';
import { postApi } from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await postApi.getBySlug(resolvedParams.slug);
    if(res.data?.data) {
      return { title: res.data.data.title, description: res.data.data.excerpt };
    }
  } catch (e) {}
  return { title: 'Bài viết' };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let article: any = null;
  let relatedPosts: any[] = [];

  try {
    const [res, relatedRes] = await Promise.all([
      postApi.getBySlug(params.slug),
      postApi.getAll({ limit: 4 })
    ]);
    if (res.data?.data) article = res.data.data;
    if (relatedRes.data?.data?.items) relatedPosts = relatedRes.data.data.items.filter((p: any) => p.post_id !== article?.post_id).slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch article detail:', error);
  }

  if (!article) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="btn-primary">Về trang Tin tức</Link>
      </div>
    );
  }

  return (
    <div className="container-page pb-20 pt-4">
      <Breadcrumbs items={[{ label: 'Tin tức', href: '/tin-tuc' }, { label: 'Chi tiết bài viết' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Back Link */}
          <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary-600 mb-6 transition-colors">
            <FiArrowLeft /> Quay lại tin tức
          </Link>

          {/* Category Badge */}
          {article.category && (
             <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 mb-4">
               {article.category.name}
             </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-100">
            <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-500" /> {format(new Date(article.createdAt), 'dd MMMM, yyyy', { locale: vi })}</span>
            <span className="flex items-center gap-1.5"><FiEye className="text-primary-500" /> {article.views?.toLocaleString() || 0} lượt xem</span>
            <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><FiHeart /></button>
              <button className="p-2 rounded-full hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"><FiBookmark /></button>
              <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"><FiShare2 /></button>
            </div>
          </div>

          {/* Featured Image */}
          {article.featured_image && (
             <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg relative">
               <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
             </div>
          )}

          {/* Article Content */}
          <div 
             className="prose prose-lg max-w-none text-slate-600 prose-headings:text-slate-900 prose-headings:font-extrabold prose-a:text-primary-600 prose-img:rounded-2xl"
             dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.post_tags && article.post_tags.length > 0 && (
             <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
               {article.post_tags.map((tagRef: any) => (
                 <span key={tagRef.tag?.tag_id} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">
                   #{tagRef.tag?.name}
                 </span>
               ))}
             </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-28">
            <h3 className="font-bold text-lg text-slate-900 mb-5 font-display">Bài viết liên quan</h3>
            <div className="space-y-5">
              {relatedPosts.map(item => (
                <Link key={item.post_id} href={`/tin-tuc/bai-viet/${item.slug}`} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-slate-100">
                    {item.featured_image ? (
                        <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">Ảnh</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-1">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">{format(new Date(item.createdAt), 'dd/MM/yyyy')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-primary-600 to-secondary-500 text-white text-center shadow-lg shadow-primary/20">
            <h3 className="font-extrabold text-xl mb-3">Bạn là chủ trọ?</h3>
            <p className="text-white/90 text-sm mb-5 font-medium leading-relaxed">Đăng tin miễn phí ngay trên LaPlace và tiếp cận hàng ngàn người thuê nhanh chóng.</p>
            <Link href="/quan-ly-tro/nha-tro/them-moi" className="btn bg-white text-primary-600 hover:bg-slate-50 rounded-full w-full font-bold shadow-lg shadow-black/10 py-3.5">
              Đăng tin ngay
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
