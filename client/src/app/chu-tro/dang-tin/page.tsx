'use client';
import { useState } from 'react';
import { ACCOMMODATION_TYPES, FACILITIES } from '@/lib/utils';

const STEPS = ['Loại phòng', 'Thông tin', 'Tiện nghi', 'Hình ảnh', 'Giá cả', 'Mô tả', 'Xác nhận'];

export default function PostListingPage() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đăng tin cho thuê</h1>

      {/* Steps */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button onClick={() => setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${i === step ? 'bg-accent text-white font-semibold' : i < step ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i < step ? '✓' : i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-1 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {step === 0 && (
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-4">Chọn loại phòng</h2>
            <div className="grid grid-cols-2 gap-4">
              {ACCOMMODATION_TYPES.map(t => (
                <button key={t.slug} className="p-6 border-2 border-gray-200 rounded-2xl text-center hover:border-accent hover:bg-accent/5 transition-all">
                  <span className="text-4xl mb-3 block">{t.icon}</span>
                  <p className="font-semibold text-gray-900">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div><label className="input-label">Tiêu đề tin đăng</label><input className="input-field" placeholder="VD: Phòng trọ cao cấp full nội thất Quận 1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="input-label">Diện tích (m²)</label><input type="number" className="input-field" placeholder="25" /></div>
              <div><label className="input-label">Số phòng ngủ</label><input type="number" className="input-field" placeholder="1" /></div>
              <div><label className="input-label">Số phòng tắm</label><input type="number" className="input-field" placeholder="1" /></div>
              <div><label className="input-label">Số tầng</label><input type="number" className="input-field" placeholder="1" /></div>
            </div>
            <div><label className="input-label">Địa chỉ</label><input className="input-field" placeholder="Số nhà, đường, phường" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="input-label">Tỉnh/TP</label><select className="input-field"><option>Chọn</option></select></div>
              <div><label className="input-label">Quận/Huyện</label><select className="input-field"><option>Chọn</option></select></div>
              <div><label className="input-label">Phường/Xã</label><select className="input-field"><option>Chọn</option></select></div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-4">Tiện nghi phòng</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {FACILITIES.map(f => (
                <label key={f} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                  <input type="checkbox" className="accent-accent w-4 h-4" /> <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-4">Hình ảnh & Video</h2>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent cursor-pointer transition-colors">
                  <span className="text-2xl mb-1">📷</span><span className="text-xs">Thêm ảnh</span>
                </div>
              ))}
            </div>
            <div className="mt-4"><label className="input-label">Link video YouTube (nếu có)</label><input className="input-field" placeholder="https://youtube.com/watch?v=..." /></div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Giá cả</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="input-label">Giá thuê (đ/tháng)</label><input type="number" className="input-field" placeholder="3500000" /></div>
              <div><label className="input-label">Tiền cọc (đ)</label><input type="number" className="input-field" placeholder="7000000" /></div>
              <div><label className="input-label">Tiền điện (đ/kWh)</label><input type="number" className="input-field" placeholder="3500" /></div>
              <div><label className="input-label">Tiền nước (đ/m³)</label><input type="number" className="input-field" placeholder="15000" /></div>
              <div><label className="input-label">Phí internet (đ/tháng)</label><input type="number" className="input-field" placeholder="100000" /></div>
              <div><label className="input-label">Phí dịch vụ khác</label><input type="number" className="input-field" placeholder="0" /></div>
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="font-bold text-lg text-gray-900 mb-4">Mô tả chi tiết</h2>
            <textarea rows={8} className="input-field" placeholder="Mô tả chi tiết về phòng, vị trí, tiện ích xung quanh..." />
          </div>
        )}
        {step === 6 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">✅</span></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Xác nhận đăng tin</h2>
            <p className="text-sm text-gray-500 mb-6">Vui lòng kiểm tra lại thông tin trước khi đăng</p>
            <button className="btn-accent px-8 py-3 text-base font-bold">Đăng tin ngay</button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-ghost" >← Quay lại</button>
        {step < STEPS.length - 1 && <button onClick={() => setStep(step + 1)} className="btn-accent">Tiếp theo →</button>}
      </div>
    </div>
  );
}
