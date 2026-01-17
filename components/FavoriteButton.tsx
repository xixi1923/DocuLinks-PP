
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function FavoriteButton({ documentId }: { documentId: string }) {
  const [fav, setFav] = useState(false)
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) return
      const { data: row } = await supabase.from('favorites')
        .select('user_id').eq('document_id', documentId).eq('user_id', uid).maybeSingle()
      setFav(!!row)
    })
  }, [documentId])
  const toggle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Please log in')
    if (fav) {
      await supabase.from('favorites').delete().eq('document_id', documentId).eq('user_id', user.id)
      setFav(false)
    } else {
      await supabase.from('favorites').insert({ document_id: documentId, user_id: user.id })
      setFav(true)
    }
  }
  return (
    <button onClick={toggle} className={`btn btn-outline ${fav ? 'bg-amber-500 text-white border-amber-500' : ''}`}>⭐ {fav ? 'Saved' : 'Save'}</button>
  )
}
