'use client';
import { useState } from 'react';
import { FiCamera } from 'react-icons/fi';

export default function ProfilePage() {
  const [form, setForm] = useState({ firstName: 'Văn A', lastName: 'Nguyễn', email: 'vana@email.com', phone: '0123456789', address: 'Quận 1, TP.HCM' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">N</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-primary shadow-sm"><FiCamera className="w-3.5 h-3.5" /></button>
          </div>
          <div><p className="font-semibold text-gray-900">Nguyễn Văn A</p><p className="text-sm text-gray-500">Người thuê</p></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="input-label">Họ</label><input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Tên</label><input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" disabled /></div>
          <div><label className="input-label">Số điện thoại</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" /></div>
          <div className="md:col-span-2"><label className="input-label">Địa chỉ</label><input value={form.address} onChange={e => set('address', e.target.value)} className="input-field" /></div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
          <button className="btn-ghost">Hủy</button>
          <button className="btn-primary">Lưu thay đổi</button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
        <h2 className="font-bold text-gray-900 mb-4">Đổi mật khẩu</h2>
        <div className="space-y-4 max-w-md">
          <div><label className="input-label">Mật khẩu hiện tại</label><input type="password" className="input-field" placeholder="••••••••" /></div>
          <div><label className="input-label">Mật khẩu mới</label><input type="password" className="input-field" placeholder="Tối thiểu 6 ký tự" /></div>
          <div><label className="input-label">Xác nhận mật khẩu mới</label><input type="password" className="input-field" placeholder="Nhập lại mật khẩu" /></div>
          <button className="btn-primary">Đổi mật khẩu</button>
        </div>
      </div>
    </div>
  );
}
