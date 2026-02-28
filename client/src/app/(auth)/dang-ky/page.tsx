'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    setLoading(true);
    try {
      await register(form);
      router.push('/xac-thuc');
    } catch {
      setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4"><div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-xl">L</span></div></Link>
          <h1 className="text-2xl font-bold text-gray-900">Đăng ký</h1>
          <p className="text-sm text-gray-500 mt-1">Tạo tài khoản miễn phí</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        {/* Role tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button type="button" onClick={() => set('role', 'user')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${form.role === 'user' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Người thuê</button>
          <button type="button" onClick={() => set('role', 'landlord')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${form.role === 'landlord' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>Chủ trọ</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="input-label">Họ</label><div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className="input-field pl-10" placeholder="Nguyễn" required /></div></div>
            <div><label className="input-label">Tên</label><input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className="input-field" placeholder="Văn A" required /></div>
          </div>
          <div><label className="input-label">Email</label><div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field pl-10" placeholder="email@example.com" required /></div></div>
          <div><label className="input-label">Số điện thoại</label><div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field pl-10" placeholder="0123 456 789" /></div></div>
          <div><label className="input-label">Mật khẩu</label><div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className="input-field pl-10 pr-10" placeholder="Tối thiểu 6 ký tự" required /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}</button></div></div>
          <div><label className="input-label">Xác nhận mật khẩu</label><div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className="input-field pl-10" placeholder="Nhập lại mật khẩu" required /></div></div>

          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" className="accent-primary rounded mt-0.5" required />
            <span>Tôi đồng ý với <Link href="/chinh-sach/dieu-khoan" className="text-primary hover:underline">Điều khoản sử dụng</Link> và <Link href="/chinh-sach/bao-mat" className="text-primary hover:underline">Chính sách bảo mật</Link></span>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">Đã có tài khoản? <Link href="/dang-nhap" className="text-primary font-semibold hover:underline">Đăng nhập</Link></p>
      </div>
    </div>
  );
}
