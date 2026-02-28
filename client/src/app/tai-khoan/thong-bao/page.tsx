export default function NotificationsPage() {
  const notifs = [
    { icon: '✅', title: 'Đặt phòng được xác nhận', desc: 'Phòng trọ Quận 1 đã được chủ nhà xác nhận', time: '2 giờ trước', read: false },
    { icon: '💰', title: 'Nhắc thanh toán', desc: 'Hạn thanh toán tiền thuê tháng 3 còn 5 ngày', time: '1 ngày trước', read: false },
    { icon: '📝', title: 'Hợp đồng mới', desc: 'Hợp đồng thuê phòng đã được tạo, vui lòng xem xét', time: '3 ngày trước', read: true },
    { icon: '⭐', title: 'Đánh giá của bạn', desc: 'Chủ nhà đã phản hồi đánh giá của bạn', time: '1 tuần trước', read: true },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
        <button className="text-sm text-primary hover:underline">Đánh dấu tất cả đã đọc</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100">
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary-50/30' : ''}`}>
            <span className="text-xl mt-0.5">{n.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2"><h3 className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h3>{!n.read && <span className="w-2 h-2 bg-primary rounded-full" />}</div>
              <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
