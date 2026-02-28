export default function LandlordContractsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hợp đồng</h1>
        <button className="btn-accent btn-sm">+ Tạo hợp đồng</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="bg-gray-50"><th className="text-left p-4 text-xs font-semibold text-gray-500">Mã HĐ</th><th className="text-left p-4 text-xs font-semibold text-gray-500">Người thuê</th><th className="text-left p-4 text-xs font-semibold text-gray-500">Phòng</th><th className="text-left p-4 text-xs font-semibold text-gray-500">Thời hạn</th><th className="text-right p-4 text-xs font-semibold text-gray-500">Giá thuê</th><th className="text-center p-4 text-xs font-semibold text-gray-500">Trạng thái</th><th className="p-4"></th></tr></thead>
            <tbody>
              {[
                { code: 'HD-001', tenant: 'Nguyễn Văn A', room: 'P.101', duration: '01/2026 - 12/2026', price: '3.500.000', active: true },
                { code: 'HD-002', tenant: 'Trần Thị B', room: 'P.203', duration: '03/2026 - 02/2027', price: '4.000.000', active: true },
                { code: 'HD-003', tenant: 'Lê Văn C', room: 'P.105', duration: '06/2025 - 05/2026', price: '3.000.000', active: false },
              ].map(c => (
                <tr key={c.code} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-500">{c.code}</td>
                  <td className="p-4 text-sm text-gray-900">{c.tenant}</td>
                  <td className="p-4 text-sm text-gray-500">{c.room}</td>
                  <td className="p-4 text-sm text-gray-500">{c.duration}</td>
                  <td className="p-4 text-sm text-gray-900 font-semibold text-right">{c.price} đ</td>
                  <td className="p-4 text-center"><span className={`badge text-[10px] ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.active ? 'Đang hiệu lực' : 'Hết hạn'}</span></td>
                  <td className="p-4"><button className="btn-sm btn-ghost text-xs">Xem</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
