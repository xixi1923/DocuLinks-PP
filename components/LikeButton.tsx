
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function LikeButton({ documentId }: { documentId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  useEffect(() => {
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('document_id', documentId)
      .then(({ count }) => setCount(count ?? 0))
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) return
      const { data: row } = await supabase.from('likes')
        .select('user_id').eq('document_id', documentId).eq('user_id', uid).maybeSingle()
      setLiked(!!row)
    })
  }, [documentId])
  const toggle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Please log in')
    if (liked) {
      await supabase.from('likes').delete().eq('document_id', documentId).eq('user_id', user.id)
      setLiked(false); setCount(c=>c-1)
    } else {
      await supabase.from('likes').insert({ document_id: documentId, user_id: user.id })
      setLiked(true); setCount(c=>c+1)
    }
  }
  return (
    <button onClick={toggle} className={`btn btn-outline ${liked ? 'bg-pink-600 text-white border-pink-600' : ''}`}>❤️ {count}</button>
  )
}
