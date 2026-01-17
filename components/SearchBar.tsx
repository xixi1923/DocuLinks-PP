
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  useEffect(()=> setQ(params.get('q') ?? ''), [params])
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qs = new URLSearchParams(params.toString())
    if (q) qs.set('q', q); else qs.delete('q')
    router.push('/?'+qs.toString())
  }
  return (
    <form onSubmit={onSubmit} className="flex items-center bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-2 shadow-sm">
      <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by title, subject, or description…" className="flex-1 outline-none px-3 py-2 bg-transparent" />
      <button className="btn btn-primary">Search</button>
    </form>
  )
}
