'use client';
import { useState } from 'react';

export default function FinancePage() {
  const [tab, setTab] = useState<'overview' | 'income' | 'expense'>('overview');
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý thu chi</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100"><p className="text-xs text-green-600 mb-1">Tổng thu</p><p className="text-2xl font-bold text-green-700">28.000.000 đ</p></div>
        <div className="bg-red-50 rounded-2xl p-5 border border-red-100"><p className="text-xs text-red-600 mb-1">Tổng chi</p><p className="text-2xl font-bold text-red-700">5.200.000 đ</p></div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100"><p className="text-xs text-blue-600 mb-1">Lợi nhuận</p><p className="text-2xl font-bold text-blue-700">22.800.000 đ</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'income', 'expense'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn-sm rounded-full ${tab === t ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700'}`}>
            {t === 'overview' ? 'Tổng quan' : t === 'income' ? 'Thu' : 'Chi'}
          </button>
        ))}
        <button className="btn-sm btn-accent ml-auto">+ Thêm khoản chi</button>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100">
        {[
          { type: 'income', desc: 'Tiền thuê P.101 - Tháng 02', date: '01/02/2026', amount: '3.500.000' },
          { type: 'income', desc: 'Tiền thuê P.203 - Tháng 02', date: '01/02/2026', amount: '4.000.000' },
          { type: 'expense', desc: 'Sửa chữa điện P.101', date: '05/02/2026', amount: '500.000' },
          { type: 'income', desc: 'Tiền thuê P.105 - Tháng 02', date: '01/02/2026', amount: '3.000.000' },
          { type: 'expense', desc: 'Tiền nước tòa nhà', date: '10/02/2026', amount: '1.200.000' },
        ].filter(t => tab === 'overview' || t.type === tab).map((t, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {t.type === 'income' ? '↑' : '↓'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{t.desc}</p>
              <p className="text-xs text-gray-500">{t.date}</p>
            </div>
            <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'income' ? '+' : '-'}{t.amount} đ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
