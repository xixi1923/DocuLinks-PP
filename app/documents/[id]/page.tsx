
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { auth } from '@/lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { getDocumentById, getUserLikes, getUserFavorites, addLike, removeLike, addFavorite, removeFavorite, type DocumentData } from '@/lib/firestoreHelpers'
import { Download, Heart, MessageCircle, Bookmark, Clock, User, Tag, AlertCircle, ArrowLeft, Eye, ExternalLink } from 'lucide-react'
import { useTheme } from 'next-themes'
import CommentModal from '@/components/CommentModal'
import { useToast } from '@/contexts/ToastContext'
import { useUserRole } from '@/contexts/UserRoleContext'

const DOC_CATEGORIES = [
  { id: 1, name: 'Lecture' },
  { id: 2, name: 'Exam' },
  { id: 3, name: 'Assignment' },
  { id: 4, name: 'Slide' },
  { id: 5, name: 'Notes' },
  { id: 6, name: 'Other' },
]

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const docId = params.id as string
  const { theme } = useTheme()
  const toast = useToast()
  const { role } = useUserRole()

  const [doc, setDoc] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserId(user?.uid || null)

      if (user && doc) {
        const likes = await getUserLikes(user.uid)
        const favorites = await getUserFavorites(user.uid)
        setIsLiked(likes.includes(docId))
        setIsFavorited(favorites.includes(docId))
      }
    })
    return () => unsubscribe()
  }, [doc, docId])

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const docData = await getDocumentById(docId)
        if (!docData) {
          setDoc(null)
        } else {
          setDoc(docData)
        }
      } catch (error) {
        console.error('Error loading document:', error)
        setDoc(null)
      } finally {
        setLoading(false)
      }
    }
    loadDocument()
  }, [docId])

  const handleLike = async () => {
    if (role === 'admin') {
      toast.warning('Admin accounts cannot like documents')
      return
    }
    if (!userId) {
      toast.warning('Please sign in to like documents')
      return
    }

    try {
      if (isLiked) {
        await removeLike(userId, docId)
        setDoc(prev => prev ? { ...prev, likes_count: Math.max(0, (prev.likes_count || 0) - 1) } : null)
        setIsLiked(false)
      } else {
        await addLike(userId, docId)
        setDoc(prev => prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : null)
        setIsLiked(true)
        toast.success('Liked!')
      }
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleFavorite = async () => {
    if (role === 'admin') {
      toast.warning('Admin accounts cannot favorite documents')
      return
    }
    if (!userId) {
      toast.warning('Please sign in to favorite documents')
      return
    }

    try {
      if (isFavorited) {
        await removeFavorite(userId, docId)
        setDoc(prev => prev ? { ...prev, favorites_count: Math.max(0, (prev.favorites_count || 0) - 1) } : null)
        setIsFavorited(false)
      } else {
        await addFavorite(userId, docId)
        setDoc(prev => prev ? { ...prev, favorites_count: (prev.favorites_count || 0) + 1 } : null)
        setIsFavorited(true)
        toast.success('Added to favorites!')
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDownload = async () => {
    if (!doc?.file_url) {
      toast.error('File URL not available')
      return
    }

    try {
      setDownloading(true)
      const response = await fetch(doc.file_url)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.title || 'document'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download started!')
    } catch (error) {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
        </div>
      </main>
    )
  }

  if (!doc) {
    return (
      <main className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <AlertCircle className='w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Document not found</h1>
          <button
            onClick={() => router.back()}
            className='px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors'
          >
            Go back
          </button>
        </div>
      </main>
    )
  }

  const categoryName = DOC_CATEGORIES.find(c => c.id === doc.category_id)?.name || 'Other'
  const statusColor = doc.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    : doc.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'

  return (
    <main className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <button
          onClick={() => router.back()}
          className='text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-semibold mb-6 flex items-center gap-2'
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Main Content */}
        <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 mb-8'>
          {/* Title and Status */}
          <div className='mb-6'>
            <div className='flex items-start justify-between gap-4 mb-4'>
              <div className='flex-1'>
                <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-3'>{doc.title}</h1>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}>
                  {doc.status === 'approved' ? '✓ Approved' : doc.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                </span>
              </div>
              <div className='flex gap-3'>
                <a
                  href={doc.file_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
                  title='View File'
                >
                  <Eye size={20} />
                </a>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap'
                >
                  <Download size={20} />
                  {downloading ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          {doc.description && (
            <div className='mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700'>
              <p className='text-slate-700 dark:text-slate-300 text-lg leading-relaxed'>{doc.description}</p>
            </div>
          )}

          {/* File Preview */}
          {doc.file_url && (
            <div className='mb-8'>
              <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2'>
                <Eye size={20} />
                File Preview
              </h3>
              <div className='bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
                {doc.file_type?.includes('pdf') ? (
                  <iframe
                    src={doc.file_url}
                    className='w-full h-[600px]'
                    title='Document Preview'
                  />
                ) : doc.file_type?.includes('image') ? (
                  <img
                    src={doc.file_url}
                    alt={doc.title}
                    className='w-full h-auto'
                  />
                ) : (
                  <div className='p-8 text-center'>
                    <ExternalLink className='w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4' />
                    <p className='text-slate-600 dark:text-slate-400 mb-4'>
                      Preview not available for this file type
                    </p>
                    <a
                      href={doc.file_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition'
                    >
                      <ExternalLink size={18} />
                      Open in New Tab
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Info Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700'>
            <div>
              <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2'>
                <Tag size={16} />
                Category
              </h3>
              <p className='text-lg text-slate-900 dark:text-white font-semibold'>{categoryName}</p>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2'>
                <User size={16} />
                Author
              </h3>
              <p className='text-lg text-slate-900 dark:text-white font-semibold'>{doc.user_email}</p>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2'>
                <Clock size={16} />
                Uploaded
              </h3>
              <p className='text-lg text-slate-900 dark:text-white font-semibold'>
                {doc.created_at?.toDate ? doc.created_at.toDate().toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {doc.university && (
              <div>
                <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2'>University</h3>
                <p className='text-lg text-slate-900 dark:text-white font-semibold'>{doc.university}</p>
              </div>
            )}

            {doc.subject && (
              <div>
                <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2'>Subject</h3>
                <p className='text-lg text-slate-900 dark:text-white font-semibold'>{doc.subject}</p>
              </div>
            )}

            {doc.difficulty && (
              <div>
                <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2'>Difficulty</h3>
                <p className='text-lg text-slate-900 dark:text-white font-semibold capitalize'>{doc.difficulty}</p>
              </div>
            )}

            {doc.study_level && (
              <div>
                <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2'>Study Level</h3>
                <p className='text-lg text-slate-900 dark:text-white font-semibold capitalize'>{doc.study_level}</p>
              </div>
            )}

            {doc.file_type && (
              <div>
                <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2'>File Type</h3>
                <p className='text-lg text-slate-900 dark:text-white font-semibold uppercase'>{doc.file_type.split('/')[1] || doc.file_type}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className='mb-8 pb-8 border-b border-slate-200 dark:border-slate-700'>
              <h3 className='text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3'>Tags</h3>
              <div className='flex flex-wrap gap-2'>
                {doc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className='grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700'>
            <div className='text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl'>
              <div className='text-3xl font-bold text-red-600 dark:text-red-400'>{doc.likes_count || 0}</div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>Likes</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl'>
              <div className='text-3xl font-bold text-blue-600 dark:text-blue-400'>{doc.comments_count || 0}</div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>Comments</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl'>
              <div className='text-3xl font-bold text-amber-600 dark:text-amber-400'>{doc.favorites_count || 0}</div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mt-1'>Favorites</p>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-center gap-6 pt-4'>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isLiked
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={() => {
                if (role === 'admin') {
                  toast.warning('Admin accounts cannot comment')
                  return
                }
                if (!userId) {
                  toast.warning('Please sign in to comment')
                  return
                }
                setCommentModalOpen(true)
              }}
              className='flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all'
            >
              <MessageCircle size={20} />
              Comment
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isFavorited
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              }`}
            >
              <Bookmark size={20} fill={isFavorited ? 'currentColor' : 'none'} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Comment Modal */}
        {commentModalOpen && (
          <CommentModal
            document={doc}
            onClose={() => setCommentModalOpen(false)}
            onCommentAdded={() => {
              setDoc(prev => prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : null)
            }}
          />
        )}
      </div>
    </main>
  )
}
