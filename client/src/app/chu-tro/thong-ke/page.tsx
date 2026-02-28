export default function StatsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thống kê</h1>

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {['7 ngày', '30 ngày', '3 tháng', '6 tháng', '1 năm'].map((p, i) => (
          <button key={p} className={`btn-sm rounded-full ${i === 1 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700'}`}>{p}</button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Lượt xem', value: '2,450', change: '+18%', up: true },
          { label: 'Yêu cầu đặt', value: '12', change: '+25%', up: true },
          { label: 'Tỉ lệ chuyển đổi', value: '4.9%', change: '-2%', up: false },
          { label: 'Doanh thu TB/phòng', value: '3.5 tr', change: '+5%', up: true },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-gray-900">{k.value}</p>
            <p className={`text-xs mt-1 ${k.up ? 'text-green-600' : 'text-red-600'}`}>{k.change} so với kỳ trước</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">📈 Doanh thu theo tháng</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">Revenue Chart</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">🏠 Tỉ lệ lấp đầy</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary mx-auto flex items-center justify-center"><span className="text-3xl font-bold text-gray-900">75%</span></div>
              <p className="text-sm text-gray-500 mt-3">6/8 phòng đang thuê</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Performance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">📊 Hiệu suất theo phòng</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="bg-gray-50"><th className="text-left p-3 text-xs font-semibold text-gray-500">Phòng</th><th className="text-center p-3 text-xs font-semibold text-gray-500">Trạng thái</th><th className="text-right p-3 text-xs font-semibold text-gray-500">Giá thuê</th><th className="text-right p-3 text-xs font-semibold text-gray-500">Lượt xem</th><th className="text-right p-3 text-xs font-semibold text-gray-500">Yêu cầu</th></tr></thead>
            <tbody>
              {[
                { name: 'P.101', active: true, price: '3.500.000', views: 320, requests: 5 },
                { name: 'P.203', active: true, price: '4.000.000', views: 450, requests: 8 },
                { name: 'P.105', active: true, price: '3.000.000', views: 180, requests: 2 },
                { name: 'P.302', active: false, price: '3.500.000', views: 520, requests: 12 },
              ].map(r => (
                <tr key={r.name} className="border-t border-gray-50"><td className="p-3 text-sm text-gray-900 font-medium">{r.name}</td><td className="p-3 text-center"><span className={`badge text-[10px] ${r.active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{r.active ? 'Đang thuê' : 'Trống'}</span></td><td className="p-3 text-sm text-right">{r.price} đ</td><td className="p-3 text-sm text-right text-gray-500">{r.views}</td><td className="p-3 text-sm text-right text-gray-500">{r.requests}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
