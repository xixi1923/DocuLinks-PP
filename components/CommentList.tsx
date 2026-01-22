
'use client'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from '@/lib/firebaseClient'
import { addComment, getComments } from '@/lib/firestoreHelpers'

export default function CommentList({ documentId }: { documentId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  const load = async () => {
    const data = await getComments(documentId)
    setComments(data)
  }

  useEffect(() => {
    load()
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null)
    })
    return () => unsub()
  }, [documentId])

  const post = async () => {
    if (!userId) {
      alert('Please log in')
      return
    }
    if (!content.trim()) return
    await addComment(documentId, userId, content)
    setContent('')
    load()
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
            <div className="text-sm text-slate-500 dark:text-slate-400">{c.user_id} • {c.created_at?.toDate ? c.created_at.toDate().toLocaleString() : ''}</div>
            <div>{c.content}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
