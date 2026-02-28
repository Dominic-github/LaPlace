'use client';

import { useState, useEffect, useCallback } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import SearchBar from '@/components/shared/SearchBar';
import { PRICE_RANGES, AREA_RANGES, FACILITIES, ACCOMMODATION_TYPES, formatCurrency, slugify } from '@/lib/utils';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { accommodationApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('newest');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accommodationApi.getAll({
        type: selectedType === 'all' ? undefined : selectedType,
        sort,
        page,
        limit: 9
      });
      setListings(res.data?.data?.items || []);
      setPagination(res.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load listings', err);
    }
    setLoading(false);
  }, [selectedType, sort, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: 'Tìm phòng' }]} />

      {/* Search */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button onClick={() => setSelectedType('all')} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedType === 'all' ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'}`}>Tất cả</button>
        {ACCOMMODATION_TYPES.map(t => (
          <button key={t.slug} onClick={() => setSelectedType(t.slug)} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedType === t.slug ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - Desktop */}
        <aside className={`${showFilter ? 'fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent' : 'hidden lg:block'} lg:w-72 shrink-0`}>
          <div className={`${showFilter ? 'absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto' : ''} lg:static lg:p-0`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-bold text-lg">Bộ lọc</h3>
              <button onClick={() => setShowFilter(false)}><FiX className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              {/* Price */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Mức giá</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((r, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                      <input type="radio" name="price" className="accent-primary" /> {r.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Diện tích</h4>
                <div className="space-y-2">
                  {AREA_RANGES.map((r, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                      <input type="radio" name="area" className="accent-primary" /> {r.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Số phòng ngủ</h4>
                <div className="flex flex-wrap gap-2">
                  {['Tất cả', '1', '2', '3', '4+'].map(n => (
                    <button key={n} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">{n}</button>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Tiện nghi</h4>
                <div className="grid grid-cols-2 gap-2">
                  {FACILITIES.slice(0, 10).map(f => (
                    <label key={f} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-primary">
                      <input type="checkbox" className="accent-primary rounded" /> {f}
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full btn-sm" onClick={() => fetchListings()}>Áp dụng bộ lọc</button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-5 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilter(true)} className="btn-ghost btn-sm lg:hidden"><FiFilter className="w-4 h-4" /> Lọc</button>
              <span className="text-sm text-gray-500 hidden sm:inline">Tìm thấy <strong className="text-gray-900">{pagination.total}</strong> kết quả</span>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={e => {setSort(e.target.value); setPage(1)}} className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
                <option value="area_asc">Diện tích tăng</option>
                <option value="area_desc">Diện tích giảm</option>
              </select>
              <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}><FiGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}><FiList className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Grid View */}
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <Link href={`/${listing.type}/${slugify(listing.name)}?id=${listing.accommodation_id}`} key={listing.accommodation_id} className="card group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                       <Image src={listing.images[0].image_url} alt={listing.name || 'Image'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                       <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow flex gap-1 items-center">
                       <span className="text-yellow-500">★</span> 4.9
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">{listing.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">{listing.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-lg">{formatCurrency(Number(listing.price))} <span className="text-xs text-gray-400 font-normal">/tháng</span></span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{listing.area} m²</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.</p>
                <button onClick={() => { setSelectedType('all'); fetchListings(); }} className="mt-4 btn-ghost btn-sm">Xóa bộ lọc</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="btn-ghost btn-sm disabled:opacity-50">← Trước</button>
              
              <span className="flex items-center gap-2">
                Trang <strong className="text-primary">{page}</strong> / {pagination.totalPages}
              </span>
              
              <button 
                disabled={page >= pagination.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="btn-ghost btn-sm disabled:opacity-50">Sau →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
