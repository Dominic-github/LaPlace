export default function ContractsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hợp đồng</h1>
      <div className="bg-white rounded-2xl border border-gray-100">
        {[1, 2].map(i => (
          <div key={i} className="flex flex-col sm:flex-row items-start gap-4 p-5 border-b border-gray-50 last:border-0">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-lg font-bold shrink-0">📄</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-gray-900">Hợp đồng thuê phòng trọ</h3><span className="badge-success text-[10px]">Đang hiệu lực</span></div>
              <p className="text-sm text-gray-500 mb-2">Phòng trọ cao cấp Quận 1 — Chủ nhà: Trần Chủ Trọ</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500"><span>📅 01/01/2026 - 31/12/2026</span><span>💰 3.500.000 đ/tháng</span><span>🏷️ Cọc: 7.000.000 đ</span></div>
            </div>
            <div className="flex gap-2"><button className="btn-sm btn-ghost text-xs">Xem</button><button className="btn-sm btn-primary text-xs">Tải PDF</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
