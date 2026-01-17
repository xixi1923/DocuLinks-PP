
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import DocumentCard from '@/components/DocumentCard'
export default function FavoritesPage() {
  const [docs, setDocs] = useState<any[]>([])
  useEffect(()=>{
    (async ()=>{
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('favorites').select('document_id, documents(*)').eq('user_id', user.id)
      const mapped = (data||[]).map((r:any)=>r.documents)
      setDocs(mapped)
    })()
  },[])
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your Favorites</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {docs.map((d:any)=> <DocumentCard key={d.id} doc={d} />)}
      </div>
    </main>
  )
}
