import Breadcrumbs from '@/components/shared/Breadcrumbs';
import Link from 'next/link';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';

const ALL_ARTICLES = [
  { id: 1, title: '10 điều cần kiểm tra kỹ trước khi ký hợp đồng thuê trọ', category: 'Kinh nghiệm', date: '24/02/2026', readTime: '5 phút', views: 1520, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop' },
  { id: 5, title: 'Bí quyết tiết kiệm chi phí thuê trọ cho sinh viên', category: 'Kinh nghiệm', date: '15/02/2026', readTime: '4 phút', views: 1870, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop' },
  { id: 6, title: 'Cách nhận biết phòng trọ bị ẩm mốc và cách xử lý', category: 'Kinh nghiệm', date: '12/02/2026', readTime: '5 phút', views: 760, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop' },
  { id: 3, title: 'Phong thủy phòng trọ: 7 mẹo bố trí để tài lộc hanh thông', category: 'Phong thủy', date: '20/02/2026', readTime: '6 phút', views: 980, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop' },
  { id: 4, title: 'Quyền và nghĩa vụ của người thuê trọ theo pháp luật 2026', category: 'Pháp luật', date: '18/02/2026', readTime: '10 phút', views: 3120, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop' },
  { id: 2, title: 'Xu hướng giá thuê phòng trọ TP.HCM năm 2026', category: 'Tin thị trường', date: '22/02/2026', readTime: '8 phút', views: 2340, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop' },
];

const categoryColors: Record<string, string> = {
  'Kinh nghiệm': 'bg-blue-100 text-blue-700',
  'Phong thủy': 'bg-amber-100 text-amber-700',
  'Pháp luật': 'bg-red-100 text-red-700',
  'Tin thị trường': 'bg-emerald-100 text-emerald-700',
};

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const catLabel = decodeURIComponent(params.category).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Filter articles by category (simple match)
  const articles = ALL_ARTICLES.filter(a =>
    a.category.toLowerCase().includes(catLabel.toLowerCase())
  );
  const displayArticles = articles.length > 0 ? articles : ALL_ARTICLES;

  return (
    <div className="container-page pb-20 pt-4">
      <Breadcrumbs items={[{ label: 'Tin tức', href: '/tin-tuc' }, { label: catLabel }]} />

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Danh mục: <span className="text-gradient">{catLabel}</span>
        </h1>
        <p className="text-slate-500 font-medium">
          {displayArticles.length} bài viết trong danh mục này
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {displayArticles.map((article) => (
          <Link
            key={article.id}
            href={`/tin-tuc/bai-viet/${article.id}`}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-primary-500/20"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${categoryColors[article.category] || 'bg-slate-100 text-slate-700'}`}>
                {article.category}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                {article.title}
              </h3>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><FiClock className="text-primary-500" /> {article.readTime}</span>
                  <span className="flex items-center gap-1"><FiEye /> {article.views.toLocaleString()}</span>
                </div>
                <span className="text-primary-600 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Đọc <FiArrowRight />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-14">
        <Link href="/tin-tuc" className="btn-secondary rounded-full px-10">
          ← Quay lại tất cả tin tức
        </Link>
      </div>
    </div>
  );
}
