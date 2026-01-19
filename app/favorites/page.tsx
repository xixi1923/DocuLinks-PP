
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Heart, MessageCircle, Share2, Bookmark, Download, Eye, Trash2, Search } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        setCurrentUser(user)

        const { data } = await supabase
          .from('favorites')
          .select('document_id, documents(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        const mapped = (data || []).map((r: any) => ({
          ...r.documents,
          favorited: true
        })).filter((doc: any) => doc !== null)

        setDocs(mapped)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const removeFavorite = async (docId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('document_id', docId)

      setDocs(docs.filter(d => d.id !== docId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const filteredDocs = docs.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12'>
      <div className='max-w-2xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-2'>❤️ ឯកសារ​ដែលចូលចិត្ត</h1>
          <p className='text-slate-600 dark:text-slate-400'>គណនីរបស់អ្នក {docs.length} ឯកសារដែលរក្សាទុក</p>
        </div>

        {/* Search Bar */}
        <div className='mb-6 sticky top-20 z-40'>
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='ស្វងរក​ឯកសារ...'
              className='w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
            />
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-flex flex-col items-center gap-3'>
              <div className='w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin' />
              <p className='text-slate-600 dark:text-slate-400'>កំពុងផ្ទុក...</p>
            </div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className='text-center py-16'>
            <Heart className='w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50' />
            <p className='text-slate-600 dark:text-slate-400 text-lg font-medium'>មិនទាន់មាន​ឯកសារ​ដែល​ចូលចិត្ត</p>
            <p className='text-slate-500 dark:text-slate-500 text-sm mt-2'>រក្សាទុក​ឯកសារ​ដែលឯលក់ដូចដែលលេចឡើងក្នុង​ផ្ដាច់មុខ</p>
            <Link href='/documents' className='inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition'>
              រក​ឯកសារ
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredDocs.map((doc) => (
              <div key={doc.id} className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition'>
                {/* Card Header */}
                <div className='p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1'>
                    <img
                      src={doc.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.user_id}`}
                      alt={doc.user?.name}
                      className='w-10 h-10 rounded-full'
                    />
                    <div>
                      <p className='font-semibold text-slate-900 dark:text-white'>{doc.user?.name || 'ឈ្មោះ'}</p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        {doc.created_at ? new Date(doc.created_at).toLocaleDateString('km-KH') : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(doc.id)}
                    className='p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition'
                    title='ដកចេញពីឯកសារដែលចូលចិត្ត'
                  >
                    <Trash2 className='w-5 h-5' />
                  </button>
                </div>

                {/* Content */}
                <div className='p-4'>
                  <h3 className='font-bold text-lg text-slate-900 dark:text-white mb-2'>{doc.title}</h3>
                  <p className='text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2'>{doc.description}</p>

                  {/* File Info Box */}
                  <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs'>
                        {doc.file_type?.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <p className='font-semibold text-slate-900 dark:text-white text-sm'>{doc.file_name || 'ឯកសារ'}</p>
                        <p className='text-xs text-slate-600 dark:text-slate-400'>{doc.file_type}</p>
                      </div>
                    </div>
                    <button className='p-2 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-lg transition'>
                      <Download className='w-5 h-5' />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className='flex gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4'>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-4 h-4' />
                      {doc.views || 0}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Heart className='w-4 h-4' />
                      {doc.likes || 0}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MessageCircle className='w-4 h-4' />
                      {doc.comments || 0}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button className='flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition'>
                      <Heart className='w-4 h-4' />
                      ចូលចិត្ត
                    </button>
                    <button className='flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition'>
                      <MessageCircle className='w-4 h-4' />
                      យោបល់
                    </button>
                    <button className='flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition'>
                      <Share2 className='w-4 h-4' />
                      ចែករំលែក
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
