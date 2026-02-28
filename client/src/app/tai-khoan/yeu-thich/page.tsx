import EmptyState from '@/components/shared/EmptyState';
export default function FavoritesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Phòng yêu thích</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse relative">
              <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-50 transition-colors">❤️</button>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-primary text-sm">3.500.000 đ/tháng</span>
                <button className="btn-sm btn-primary text-xs">Xem chi tiết</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
