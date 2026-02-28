'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Đã xảy ra lỗi</h1>
        <p className="text-gray-500 mb-8">Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
        <button onClick={reset} className="btn-primary">Thử lại</button>
      </div>
    </div>
  );
}
