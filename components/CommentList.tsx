
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
export default function CommentList({ documentId }: { documentId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const load = async () => {
    const { data } = await supabase
      .from('comments')
      .select('id,content,created_at, user_id')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
    setComments(data ?? [])
  }
  useEffect(() => { load() }, [documentId])
  const post = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Please log in')
    if (!content.trim()) return
    await supabase.from('comments').insert({ document_id: documentId, user_id: user.id, content })
    setContent(''); load()
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={content} onChange={e=>setContent(e.target.value)} placeholder="Write a comment…" className="flex-1 border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800"/>
        <button onClick={post} className="btn btn-primary">Post</button>
      </div>
      <ul className="space-y-2">
        {comments.map(c => (
          <li key={c.id} className="card p-3">
            <div className="text-sm text-slate-500 dark:text-slate-400">{c.user_id} • {new Date(c.created_at).toLocaleString()}</div>
            <div>{c.content}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
