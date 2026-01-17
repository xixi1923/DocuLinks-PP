
import Link from 'next/link'
import { fileIcon } from '@/lib/helpers'
export default function DocumentCard({ doc }: { doc: any }) {
  const icon = fileIcon(doc.file_type || '')
  return (
    <Link href={`/documents/${doc.id}`} className="block card p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{doc.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{doc.description}</p>
        </div>
      </div>
    </Link>
  )
}
