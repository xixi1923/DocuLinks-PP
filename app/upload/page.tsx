
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Upload, FileText, Tag, Layers, Type, AlignLeft, Users, Lock, CheckCircle } from 'lucide-react'

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
  const [tags, setTags] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('intermediate')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [msgType, setMsgType] = useState<'success' | 'error'>('error')
  const [cats, setCats] = useState<{id:number,name:string}[]>([])

  useEffect(()=>{
    supabase.from('categories').select('id,name').order('name').then(({data})=> setCats(data||[]))
  },[])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!file || !title) { 
      setMsgType('error')
      setMsg('សូមបំពេញចងក្រងស្នើសុំ ហើយលើកឯកសារឡើង។')
      return 
    }
    setLoading(true)

    const { data: { user }, error: uerr } = await supabase.auth.getUser()
    if (uerr || !user) { 
      setMsgType('error')
      setMsg('សូមចូលប្រើគណនីដំបូង។')
      setLoading(false)
      return 
    }

    const ext = file.name.split('.').pop()
    const key = `documents/${user.id}/${uuid()}.${ext}`

    const { error: upErr } = await supabase.storage.from('documents').upload(key, file, { contentType: file.type, upsert: false })
    if (upErr) { 
      setMsgType('error')
      setMsg(upErr.message)
      setLoading(false)
      return 
    }

    const { error: insErr } = await supabase.from('documents').insert({
      user_id: user.id,
      title,
      description,
      category_id: categoryId,
      file_path: key,
      file_type: file.type,
      status: 'pending',
      subject,
      level,
      is_public: isPublic,
      tags
    })
    if (insErr) { 
      setMsgType('error')
      setMsg(insErr.message)
      setLoading(false)
      return 
    }

    setMsgType('success')
    setMsg('☑ ឯកសារបានលើកឡើងដោយជោគជ័យ។ វានឹងលេចឡើងបន្ទាប់ពីការត្រួតពិនិត្យរបស់ក្រុមគ្រប់គ្រង។')
    setLoading(false)
    setTitle(''); setDescription(''); setFile(null); setCategoryId(null); setTags(''); setSubject(''); setLevel('intermediate')
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12'>
      <div className='max-w-3xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg'>
              <Upload className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>ផ្ទុកឯកសារ</h1>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>ចែករំលែកលទ្ធផលអប់រំរបស់អ្នក</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpload} className='space-y-6'>
          {/* Message */}
          {msg && (
            <div className={`p-4 rounded-lg border ${msgType === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
              {msg}
            </div>
          )}

          {/* Basic Info Section */}
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
              <Type className='w-5 h-5 text-blue-600' />
              ព័ត៌មាននៃឯកសារ
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  ចំណងជើង *
                </label>
                <input 
                  type='text' 
                  value={title}
                  onChange={(e)=> setTitle(e.target.value)} 
                  placeholder='ឧ. គណិតវិទ្យា - អនុគមន៍ក្នុងមួយផ្នែក'
                  maxLength={120}
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                />
                <p className='text-xs text-slate-500 mt-1'>{title.length}/120</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  ការពិពណ៌នា
                </label>
                <textarea 
                  value={description}
                  onChange={(e)=> setDescription(e.target.value)}
                  placeholder='ពិពណ៌នាលម្អិតអំពីឯកសាររបស់អ្នក...'
                  rows={4}
                  maxLength={500}
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none'
                />
                <p className='text-xs text-slate-500 mt-1'>{description.length}/500</p>
              </div>
            </div>
          </div>

          {/* Category & Classification Section */}
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
              <Layers className='w-5 h-5 text-purple-600' />
              ការចាត់ថ្នាក់ប្រកាស
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  ប្រភេទ *
                </label>
                <select 
                  value={categoryId || ''}
                  onChange={(e)=> setCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                >
                  <option value=''>-- ជ្រើសរើស --</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  កម្រិតលំបាក
                </label>
                <select 
                  value={level}
                  onChange={(e)=> setLevel(e.target.value)}
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                >
                  <option value='beginner'>ចាប់ផ្តើម</option>
                  <option value='intermediate'>មធ្យម</option>
                  <option value='advanced'>មិនបាន​សរសេរ</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  ប្រធានបទ
                </label>
                <input 
                  type='text' 
                  value={subject}
                  onChange={(e)=> setSubject(e.target.value)}
                  placeholder='ឧ. គណិតវិទ្យា, វិទ្យាសាស្ត្រ, ប្រវត្តិសាស្ត្រ'
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  ស្លាក/ពាក្យគន្លឹះ
                </label>
                <input 
                  type='text' 
                  value={tags}
                  onChange={(e)=> setTags(e.target.value)}
                  placeholder='អក្សរបំបែកដោយលេខក្បៀស...'
                  className='w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-indigo-600' />
              លើកឯកសារ
            </h2>
            
            <div className='border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer'
              onClick={()=> document.getElementById('file-input')?.click()}>
              <Upload className='w-12 h-12 text-slate-400 mx-auto mb-3' />
              <p className='text-slate-900 dark:text-white font-medium mb-1'>ចុចដើម្បីលើកឯកសារ</p>
              <p className='text-sm text-slate-500 dark:text-slate-400'>ឬដាក់រមូលដ្ឋានលើ PDF, DOC, PPT, PNG, JPG</p>
              {file && <p className='text-sm text-green-600 dark:text-green-400 mt-2 font-medium'>✓ {file.name}</p>}
            </div>
            <input 
              id='file-input'
              type='file' 
              onChange={(e)=> setFile(e.target.files?.[0] || null)}
              accept='.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg'
              className='hidden'
            />
          </div>

          {/* Privacy Section */}
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2'>
              <Lock className='w-5 h-5 text-orange-600' />
              ឯកជនភាព
            </h2>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input 
                type='checkbox'
                checked={isPublic}
                onChange={(e)=> setIsPublic(e.target.checked)}
                className='w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 cursor-pointer'
              />
              <span className='text-slate-700 dark:text-slate-300'>
                ធ្វើឱ្យលម្អិត - អ្នកប្រើប្រាស់ដទៃទៀតក្នុងបណ្តាញអាចឃើញនិងលេងលើឯកសារនេះ
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className='flex gap-3 pt-2'>
            <button 
              type='submit'
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                loading 
                  ? 'bg-slate-400 dark:bg-slate-600 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
              }`}>
              {loading ? '⏳ កំពុងលើក...' : '✓ លើកឯកសារ'}
            </button>
            <button 
              type='button'
              onClick={() => {
                setTitle(''); setDescription(''); setFile(null); setCategoryId(null); 
                setTags(''); setSubject(''); setLevel('intermediate'); setMsg(null)
              }}
              className='py-3 px-6 rounded-lg font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition'>
              សម្អាត
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
