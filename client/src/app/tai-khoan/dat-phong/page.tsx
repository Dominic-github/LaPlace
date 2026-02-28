import EmptyState from '@/components/shared/EmptyState';

export default function BookingsPage() {
  const tabs = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã hoàn thành', 'Đã hủy'];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đặt phòng của tôi</h1>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {tabs.map((t, i) => <button key={t} className={`btn-sm rounded-full whitespace-nowrap ${i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>{t}</button>)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="w-full sm:w-32 aspect-video sm:aspect-[4/3] bg-gray-200 rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2"><span className="badge-warning text-[10px]">Chờ xác nhận</span></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="flex gap-4 text-xs text-gray-500 pt-2"><span>📅 01/03/2026</span><span>👤 2 người</span><span className="font-bold text-primary">3.500.000 đ</span></div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button className="btn-sm btn-ghost text-xs">Chi tiết</button>
              <button className="btn-sm text-xs text-red-500 hover:bg-red-50 rounded-lg">Hủy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
