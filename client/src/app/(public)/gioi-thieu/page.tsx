import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { staticPageApi } from '@/lib/api';
import { FiCheckCircle, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

export const metadata: Metadata = { 
  title: 'Giới thiệu LaPlace',
  description: 'Nền tảng tìm kiếm và quản lý phòng trọ hàng đầu Việt Nam'
};

export default async function AboutPage() {
  let staticData: any = null;
  try {
     const res = await staticPageApi.getBySlug('gioi-thieu');
     if (res.data?.data) staticData = res.data.data;
  } catch (error) {
     console.error('Failed to fetch Giới thiệu page content');
  }

  return (
    <div className="container-page pb-16 pt-4">
      <Breadcrumbs items={[{ label: 'Giới thiệu' }]} />
      <div className="max-w-4xl mx-auto py-10">
        {staticData ? (
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center font-display">{staticData.title}</h1>
            {staticData.excerpt && <p className="text-lg text-gray-500 mb-12 text-center">{staticData.excerpt}</p>}
            <div className="prose prose-lg max-w-none prose-primary" dangerouslySetInnerHTML={{ __html: staticData.content }} />
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-display">Về LaPlace</h1>
            <p className="text-lg text-gray-500 mb-12">Nền tảng tìm kiếm và quản lý phòng trọ hàng đầu Việt Nam</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[{ icon: <FiTarget />, n: '10,000+', l: 'Phòng trọ' }, { icon: <FiUsers />, n: '50,000+', l: 'Người dùng' }, { icon: <FiAward />, n: '63', l: 'Tỉnh thành' }].map((s, i) => (
                <div key={i} className="p-6 bg-primary-50 rounded-3xl border border-primary-100 shadow-sm"><div className="text-primary text-4xl mb-3 flex justify-center">{s.icon}</div><p className="text-3xl font-extrabold text-gray-900">{s.n}</p><p className="text-sm font-medium text-gray-500 mt-1">{s.l}</p></div>
              ))}
            </div>
            <div className="text-left space-y-10">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Sứ mệnh</h2><p className="text-gray-600 leading-relaxed">LaPlace ra đời với sứ mệnh giúp mọi người tìm được nơi ở phù hợp một cách dễ dàng, minh bạch và an toàn nhất.</p></section>
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"><h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">Tầm nhìn</h2><p className="text-gray-600 leading-relaxed">Trở thành nền tảng cho thuê và quản lý nhà trọ số 1 Đông Nam Á, kết nối hàng triệu người thuê và chủ trọ.</p></section>
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"><h2 className="text-2xl font-bold text-gray-900 mb-6">Giá trị cốt lõi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{['Minh bạch & Uy tín', 'Công nghệ tiên tiến', 'Trải nghiệm người dùng', 'Cộng đồng phát triển'].map(v => (
                  <div key={v} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-medium text-gray-800 border border-gray-100"><FiCheckCircle className="text-green-500 text-xl" /> {v}</div>
                ))}</div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
