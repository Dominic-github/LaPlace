import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import Pagination from '@/components/shared/Pagination';
import { postApi } from '@/lib/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Tin tức & Kinh nghiệm thuê trọ | LaPlace',
  description: 'Cập nhật tin tức, kinh nghiệm thuê trọ, mẹo hay cho người thuê và chủ trọ tại LaPlace.',
};

const categoryColors: Record<string, string> = {
  'Kinh nghiệm': 'bg-blue-100 text-blue-700',
  'Phong thủy': 'bg-amber-100 text-amber-700',
  'Pháp luật': 'bg-red-100 text-red-700',
  'Tin thị trường': 'bg-emerald-100 text-emerald-700',
};

export default async function TinTucPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const params = await searchParams;
  const currentCategorySlug = params.category || 'all';
  const page = params.page ? parseInt(params.page as string) : 1;

  let categories: any[] = [];
  let posts: any[] = [];
  let featuredPosts: any[] = [];
  let pagination = { totalPages: 1, total: 0 };

  try {
    const [catsRes, postsRes, featuredRes] = await Promise.all([
      postApi.getCategories(),
      postApi.getAll({ limit: 9, page, category: currentCategorySlug === 'all' ? undefined : currentCategorySlug }),
      postApi.getAll({ limit: 2, featured: true })
    ]);

    if (catsRes.data?.data) categories = catsRes.data.data;
    if (postsRes.data?.data) {
      posts = postsRes.data.data.items;
      pagination = postsRes.data.data.pagination;
    }
    if (featuredRes.data?.data) featuredPosts = featuredRes.data.data.items;
  } catch (error) {
    console.error('Failed to fetch blog data:', error);
  }

  // Categories include 'Tất cả' with slug 'all'
  const filterCategories = [{ slug: 'all', name: 'Tất cả' }, ...categories];

  return (
    <div className="container-page pb-20 pt-4">
      <Breadcrumbs items={[{ label: 'Tin tức' }]} />

      {/* Page Header */}
      <div className="mb-10 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">
          Tin tức & <span className="text-gradient">Kinh nghiệm</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl">
          Cập nhật thông tin, mẹo hay dành cho người thuê trọ và chủ nhà
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
        {filterCategories.map((c, i) => {
          const isActive = currentCategorySlug === c.slug;
          return (
            <Link
              key={c.slug}
              href={c.slug === 'all' ? '/tin-tuc' : `/tin-tuc?category=${c.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {/* Featured Articles (Top 2) - only show on first page and all category */}
      {featuredPosts.length > 0 && page === 1 && currentCategorySlug === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
          {featuredPosts.map((article) => (
            <Link
              key={article.post_id}
              href={`/tin-tuc/bai-viet/${article.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="aspect-[16/9] overflow-hidden">
                {article.featured_image ? (
                   <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                   <div className="w-full h-full bg-slate-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                {article.category && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${categoryColors[article.category.name] || 'bg-slate-100/90 text-slate-700'}`}>
                      {article.category.name}
                    </span>
                )}
                <h2 className="text-xl md:text-2xl font-extrabold mb-2 group-hover:text-primary-300 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-white/80 line-clamp-2 mb-3 hidden md:block">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-white/70 font-medium">
                  <span className="flex items-center gap-1"><FiEye /> {article.views?.toLocaleString() || 0} lượt xem</span>
                  <span>{format(new Date(article.createdAt), 'dd MMMM, yyyy', { locale: vi })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.length > 0 ? (
          posts.map((article) => (
            <Link
              key={article.post_id}
              href={`/tin-tuc/bai-viet/${article.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary-500/20 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative shrink-0">
                {article.featured_image ? (
                  <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Không có ảnh</div>
                )}
                {article.category && (
                  <span className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${categoryColors[article.category.name] || 'bg-white/90 backdrop-blur text-slate-700'}`}>
                    {article.category.name}
                  </span>
                )}
              </div>
              <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><FiEye className="text-primary-500" /> {article.views?.toLocaleString() || 0}</span>
                    <span>{format(new Date(article.createdAt), 'dd/MM/yyyy')}</span>
                  </div>
                  <span className="text-primary-600 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Đọc <FiArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Không tìm thấy bài viết nào.
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        baseUrl="/tin-tuc"
        extraParams={currentCategorySlug !== 'all' ? `&category=${currentCategorySlug}` : ''}
      />
    </div>
  );
}
