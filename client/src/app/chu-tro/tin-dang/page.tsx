export default function MyListingsPage() {
  const tabs = ['Tất cả', 'Đang hiển thị', 'Ẩn', 'Hết hạn'];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tin đăng của tôi</h1>
        <a href="/chu-tro/dang-tin" className="btn-accent btn-sm">+ Đăng tin mới</a>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {tabs.map((t, i) => <button key={t} className={`btn-sm rounded-full whitespace-nowrap ${i === 0 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700'}`}>{t}</button>)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="w-full sm:w-28 aspect-video sm:aspect-[4/3] bg-gray-200 rounded-xl animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className={`badge text-[10px] ${i <= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{i <= 2 ? 'Đang hiển thị' : 'Ẩn'}</span></div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Phòng trọ full nội thất #{i}</h3>
              <p className="text-xs text-gray-500 mb-2">📍 Quận {i}, TP.HCM</p>
              <div className="flex gap-4 text-xs text-gray-500"><span>💰 3.500.000 đ</span><span>📐 25m²</span><span>👁 120 lượt xem</span></div>
            </div>
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button className="btn-sm btn-ghost text-xs">Sửa</button>
              <button className="btn-sm text-xs text-accent hover:bg-accent/10 rounded-lg">{i <= 2 ? 'Ẩn' : 'Hiện'}</button>
              <button className="btn-sm text-xs text-red-500 hover:bg-red-50 rounded-lg">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
