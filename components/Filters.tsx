
'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type Cat = { id: number, name: string, slug: string }

export default function Filters({ categories, basePath }: { categories: Cat[], basePath?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const current = params.get('cat') ?? 'all'

  const setCat = (c: string) => {
    const qs = new URLSearchParams(params.toString())
    if (c === 'all') qs.delete('cat'); else qs.set('cat', c)
    const target = basePath ?? pathname ?? '/'
    router.push(target + '?' + qs.toString())
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={()=>setCat('all')} className={`pill ${current==='all' ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>All</button>
      {categories.map(c => (
        <button key={c.slug} onClick={()=>setCat(c.slug)} className={`pill ${current===c.slug ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{c.name}</button>
      ))}
    </div>
  )
}
