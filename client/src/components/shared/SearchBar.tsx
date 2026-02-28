'use client';

import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICE_RANGES, AREA_RANGES } from '@/lib/utils';

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [priceIdx, setPriceIdx] = useState(0);
  const [areaIdx, setAreaIdx] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (priceIdx > 0) { params.set('minPrice', String(PRICE_RANGES[priceIdx].min)); if (PRICE_RANGES[priceIdx].max) params.set('maxPrice', String(PRICE_RANGES[priceIdx].max)); }
    if (areaIdx > 0) { params.set('minArea', String(AREA_RANGES[areaIdx].min)); if (AREA_RANGES[areaIdx].max) params.set('maxArea', String(AREA_RANGES[areaIdx].max)); }
    router.push(`/tim-phong?${params.toString()}`);
  };

  if (compact) {
    return (
      <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden max-w-xl w-full">
        <FiMapPin className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
        <input type="text" placeholder="Nhập địa điểm, quận, tên đường..." value={location} onChange={e => setLocation(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-3 py-3 text-sm border-none focus:outline-none"
        />
        <button onClick={handleSearch} className="bg-primary text-white px-5 py-3 hover:bg-primary-700 transition-colors"><FiSearch className="w-5 h-5" /></button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className="input-label">Địa điểm</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Nhập quận, đường, tên khu vực..." value={location} onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <label className="input-label">Mức giá</label>
          <select value={priceIdx} onChange={e => setPriceIdx(+e.target.value)} className="input-field">
            {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">Diện tích</label>
          <select value={areaIdx} onChange={e => setAreaIdx(+e.target.value)} className="input-field">
            {AREA_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleSearch} className="btn-primary w-full mt-4 py-3.5">
        <FiSearch className="w-5 h-5" /> Tìm kiếm
      </button>
    </div>
  );
}
