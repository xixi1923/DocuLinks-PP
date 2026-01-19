'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { CheckCircle, Trash2, Eye, FileText, Users, AlertCircle, BarChart3 } from 'lucide-react'

// Mock pending documents
const MOCK_PENDING_DOCS = [
  {
    id: '1',
    title: 'ដើម្បីសិក្សាវិទ្យាសាស្ត្របានច្រើន',
    description: 'សម្ភារៈសិក្សាលម្អិតលម្អិត',
    file_type: 'PDF',
    file_name: 'computer_science.pdf',
    category: 'សិក្សាធិការ',
    user: { name: 'សុខ សាម៉ុន', email: 'sokh@example.com' },
    created_at: new Date().toISOString(),
    views: 0,
    status: 'pending'
  },
  {
    id: '2',
    title: 'គាត់មេរៀនវិជ្ជមាន - ធុរកិច្ច',
    description: 'ម៉ាស៊ីនបង្រៀនមូលដ្ឋាននិងគោលលទ្ធិលម្អិត',
    file_type: 'DOCX',
    file_name: 'business_fundamentals.docx',
    category: 'ធុរកិច្ច',
    user: { name: 'កញ្ញា មេដូច', email: 'kanyna@example.com' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    views: 0,
    status: 'pending'
  },
  {
    id: '3',
    title: 'ច្បាប់ស្នើសុំលក្ខណ៍',
    description: 'ឯកសារស្នើសុំលក្ខណ៍ទូលំទូលាយ',
    file_type: 'PDF',
    file_name: 'legal_documents.pdf',
    category: 'ច្បាប់',
    user: { name: 'ល្អ ធម', email: 'la@example.com' },
    created_at: new Date(Date.now() - 172800000).toISOString(),
    views: 0,
    status: 'pending'
  },
]

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [docs, setDocs] = useState(MOCK_PENDING_DOCS)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const approveDocument = (docId: string) => {
    setDocs(prev => prev.filter(d => d.id !== docId))
  }

  const rejectDocument = (docId: string) => {
    setDocs(prev => prev.filter(d => d.id !== docId))
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-12 flex items-center justify-center'>
        <div className='inline-flex flex-col items-center gap-3'>
          <div className='w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin' />
          <p className='text-slate-600 dark:text-slate-400'>កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  const filteredDocs = filter === 'all' ? docs : docs.filter(d => d.status === filter)

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-12'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg'>
              <BarChart3 className='w-6 h-6 text-amber-600 dark:text-amber-400' />
            </div>
            <div>
              <h1 className='text-4xl font-bold text-slate-900 dark:text-white'>📊 ផ្ទាំងគ្រប់គ្រង</h1>
              <p className='text-slate-600 dark:text-slate-400 text-sm'>គ្រប់គ្រងឯកសារ និង ប្រើប្រាស់</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>ឯកសារស្តង់ដរ</p>
                <p className='text-3xl font-bold text-slate-900 dark:text-white mt-1'>{docs.length}</p>
              </div>
              <FileText className='w-12 h-12 text-blue-100 dark:text-blue-900/30' />
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>អ្នកប្រើប្រាស់សកម្ម</p>
                <p className='text-3xl font-bold text-slate-900 dark:text-white mt-1'>1,234</p>
              </div>
              <Users className='w-12 h-12 text-green-100 dark:text-green-900/30' />
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>ចម្លងសរុប</p>
                <p className='text-3xl font-bold text-slate-900 dark:text-white mt-1'>5,678</p>
              </div>
              <Eye className='w-12 h-12 text-purple-100 dark:text-purple-900/30' />
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>ប៉ាន់ស្មាន</p>
                <p className='text-3xl font-bold text-slate-900 dark:text-white mt-1'>{docs.length}</p>
              </div>
              <AlertCircle className='w-12 h-12 text-orange-100 dark:text-orange-900/30' />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className='mb-6'>
          <div className='flex gap-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
              }`}
            >
              ទាំងអស់
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
              }`}
            >
              ស្តង់ដរ ({docs.length})
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className='bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
          {filteredDocs.length === 0 ? (
            <div className='text-center py-12'>
              <CheckCircle className='w-16 h-16 text-green-300 dark:text-green-900/30 mx-auto mb-4' />
              <p className='text-slate-600 dark:text-slate-400 text-lg'>គ្មានឯកសារស្តង់ដរ</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>ចំណងជើង</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>អ្នកផ្ញើ</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>ប្រភេទ</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>ថ្ងៃ</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white'>សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className='border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition'>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='font-semibold text-slate-900 dark:text-white'>{doc.title}</p>
                          <p className='text-sm text-slate-600 dark:text-slate-400'>{doc.description?.slice(0, 50)}...</p>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div>
                          <p className='font-medium text-slate-900 dark:text-white'>{doc.user.name}</p>
                          <p className='text-sm text-slate-600 dark:text-slate-400'>{doc.user.email}</p>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold'>
                          {doc.file_type}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-sm text-slate-600 dark:text-slate-400'>
                        {new Date(doc.created_at).toLocaleDateString('km-KH')}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => approveDocument(doc.id)}
                            className='px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1'
                            title='ឯកសារប្រើប្រាស់'
                          >
                            <CheckCircle size={16} />
                            អនុម័ត
                          </button>
                          <button
                            onClick={() => rejectDocument(doc.id)}
                            className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1'
                            title='បដិសេធ'
                          >
                            <Trash2 size={16} />
                            បដិសេធ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
