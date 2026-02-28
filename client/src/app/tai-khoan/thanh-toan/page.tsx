export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử thanh toán</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="bg-gray-50"><th className="text-left p-4 text-xs font-semibold text-gray-500">Mã</th><th className="text-left p-4 text-xs font-semibold text-gray-500">Mô tả</th><th className="text-left p-4 text-xs font-semibold text-gray-500">Ngày</th><th className="text-right p-4 text-xs font-semibold text-gray-500">Số tiền</th><th className="text-center p-4 text-xs font-semibold text-gray-500">Trạng thái</th></tr></thead>
            <tbody>
              {[
                { code: 'PAY-001', desc: 'Tiền thuê tháng 2', date: '01/02/2026', amount: '3.500.000', status: 'success' },
                { code: 'PAY-002', desc: 'Tiền thuê tháng 1', date: '01/01/2026', amount: '3.500.000', status: 'success' },
                { code: 'PAY-003', desc: 'Tiền cọc', date: '15/12/2025', amount: '7.000.000', status: 'success' },
              ].map(p => (
                <tr key={p.code} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-500">{p.code}</td>
                  <td className="p-4 text-sm text-gray-900">{p.desc}</td>
                  <td className="p-4 text-sm text-gray-500">{p.date}</td>
                  <td className="p-4 text-sm text-gray-900 font-semibold text-right">{p.amount} đ</td>
                  <td className="p-4 text-center"><span className="badge-success text-[10px]">Đã thanh toán</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
