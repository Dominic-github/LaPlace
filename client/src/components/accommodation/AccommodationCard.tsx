'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { FiMapPin, FiMaximize, FiHeart } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';

interface Props {
  id: string;
  slug: string;
  title: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  type?: string;
  featured?: boolean;
  isNew?: boolean;
  hasVideo?: boolean;
}

export default function AccommodationCard({
  slug, title, address, price, area, bedrooms, bathrooms, image, type = 'phong-tro', featured, isNew, hasVideo,
}: Props) {
  return (
    <Link href={`/${type}/${slug}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image || '/images/placeholder.jpg'} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {featured && <span className="badge bg-accent text-white text-[10px]">Nổi bật</span>}
          {isNew && <span className="badge bg-green-500 text-white text-[10px]">Mới</span>}
          {hasVideo && <span className="badge bg-purple-500 text-white text-[10px]">🎬 Video</span>}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"
        >
          <FiHeart className="w-4 h-4" />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg">{formatPrice(price)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">{title}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3"><FiMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> <span className="line-clamp-1">{address}</span></p>
        <div className="flex items-center gap-3 text-xs text-gray-600 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1"><FiMaximize className="w-3.5 h-3.5 text-gray-400" /> {area}m²</span>
          <span className="flex items-center gap-1"><IoBedOutline className="w-3.5 h-3.5 text-gray-400" /> {bedrooms} PN</span>
          <span className="flex items-center gap-1"><LuBath className="w-3.5 h-3.5 text-gray-400" /> {bathrooms} PT</span>
        </div>
      </div>
    </Link>
  );
}
