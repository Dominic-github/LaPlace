export default function BookingRequestsPage() {
  const tabs = ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã từ chối'];
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yêu cầu đặt phòng</h1>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {tabs.map((t, i) => <button key={t} className={`btn-sm rounded-full whitespace-nowrap ${i === 0 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700'}`}>{t}</button>)}
      </div>
      <div className="space-y-4">
        {[
          { name: 'Nguyễn Văn A', room: 'Phòng trọ Quận 1', date: '01/03/2026', guests: 2, phone: '0123456789', status: 'pending' },
          { name: 'Trần Thị B', room: 'Phòng trọ Quận 3', date: '15/03/2026', guests: 1, phone: '0987654321', status: 'pending' },
          { name: 'Lê Văn C', room: 'Căn hộ Quận 7', date: '01/02/2026', guests: 3, phone: '0111222333', status: 'approved' },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 text-primary rounded-full flex items-center justify-center font-bold">{r.name[0]}</div>
                <div>
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">📞 {r.phone}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">🏠 {r.room}</p>
                <div className="flex gap-4 text-xs text-gray-500 mt-1"><span>📅 {r.date}</span><span>👤 {r.guests} người</span></div>
              </div>
              <div className="flex gap-2">
                {r.status === 'pending' ? (
                  <>
                    <button className="btn-sm bg-green-500 text-white hover:bg-green-600 rounded-lg text-xs">✓ Duyệt</button>
                    <button className="btn-sm bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs">✕ Từ chối</button>
                  </>
                ) : (
                  <span className="badge-success text-[10px]">Đã duyệt</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
