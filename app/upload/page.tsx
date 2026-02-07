
'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { Upload, FileText, Type } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { useUserRole } from '@/contexts/UserRoleContext'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [msgType, setMsgType] = useState<'success' | 'error'>('error')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successInfo, setSuccessInfo] = useState<{ title: string; url: string }>({ title: '', url: '' })
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const toast = useToast()
  const { role } = useUserRole()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login')
      } else {
        setUser(currentUser)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'admin') {
      toast.warning('Admin accounts cannot upload documents')
      return
    }
    if (loading) return
    setMsg(null)
    if (!file || !title || !user) { 
      toast.error('Please fill all required fields and select a file')
      return 
    }
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('userId', user.uid)
      formData.append('userEmail', user.email || user.uid)

      const uploadResponse = await fetch(
        process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/upload',
        { method: 'POST', body: formData }
      )
      const uploadData = await uploadResponse.json()
      if (!uploadData.publicUrl) throw new Error('File upload failed')

      toast.success('Document uploaded successfully! Pending admin approval.')
      setLoading(false)
      setSuccessInfo({ title, url: uploadData.publicUrl })
      setSuccessOpen(true)
      setTitle(''); setDescription(''); setFile(null)
    } catch (error: any) { 
      toast.error(error.message || 'Upload failed. Please try again.')
      setLoading(false)
    }
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
          {role === 'admin' && (
            <div className='mt-3 p-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm font-semibold'>
              Admin accounts can view and approve documents but cannot upload new ones.
            </div>
          )}
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

          {/* Submit Button */}
          <div className='flex gap-3 pt-2'>
            <button 
              type='submit'
              disabled={loading || role === 'admin'}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                loading || role === 'admin'
                  ? 'bg-slate-400 dark:bg-slate-600 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
              }`}>
              {loading ? '⏳ កំពុងលើក...' : role === 'admin' ? 'Admin cannot upload' : '✓ លើកឯកសារ'}
            </button>
            <button 
              type='button'
              onClick={() => {
                setTitle(''); setDescription(''); setFile(null); setMsg(null)
              }}
              className='py-3 px-6 rounded-lg font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition'>
              សម្អាត
            </button>
          </div>
        </form>
        {successOpen && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4'>
            <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-300'>
                    ✓
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Upload successful</h3>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>Awaiting admin approval</p>
                  </div>
                </div>
                <button
                  onClick={() => setSuccessOpen(false)}
                  className='text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
                >
                  ✕
                </button>
              </div>
              <div className='space-y-2 mb-4'>
                <p className='text-slate-800 dark:text-slate-200 font-semibold'>{successInfo.title}</p>
                <a
                  href={successInfo.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 dark:text-blue-400 underline break-all'
                >
                  View file link
                </a>
              </div>
              <div className='flex flex-col gap-2'>
                <button
                  onClick={() => setSuccessOpen(false)}
                  className='w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition'
                >
                  Done
                </button>
                <Link
                  href='/explore'
                  className='w-full text-center py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-semibold'
                  onClick={() => setSuccessOpen(false)}
                >
                  Go to Explore
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
