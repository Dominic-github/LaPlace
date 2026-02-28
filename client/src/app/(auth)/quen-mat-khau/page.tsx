'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiMail } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4"><FiMail className="w-7 h-7 text-primary" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h1>
          <p className="text-sm text-gray-500 mt-1">Nhập email để nhận link đặt lại mật khẩu</p>
        </div>
        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✅</span></div>
            <h3 className="font-bold text-gray-900 mb-2">Email đã được gửi!</h3>
            <p className="text-sm text-gray-500 mb-6">Kiểm tra hộp thư email <strong>{email}</strong> để đặt lại mật khẩu.</p>
            <Link href="/dang-nhap" className="btn-primary">Quay lại đăng nhập</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div><label className="input-label">Email</label><div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="email@example.com" required /></div></div>
            <button type="submit" className="btn-primary w-full py-3.5">Gửi link đặt lại</button>
            <p className="text-center text-sm text-gray-500"><Link href="/dang-nhap" className="text-primary hover:underline">← Quay lại đăng nhập</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
