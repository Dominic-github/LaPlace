import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  /** Extra query params to append, e.g. "&category=kinh-nghiem" */
  extraParams?: string;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  
  const pages: (number | '...')[] = [];
  
  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  
  return pages;
}

export default function Pagination({ currentPage, totalPages, baseUrl, extraParams = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const buildHref = (p: number) => `${baseUrl}?page=${p}${extraParams}`;

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center mt-12">
      <div className="inline-flex items-center gap-1 bg-white px-2 py-2 rounded-2xl border border-gray-100 shadow-sm">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            aria-label="Trang trước"
          >
            <FiChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <span className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 cursor-not-allowed">
            <FiChevronLeft className="w-5 h-5" />
          </span>
        )}

        {/* Page Numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm select-none">
              ⋯
            </span>
          ) : p === currentPage ? (
            <span
              key={p}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white text-sm font-bold shadow-md shadow-primary-200"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            aria-label="Trang sau"
          >
            <FiChevronRight className="w-5 h-5" />
          </Link>
        ) : (
          <span className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 cursor-not-allowed">
            <FiChevronRight className="w-5 h-5" />
          </span>
        )}
      </div>
    </nav>
  );
}
