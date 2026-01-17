
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16)
  })
}

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [cats, setCats] = useState<{id:number,name:string}[]>([])

  useEffect(()=>{
    supabase.from('categories').select('id,name').order('name').then(({data})=> setCats(data||[]))
  },[])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!file || !title) { setMsg('Please add a title and file.'); return }
    setLoading(true)

    const { data: { user }, error: uerr } = await supabase.auth.getUser()
    if (uerr || !user) { setMsg('Please log in.'); setLoading(false); return }

    const ext = file.name.split('.').pop()
    const key = `documents/${user.id}/${uuid()}.${ext}`

    const { error: upErr } = await supabase.storage.from('documents').upload(key, file, { contentType: file.type, upsert: false })
    if (upErr) { setMsg(upErr.message); setLoading(false); return }

    const { error: insErr } = await supabase.from('documents').insert({
      user_id: user.id,
      title,
      description,
      category_id: categoryId,
      file_path: key,
      file_type: file.type,
      status: 'approved'
    })
    if (insErr) { setMsg(insErr.message); setLoading(false); return }

    setMsg('Uploaded successfully!')
    setLoading(false)
    setTitle(''); setDescription(''); setFile(null); setCategoryId(null)
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Upload Document</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800"/>
        <select value={categoryId ?? ''} onChange={e=>setCategoryId(Number(e.target.value)||null)} className="w-full border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800">
          <option value="">Select Category</option>
          {cats.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800" rows={4}/>
        <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <button disabled={loading} className="btn btn-primary">{loading ? 'Uploading...' : 'Upload'}</button>
        {msg && <p className="text-sm text-slate-600 dark:text-slate-300">{msg}</p>}
      </form>
    </main>
  )
}
