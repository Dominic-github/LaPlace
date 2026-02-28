'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiLock } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4"><FiLock className="w-7 h-7 text-primary" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
          <p className="text-sm text-gray-500 mt-1">Nhập mật khẩu mới cho tài khoản</p>
        </div>
        {done ? (
          <div className="text-center py-6"><span className="text-4xl mb-4 block">🎉</span><h3 className="font-bold text-gray-900 mb-2">Đổi mật khẩu thành công!</h3><Link href="/dang-nhap" className="btn-primary mt-4">Đăng nhập ngay</Link></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="space-y-4">
            <div><label className="input-label">Mật khẩu mới</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Tối thiểu 6 ký tự" required /></div>
            <div><label className="input-label">Xác nhận mật khẩu</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="input-field" placeholder="Nhập lại mật khẩu" required /></div>
            <button type="submit" className="btn-primary w-full py-3.5">Đặt lại mật khẩu</button>
          </form>
        )}
      </div>
    </div>
  );
}
