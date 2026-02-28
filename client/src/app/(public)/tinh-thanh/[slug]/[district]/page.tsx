import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default function DistrictPage({ params }: { params: { slug: string; district: string } }) {
  const tinh = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const quan = params.district.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Tỉnh thành', href: '/tinh-thanh' }, { label: tinh, href: `/tinh-thanh/${params.slug}` }, { label: quan }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cho thuê phòng trọ tại {quan}, {tinh}</h1>
      <p className="text-gray-500 mb-6">Phòng trọ, nhà nguyên căn, căn hộ tại {quan}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card"><div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" /><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" /><div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" /></div></div>
        ))}
      </div>
    </div>
  );
}
