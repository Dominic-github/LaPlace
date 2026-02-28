import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Trang không tồn tại</h1>
        <p className="text-gray-500 mb-8">Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">Về trang chủ</Link>
          <Link href="/tim-phong" className="btn-secondary">Tìm phòng</Link>
        </div>
      </div>
    </div>
  );
}
