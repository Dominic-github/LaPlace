import type { Metadata } from 'next';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare, FiTag } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Liên hệ | LaPlace',
  description: 'Liên hệ với LaPlace để được hỗ trợ thuê phòng, đăng tin, hợp tác kinh doanh.',
};

export default function ContactPage() {
  return (
    <div className="container-page pb-20 pt-4">
      <Breadcrumbs items={[{ label: 'Liên hệ' }]} />

      {/* Header */}
      <div className="mb-12 mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">
          Liên hệ <span className="text-gradient">LaPlace</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại tin nhắn hoặc liên hệ trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <FiSend className="text-primary-600" />
              Gửi tin nhắn cho chúng tôi
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Họ tên */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    placeholder="0123 456 789"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              {/* Chủ đề */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Chủ đề <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all appearance-none">
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="thue-phong">Tìm phòng / thuê phòng</option>
                    <option value="dang-tin">Đăng tin cho thuê</option>
                    <option value="hop-tac">Hợp tác kinh doanh</option>
                    <option value="bao-loi">Báo lỗi / Góp ý</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>

              {/* Nội dung */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Nội dung <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                  <textarea
                    rows={5}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                <FiSend className="w-4 h-4" />
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Thông tin liên hệ</h2>
            <div className="space-y-5">
              {[
                { icon: <FiMapPin className="w-5 h-5" />, label: 'Địa chỉ', value: '123 Đường ABC, Quận 1, TP.HCM', color: 'bg-blue-50 text-blue-600' },
                { icon: <FiPhone className="w-5 h-5" />, label: 'Hotline', value: '0123 456 789', color: 'bg-emerald-50 text-emerald-600' },
                { icon: <FiMail className="w-5 h-5" />, label: 'Email', value: 'info@laplace.vn', color: 'bg-amber-50 text-amber-600' },
                { icon: <FiClock className="w-5 h-5" />, label: 'Giờ làm việc', value: '8:00 - 22:00, T2 - CN', color: 'bg-purple-50 text-purple-600' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-11 h-11 ${c.color} rounded-xl flex items-center justify-center shrink-0`}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{c.label}</p>
                    <p className="font-semibold text-slate-800 text-sm">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-8">
            <h3 className="font-bold text-slate-900 mb-4">Câu hỏi thường gặp</h3>
            <div className="space-y-3">
              {[
                'Làm sao để đăng tin cho thuê?',
                'Phí sử dụng dịch vụ là bao nhiêu?',
                'Tôi bị lừa đảo phải làm sao?',
              ].map((q, i) => (
                <a key={i} href="/ho-tro" className="block text-sm text-slate-600 hover:text-primary-600 transition-colors py-1.5 font-medium">
                  → {q}
                </a>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="aspect-[4/3] bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
            <div className="text-center">
              <FiMapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Google Maps</p>
              <p className="text-xs text-slate-400">Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
