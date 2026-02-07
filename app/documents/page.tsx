'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileText, Heart, MessageCircle, Download, Bookmark, Search, X, Eye } from 'lucide-react'
import { useTheme } from 'next-themes'
import { auth } from '@/lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { getApprovedDocuments, getUserLikes, getUserFavorites, addLike, removeLike, addFavorite, removeFavorite, type DocumentData } from '@/lib/firestoreHelpers'
import CommentModal from '@/components/CommentModal'
import { useToast } from '@/contexts/ToastContext'
import { useUserRole } from '@/contexts/UserRoleContext'
import Link from 'next/link'

const DOC_TYPE_CATEGORIES = [
  { id: 1, name: 'Lecture' },
  { id: 2, name: 'Exam' },
  { id: 3, name: 'Assignment' },
  { id: 4, name: 'Slide' },
  { id: 5, name: 'Notes' },
  { id: 6, name: 'Other' },
]

export default function DocumentsPage() {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userLikes, setUserLikes] = useState<string[]>([])
  const [userFavorites, setUserFavorites] = useState<string[]>([])
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedDocForComment, setSelectedDocForComment] = useState<DocumentData | null>(null)
  const toast = useToast()
  const { role } = useUserRole()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserId(user?.uid || null)
      
      if (user) {
        const likes = await getUserLikes(user.uid)
        const favorites = await getUserFavorites(user.uid)
        setUserLikes(likes)
        setUserFavorites(favorites)
      } else {
        setUserLikes([])
        setUserFavorites([])
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await getApprovedDocuments()
        setDocuments(docs)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !selectedCategory || doc.category_id?.toString() === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [documents, searchTerm, selectedCategory])

  const handleLike = async (docId: string) => {
    if (role === 'admin') {
      toast.warning('Admin accounts cannot like documents')
      return
    }
    if (!userId) {
      toast.warning('Please sign in to like documents')
      return
    }
    const isLiked = userLikes.includes(docId)
    
    try {
      if (isLiked) {
        await removeLike(userId, docId)
        setUserLikes(prev => prev.filter(id => id !== docId))
        setDocuments(prev => prev.map(doc => 
          doc.id === docId ? { ...doc, likes_count: Math.max(0, (doc.likes_count || 0) - 1) } : doc
        ))
      } else {
        await addLike(userId, docId)
        setUserLikes(prev => [...prev, docId])
        setDocuments(prev => prev.map(doc => 
          doc.id === docId ? { ...doc, likes_count: (doc.likes_count || 0) + 1 } : doc
        ))
        toast.success('Liked!')
      }
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleFavorite = async (docId: string) => {
    if (role === 'admin') {
      toast.warning('Admin accounts cannot favorite documents')
      return
    }
    if (!userId) {
      toast.warning('Please sign in to favorite documents')
      return
    }
    const isFavorited = userFavorites.includes(docId)
    
    try {
      if (isFavorited) {
        await removeFavorite(userId, docId)
        setUserFavorites(prev => prev.filter(id => id !== docId))
        setDocuments(prev => prev.map(doc => 
          doc.id === docId ? { ...doc, favorites_count: Math.max(0, (doc.favorites_count || 0) - 1) } : doc
        ))
      } else {
        await addFavorite(userId, docId)
        setUserFavorites(prev => [...prev, docId])
        setDocuments(prev => prev.map(doc => 
          doc.id === docId ? { ...doc, favorites_count: (doc.favorites_count || 0) + 1 } : doc
        ))
        toast.success('Added to favorites!')
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleCommentAdded = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, comments_count: (doc.comments_count || 0) + 1 } : doc
    ))
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-12'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-2'>📚 ឯកសារ និង ធនធាន</h1>
          <p className='text-slate-600 dark:text-slate-400'>ទាញយក និងស្វែងរកឯកសារពិតពី Firestore</p>
        </div>

        <div className='sticky top-16 z-40 mb-6 space-y-3 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-950 pb-4'>
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='ស្វែងរកឯកសារ...'
              className='w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
            />
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>

          <div className='flex gap-2 overflow-x-auto pb-2'>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
              }`}
            >
              ទាំងអស់
            </button>
            {DOC_TYPE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className='text-slate-500 dark:text-slate-400'>កំពុងទាញយកទិន្នន័យ...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className='text-center py-16'>
            <FileText className='w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50' />
            <p className='text-slate-600 dark:text-slate-400 text-lg font-medium'>មិនឃើញឯកសារ</p>
            <p className='text-slate-500 dark:text-slate-500 text-sm mt-2'>សូមព្យាយាមស្វែងរកផ្សេង ឬជ្រើសប្រភេទផ្សេង</p>
          </div>
        )}

        <div className='space-y-6'>
          {filtered.map((doc) => (
            <div key={doc.id} className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition'>
              <div className='p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between'>
                <Link href={`/documents/${doc.id}`} className='flex items-center gap-3 flex-1 hover:opacity-80 transition'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      : 'bg-gradient-to-br from-blue-400 to-purple-400 text-white'
                  }`}>
                    {(doc.user_email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-bold text-slate-900 dark:text-white'>{doc.title}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>{doc.user_email || 'Anonymous'}</p>
                  </div>
                </Link>
                <div className='text-right'>
                  <span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold'>
                    {DOC_TYPE_CATEGORIES.find(c => c.id.toString() === doc.category_id?.toString())?.name || 'Other'}
                  </span>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                    {(doc.created_at?.toDate ? doc.created_at.toDate() : new Date()).toLocaleDateString('km-KH')}
                  </p>
                </div>
              </div>

              <div className='p-4'>
                <p className='text-slate-600 dark:text-slate-300 mb-3'>{doc.description || 'មិនមានការពិពណ៌នា'}</p>
                
                {/* Additional Info Tags */}
                <div className='mb-3 flex flex-wrap gap-1'>
                  {/* Subject Badge */}
                  {doc.subject && doc.subject !== '(General)' && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      theme === 'dark'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-green-50 text-black'
                    }`}>
                      📚 {doc.subject}
                    </span>
                  )}
                  
                  {/* Difficulty Badge */}
                  {doc.difficulty && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      doc.difficulty === 'beginner'
                        ? theme === 'dark'
                          ? 'bg-yellow-900/30 text-yellow-300'
                          : 'bg-yellow-50 text-black'
                        : doc.difficulty === 'intermediate'
                        ? theme === 'dark'
                          ? 'bg-orange-900/30 text-orange-300'
                          : 'bg-orange-50 text-black'
                        : theme === 'dark'
                        ? 'bg-red-900/30 text-red-300'
                        : 'bg-red-50 text-black'
                    }`}>
                      {doc.difficulty === 'beginner' ? '🟢' : doc.difficulty === 'intermediate' ? '🟡' : '🔴'} {doc.difficulty}
                    </span>
                  )}

                  {/* Study Level Badge */}
                  {doc.study_level && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-50 text-black'
                    }`}>
                      🎓 {doc.study_level}
                    </span>
                  )}
                </div>
              </div>

              <div className='mx-4 mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                    {(doc.file_type || 'DOC').substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-semibold text-slate-900 dark:text-white text-sm'>{doc.title}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>{doc.file_type}</p>
                  </div>
                </div>
                {doc.file_url && (
                  <div className='flex gap-2'>
                    <a
                      href={doc.file_url}
                      target='_blank'
                      rel='noreferrer'
                      className='p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition'
                      title='View File'
                    >
                      <Eye size={18} />
                    </a>
                    <a
                      href={doc.file_url}
                      download
                      className='p-2 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-lg transition text-indigo-600 dark:text-indigo-400'
                      title='Download File'
                    >
                      <Download size={18} />
                    </a>
                  </div>
                )}
              </div>

              <div className='px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-sm'>
                <button
                  onClick={() => handleLike(doc.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    userLikes.includes(doc.id)
                      ? 'text-red-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={16} fill={userLikes.includes(doc.id) ? 'currentColor' : 'none'} />
                  {doc.likes_count || 0}
                </button>
                <button
                  onClick={() => {
                    if (role === 'admin') {
                      toast.warning('Admin accounts cannot comment')
                      return
                    }
                    setSelectedDocForComment(doc)
                    setCommentModalOpen(true)
                  }}
                  className='flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors'
                >
                  <MessageCircle size={16} />
                  {doc.comments_count || 0}
                </button>
                <button
                  onClick={() => handleFavorite(doc.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    userFavorites.includes(doc.id)
                      ? 'text-yellow-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-yellow-500'
                  }`}
                >
                  <Bookmark size={16} fill={userFavorites.includes(doc.id) ? 'currentColor' : 'none'} />
                  {doc.favorites_count || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        documentId={selectedDocForComment?.id || ''}
        documentTitle={selectedDocForComment?.title || ''}
        authorName={selectedDocForComment?.user_email || 'Unknown'}
        userId={userId}
        onCommentAdded={() => {
          if (selectedDocForComment?.id) {
            handleCommentAdded(selectedDocForComment.id)
          }
        }}
      />
    </div>
  )
}
