import { FiInbox } from 'react-icons/fi';
import Link from 'next/link';

export default function EmptyState({ title = 'Không có dữ liệu', description, actionLabel, actionHref }: { title?: string; description?: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><FiInbox className="w-8 h-8 text-gray-400" /></div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
      {actionLabel && actionHref && <Link href={actionHref} className="btn-primary btn-sm">{actionLabel}</Link>}
    </div>
  );
}
