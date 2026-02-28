import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem { label: string; href?: string; }

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 py-4 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors"><FiHome className="w-3.5 h-3.5" /> Trang chủ</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <FiChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.href ? <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link> : <span className="text-gray-800 font-medium">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
