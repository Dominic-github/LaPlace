import { FiStar } from 'react-icons/fi';
export default function ReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá của tôi</h1>
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="font-semibold text-gray-900 text-sm">Phòng trọ cao cấp Quận 1</h3><p className="text-xs text-gray-500">15/02/2026</p></div>
              <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <FiStar key={s} className={`w-4 h-4 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />)}</div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Phòng sạch sẽ, thoáng mát, full nội thất. Chủ nhà thân thiện và hỗ trợ nhanh.</p>
            <div className="flex gap-2"><button className="btn-sm btn-ghost text-xs">Chỉnh sửa</button><button className="btn-sm text-xs text-red-500 hover:bg-red-50 rounded-lg">Xóa</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
