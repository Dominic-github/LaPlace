'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const arr = [...otp];
    arr[i] = val.slice(-1);
    setOtp(arr);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/tai-khoan');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🔐</span></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực OTP</h1>
        <p className="text-sm text-gray-500 mb-8">Nhập mã 6 số đã gửi đến email của bạn</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((d, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            ))}
          </div>
          <button type="submit" className="btn-primary w-full py-3.5" disabled={otp.join('').length < 6}>Xác thực</button>
        </form>
        <p className="text-sm text-gray-500 mt-6">Chưa nhận được mã? <button className="text-primary font-semibold hover:underline">Gửi lại</button></p>
      </div>
    </div>
  );
}
