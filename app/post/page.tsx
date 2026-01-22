'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Heart, MessageCircle, Bookmark, Share2, Upload, FileText, Image as ImageIcon, Link as LinkIcon, X, Send, Type, Layers, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { getApprovedDocuments, getUserLikes, getUserFavorites, addLike, removeLike, addFavorite, removeFavorite, ensureCategoryExists } from '@/lib/firestoreHelpers'
import CommentModal from '@/components/CommentModal'
import { useUserRole } from '@/contexts/UserRoleContext'
import { useToast } from '@/contexts/ToastContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import Link from 'next/link'

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16)
  })
}

// Helper functions
const formatTime = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString()
}

const mapFileTypeToResourceType = (fileType: string): Post['resourceType'] => {
  if (fileType.includes('pdf') || fileType.includes('word') || fileType.includes('document')) return 'document'
  if (fileType.includes('presentation') || fileType.includes('ppt')) return 'lecture'
  if (fileType.includes('sheet') || fileType.includes('excel')) return 'practice'
  return 'document'
}

const getFileIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return '📄'
  if (fileType.includes('word')) return '📝'
  if (fileType.includes('presentation')) return '🎓'
  if (fileType.includes('sheet')) return '📊'
  return '📎'
}

interface Post {
  id: string
  author: {
    name: string
    avatar?: string
    university: string
  }
  content: string
  category: string
  resourceType: 'document' | 'note' | 'lecture' | 'practice' | 'exam'
  attachments?: {
    type: 'document' | 'image' | 'link'
    name: string
    url?: string
    thumbnail?: string
  }[]
  likes: number
  comments: number
  favorites: number
  isLiked: boolean
  isFavorited: boolean
  timestamp: string
  subject?: string
  difficulty?: string
  studyLevel?: string
  tags?: string[]
}

export default function PostPage() {
  const { theme } = useTheme()
  const { role } = useUserRole()
  const toast = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedPostForComment, setSelectedPostForComment] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [university, setUniversity] = useState('')
  const [level, setLevel] = useState('intermediate')
  const [tags, setTags] = useState('')
  const [studyLevel, setStudyLevel] = useState('year1')
  const [otherCategoryText, setOtherCategoryText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [msgType, setMsgType] = useState<'success' | 'error'>('error')
  const [cats, setCats] = useState<{id:number,name:string}[]>([])
  
  const resourceTypes = [
    { id: 'all', name: 'ទាំងអស់', icon: '📚' },
    { id: 'document', name: 'ឯកសារសិក្សា', icon: '📄' },
    { id: 'note', name: 'ចំណាំ', icon: '📝' },
    { id: 'lecture', name: 'មេរៀន', icon: '🎓' },
    { id: 'practice', name: 'លំហាត់', icon: '✏️' },
    { id: 'exam', name: 'ប្រឡង', icon: '📋' }
  ]

  const docTypeCategories = [
    { id: 1, name: 'Lecture' },
    { id: 2, name: 'Exam' },
    { id: 3, name: 'Assignment' },
    { id: 4, name: 'Slide' },
    { id: 5, name: 'Notes' },
    { id: 6, name: 'Other' },
  ]
  
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all')

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryMap = new Map<number, string>(docTypeCategories.map(cat => [cat.id, cat.name]))
        setCats(docTypeCategories)

        // Get current user
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUserId(user?.uid || null)
          
          if (user) {
            // Load approved documents
            const docsData = await getApprovedDocuments()
            console.log('Loaded documents from Firestore:', docsData.length, docsData)
            
            // Get likes and favorites for current user
            const userLikes = await getUserLikes(user.uid)
            const userFavorites = await getUserFavorites(user.uid)

            // Transform to Post format
            const transformedPosts: Post[] = docsData.map((doc) => ({
              id: doc.id,
              author: {
                name: doc.user_email || 'Unknown',
                university: doc.university || 'DocuLink User'
              },
              content: doc.description || doc.title,
              category: categoryMap.get(Number(doc.category_id)) || 'General',
              resourceType: mapFileTypeToResourceType(doc.file_type),
              attachments: [{
                type: 'document',
                name: doc.title,
                thumbnail: getFileIcon(doc.file_type)
              }],
              likes: doc.likes_count || 0,
              comments: doc.comments_count || 0,
              favorites: doc.favorites_count || 0,
              isLiked: userLikes.includes(doc.id),
              isFavorited: userFavorites.includes(doc.id),
              timestamp: doc.created_at?.toDate ? formatTime(doc.created_at.toDate().toISOString()) : '',
              subject: doc.subject,
              difficulty: doc.difficulty,
              studyLevel: doc.study_level,
              tags: doc.tags || []
            }))

            setPosts(transformedPosts)
          } else {
            // No user, load documents without like/favorite status
            const docsData = await getApprovedDocuments()
            console.log('Loaded documents (no user):', docsData.length, docsData)
            const transformedPosts: Post[] = docsData.map((doc) => ({
              id: doc.id,
              author: {
                name: doc.user_email || 'Unknown',
                university: doc.university || 'DocuLink User'
              },
              content: doc.description || doc.title,
              category: categoryMap.get(Number(doc.category_id)) || 'General',
              resourceType: mapFileTypeToResourceType(doc.file_type),
              attachments: [{
                type: 'document',
                name: doc.title,
                thumbnail: getFileIcon(doc.file_type)
              }],
              likes: doc.likes_count || 0,
              comments: doc.comments_count || 0,
              favorites: doc.favorites_count || 0,
              isLiked: false,
              isFavorited: false,
              timestamp: doc.created_at?.toDate ? formatTime(doc.created_at.toDate().toISOString()) : '',
              subject: doc.subject,
              difficulty: doc.difficulty,
              studyLevel: doc.study_level,
              tags: doc.tags || []
            }))

            setPosts(transformedPosts)
          }
        })

        setLoading(false)
        return () => unsubscribe()
      } catch (error) {
        console.error('Error loading posts:', error)
        setPosts([])
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      if (role === 'admin') {
        toast.warning('Admin accounts cannot like posts')
        return
      }
      const user = auth.currentUser
      if (!user) {
        setMsg('Please login to like posts')
        setMsgType('error')
        return
      }

      const post = posts.find(p => p.id === postId)
      if (!post) return

      if (post.isLiked) {
        // Remove like
        await removeLike(user.uid, postId)
      } else {
        // Add like
        await addLike(user.uid, postId)
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleFavorite = async (postId: string) => {
    try {
      if (role === 'admin') {
        toast.warning('Admin accounts cannot favorite posts')
        return
      }
      const user = auth.currentUser
      if (!user) {
        setMsg('Please login to save posts')
        setMsgType('error')
        return
      }

      const post = posts.find(p => p.id === postId)
      if (!post) return

      if (post.isFavorited) {
        // Remove favorite
        await removeFavorite(user.uid, postId)
      } else {
        // Add favorite
        await addFavorite(user.uid, postId)
      }

      // Update local state with favorites count
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, isFavorited: !p.isFavorited, favorites: p.isFavorited ? Math.max(0, (p.favorites || 0) - 1) : (p.favorites || 0) + 1 }
          : p
      ))
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleCommentAdded = (postId: string) => {
    // Increment comment count for the post
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments: p.comments + 1 }
        : p
    ))
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    
    if (!file || !title || !categoryId || !university.trim()) { 
      setMsgType('error')
      setMsg('សូមបំពេញចំណងជើង ប្រភេទ សាកលវិទ្យាល័យ និងលើកឯកសារឡើង។')
      return 
    }

    if (categoryId === 0) {
      setMsgType('error')
      setMsg('សូមជ្រើសរើសប្រភេទផ្សេងៗ')
      return
    }

    if (categoryId === 6 && !otherCategoryText.trim()) {
      setMsgType('error')
      setMsg('សូមបញ្ចូលប្រភេទនៅក្នុង Other')
      return
    }
    
    setUploading(true)

    const user = auth.currentUser
    if (!user) { 
      setMsgType('error')
      setMsg('សូមចូលប្រើគណនីដំបូង។')
      setUploading(false)
      return 
    }

    try {
      // Upload file to R2 first via the API endpoint
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description.trim() || '')
      formData.append('userId', user.uid)
      formData.append('userEmail', user.email || user.uid)
      formData.append('category', categoryId.toString())
      formData.append('university', university.trim())

      const uploadResponse = await fetch(
        process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || '/api/upload',
        { method: 'POST', body: formData }
      )
      const uploadData = await uploadResponse.json()
      if (!uploadData.publicUrl) throw new Error('File upload failed')

      // Derive category name for storage and ensure it exists in categories collection
      const selectedCategoryName = categoryId === 6
        ? otherCategoryText.trim()
        : (docTypeCategories.find(c => c.id === categoryId)?.name || 'Unknown');
      await ensureCategoryExists(selectedCategoryName, user.uid)

      // Update the document created by API with additional metadata
      const docRef = doc(db, 'documents', uploadData.documentId)
      await updateDoc(docRef, {
        subject: subject.trim() || '(General)',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        difficulty: level,
        study_level: studyLevel,
        is_public: isPublic,
        ...(categoryId === 6 && otherCategoryText.trim() ? { other_category_name: otherCategoryText.trim() } : {})
      })

      setMsgType('success')
      setMsg('☑ ឯកសារបានលើកឡើងដោយជោគជ័យ។ វានឹងលេចឡើងបន្ទាប់ពីការត្រួតពិនិត្យរបស់ក្រុមគ្រប់គ្រង។')
      setUploading(false)
      
      // Reset form
      setTitle('')
      setDescription('')
      setFile(null)
      setCategoryId(null)
      setOtherCategoryText('')
      setTags('')
      setSubject('')
      setStudyLevel('year1')
      setUniversity('')
      setLevel('intermediate')
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowCreateModal(false)
        setMsg(null)
      }, 2000)
    } catch (error) {
      setMsgType('error')
      setMsg(error instanceof Error ? error.message : 'Error uploading file')
      setUploading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFile(null)
    setCategoryId(null)
    setTags('')
    setSubject('')
    setUniversity('')
    setLevel('intermediate')
    setMsg(null)
  }


  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory
    const resourceMatch = selectedResourceType === 'all' || post.resourceType === selectedResourceType
    return categoryMatch && resourceMatch
  })
  
  // Group posts by resource type
  const groupedPosts = resourceTypes.reduce((acc, type) => {
    if (type.id === 'all') return acc
    acc[type.id] = posts.filter(post => {
      const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory
      return post.resourceType === type.id && categoryMatch
    })
    return acc
  }, {} as Record<string, Post[]>)

  // Unified PostCard Component for horizontal scroll
  const PostCard = ({ post, index }: { post: Post; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex-shrink-0 flex flex-col ${
        theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      }`}
      style={{ width: '360px' }}
    >
      {/* Header with author info */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
            : 'bg-gradient-to-br from-purple-400 to-blue-400 text-white'
        }`}>
          {post.author.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {post.author.name}
          </h3>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {post.author.university}
          </p>
        </div>
      </div>

      {/* Category badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          theme === 'dark'
            ? 'bg-purple-900/30 text-purple-400'
            : 'bg-purple-50 text-purple-600'
        }`}>
          {post.category}
        </span>
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <Link href={`/documents/${post.id}`}>
          <h2 className={`font-bold text-base mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {post.content}
          </h2>
        </Link>
      </div>

      {/* File Info Box */}
      {post.attachments && post.attachments.length > 0 && (
        <div className={`rounded-xl p-3 mb-4 border flex items-center gap-3 ${
          theme === 'dark'
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className='text-2xl flex-shrink-0'>
            {post.attachments[0].thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {post.attachments[0].name}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              PDF
            </p>
          </div>
        </div>
      )}


      {/* Stats Footer */}
      <div className={`flex items-center justify-between pt-3 mt-auto border-t ${
        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLike(post.id)}
            className={`flex items-center gap-1 text-xs font-medium transition-all ${
              post.isLiked
                ? 'text-red-500'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-red-400'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            <Heart size={14} fill={post.isLiked ? 'currentColor' : 'none'} />
            {post.likes}
          </button>
          <button
            onClick={() => {
              if (role === 'admin') {
                toast.warning('Admin accounts cannot comment')
                return
              }
              setSelectedPostForComment(post)
              setCommentModalOpen(true)
            }}
            className={`flex items-center gap-1 text-xs font-medium transition-all ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-blue-400'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <MessageCircle size={14} />
            <span className="text-xs">{post.comments}</span>
          </button>
        </div>
        <button
          onClick={() => handleFavorite(post.id)}
          className={`flex items-center gap-1 text-xs font-medium transition-all ${
            post.isFavorited
              ? 'text-yellow-500'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-yellow-400'
              : 'text-slate-600 hover:text-yellow-600'
          }`}
        >
          <Bookmark size={14} fill={post.isFavorited ? 'currentColor' : 'none'} />
          <span className="text-xs">{post.favorites || 0}</span>
        </button>
      </div>
    </motion.div>
  )

  return (
    <main className={`min-h-screen pt-20 pb-16 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-900' 
        : 'bg-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Create Post Card - Facebook Style */}
        <div className={`rounded-xl p-4 mb-4 shadow-sm ${
          theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                : 'bg-gradient-to-br from-blue-400 to-purple-400 text-white'
            }`}>
              អ
            </div>
              <button
                onClick={() => {
                  if (role === 'admin') {
                    toast.warning('Admin accounts cannot create posts')
                    return
                  }
                  setShowCreateModal(true)
                }}
              className={`flex-1 px-4 py-2.5 rounded-full text-left transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              អ្វីដែលអ្នកចង់ចែករំលែក?
            </button>
          </div>
          <div className={`flex items-center justify-around pt-3 border-t ${
            theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
          }`}>
              <button
                onClick={() => {
                  if (role === 'admin') {
                    toast.warning('Admin accounts cannot create posts')
                    return
                  }
                  setShowCreateModal(true)
                }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors ${
                theme === 'dark' ? 'text-blue-400 hover:bg-blue-400' : 'text-blue-600 hover:bg-blue-600'
              }`}
            >
              <FileText size={20} />
              <span className="font-semibold text-sm">ឯកសារ</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors ${
                theme === 'dark' ? 'text-green-400 hover:bg-green-400' : 'text-green-600 hover:bg-green-600'
              }`}
            >
              <ImageIcon size={20} />
              <span className="font-semibold text-sm">រូបភាព</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors ${
                theme === 'dark' ? 'text-orange-400 hover:bg-orange-400' : 'text-orange-600 hover:bg-orange-600'
              }`}
            >
              <LinkIcon size={20} />
              <span className="font-semibold text-sm">តំណ</span>
            </button>
          </div>
        </div>

        {/* Resource Type Filter - Improved with better styling */}
        <div className={`rounded-2xl p-5 mb-6 shadow-md transition-all border ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800 to-slate-750 border-slate-700 hover:shadow-lg' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-slate-200 hover:shadow-lg'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
            <span className="text-lg">📚</span>
            ប្រភេទធនធាន
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {resourceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedResourceType(type.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                  selectedResourceType === type.id
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : theme === 'dark'
                    ? 'bg-slate-700/70 text-slate-200 hover:bg-slate-600 backdrop-blur-sm'
                    : 'bg-white/80 text-slate-700 hover:bg-slate-50 backdrop-blur-sm border border-slate-200/50'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts by Resource Type - Vertical Scrollable Sections */}
        {loading ? (
          <div className={`rounded-xl p-8 text-center ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
          }`}>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              កំពុងទាញយក...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={`rounded-xl p-8 text-center ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
          }`}>
            <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              មិនមានឯកសារឱ្យបង្ហាញ</p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              សូមលើកឯកសារដែលបានឯ្ចុកឱ្យដឹង</p>
          </div>
        ) : selectedResourceType === 'all' ? (
          <div className="space-y-6">
            {resourceTypes.filter(type => type.id !== 'all').map((type) => {
              const typePosts = groupedPosts[type.id] || []
              if (typePosts.length === 0) return null
              
              return (
                <div key={type.id} className="mb-6">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="text-2xl">{type.icon}</span>
                      {type.name}
                      <span className={`text-sm font-normal ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        ({typePosts.length})
                      </span>
                    </h2>
                  </div>
                  
                  {/* Horizontal Scroll Container */}
                  <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                      {typePosts.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Show filtered posts in grid when specific resource type selected
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-6 animate-pulse shadow-sm ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/5 mb-2"></div>
                        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                <AnimatePresence>
                  {filteredPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Create Post Modal - Comprehensive Form */}
        <AnimatePresence>
          {showCreateModal && role !== 'admin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-3xl rounded-2xl shadow-2xl my-8 ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                }`}
              >
                {/* Modal Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${
                  theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    បង្កើតការចែករំលែក
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    <X size={24} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleCreatePost} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Success/Error Message */}
                  {msg && (
                    <div className={`p-4 rounded-lg border ${msgType === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'}`}>
                      {msg}
                    </div>
                  )}

                  {/* Basic Info Section */}
                  <div className={`rounded-xl p-5 border ${
                    theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <Type className='w-5 h-5 text-blue-600' />
                      ព័ត៌មាននៃឯកសារ
                    </h3>
                    <div className='space-y-4'>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          ចំណងជើង *
                        </label>
                        <input 
                          type='text' 
                          value={title}
                          onChange={(e)=> setTitle(e.target.value)} 
                          placeholder='ឧ. គណិតវិទ្យា - អនុគមន៍ក្នុងមួយផ្នែក'
                          maxLength={120}
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                        <p className='text-xs text-slate-500 mt-1'>{title.length}/120</p>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          ការពិពណ៌នា
                        </label>
                        <textarea 
                          value={description}
                          onChange={(e)=> setDescription(e.target.value)}
                          placeholder='ពិពណ៌នាលម្អិតអំពីឯកសាររបស់អ្នក...'
                          rows={4}
                          maxLength={500}
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition resize-none ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                        <p className='text-xs text-slate-500 mt-1'>{description.length}/500</p>
                      </div>
                    </div>
                  </div>

                  {/* Category & Classification Section */}
                  <div className={`rounded-xl p-5 border ${
                    theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <Layers className='w-5 h-5 text-purple-600' />
                      ការចាត់ថ្នាក់ប្រកាស
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          ប្រភេទ *
                        </label>
                        <select 
                          value={categoryId?.toString() || ''}
                          onChange={(e)=> setCategoryId(e.target.value ? Number(e.target.value) : null)}
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value=''>-- ជ្រើសរើស --</option>
                          {cats.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                        </select>
                        {categoryId === 6 && (
                          <div className='mt-3 space-y-1'>
                            <label className={`block text-sm font-medium ${
                              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              បញ្ជាក់ប្រភេទផ្សេងៗ
                            </label>
                            <input
                              type='text'
                              value={otherCategoryText}
                              onChange={(e)=> setOtherCategoryText(e.target.value)}
                              placeholder='ឧ. Research Proposal, Thesis Outline'
                              className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                                theme === 'dark'
                                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                              }`}
                            />
                            <p className='text-xs text-slate-500'>ចាំបាច់បំពេញនៅពេលជ្រើស Other</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          សាកលវិទ្យាល័យ *
                        </label>
                        <input
                          type='text'
                          value={university}
                          onChange={(e)=> setUniversity(e.target.value)}
                          placeholder='ឧ. Royal University of Phnom Penh'
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          កម្រិតសិក្សា
                        </label>
                        <select 
                          value={studyLevel}
                          onChange={(e)=> setStudyLevel(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value='year1'>Year 1</option>
                          <option value='year2'>Year 2</option>
                          <option value='year3'>Year 3</option>
                          <option value='year4'>Year 4</option>
                          <option value='master'>Master</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          កម្រិតលំបាក
                        </label>
                        <select 
                          value={level}
                          onChange={(e)=> setLevel(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value='beginner'>ចាប់ផ្តើម</option>
                          <option value='intermediate'>មធ្យម</option>
                          <option value='advanced'>កម្រិតខ្ពស់</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          ប្រធានបទ
                        </label>
                        <input 
                          type='text' 
                          value={subject}
                          onChange={(e)=> setSubject(e.target.value)}
                          placeholder='ឧ. គណិតវិទ្យា, វិទ្យាសាស្ត្រ, ប្រវត្តិសាស្ត្រ'
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          ស្លាក/ពាក្យគន្លឹះ
                        </label>
                        <input 
                          type='text' 
                          value={tags}
                          onChange={(e)=> setTags(e.target.value)}
                          placeholder='អក្សរបំបែកដោយលេខក្បៀស...'
                          className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
                            theme === 'dark'
                              ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                          }`}
                        />
                        <p className='text-xs text-slate-500 mt-1'>បញ្ចូលដោយក្បៀស (ឧ. java, oop, networking)</p>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className={`rounded-xl p-5 border ${
                    theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <FileText className='w-5 h-5 text-indigo-600' />
                      លើកឯកសារ *
                    </h3>
                    
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                        theme === 'dark'
                          ? 'border-slate-600 hover:border-blue-500 bg-slate-800/50'
                          : 'border-slate-300 hover:border-blue-400 bg-white'
                      }`}
                      onClick={()=> document.getElementById('file-input-modal')?.click()}
                    >
                      <Upload className={`w-12 h-12 mx-auto mb-3 ${
                        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                      }`} />
                      <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        ចុចដើម្បីលើកឯកសារ
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        ឬដាក់រមូលដ្ឋានលើ PDF, DOC, PPT, PNG, JPG
                      </p>
                      {file && (
                        <p className='text-sm text-green-600 dark:text-green-400 mt-2 font-medium'>
                          ✓ {file.name}
                        </p>
                      )}
                    </div>
                    <input 
                      id='file-input-modal'
                      type='file' 
                      onChange={(e)=> setFile(e.target.files?.[0] || null)}
                      accept='.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg'
                      className='hidden'
                    />
                  </div>

                  {/* Privacy Section */}
                  <div className={`rounded-xl p-5 border ${
                    theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      <Lock className='w-5 h-5 text-orange-600' />
                      ឯកជនភាព
                    </h3>
                    <label className='flex items-center gap-3 cursor-pointer'>
                      <input 
                        type='checkbox'
                        checked={isPublic}
                        onChange={(e)=> setIsPublic(e.target.checked)}
                        className='w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 cursor-pointer'
                      />
                      <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                        ធ្វើឱ្យសាធារណៈ - អ្នកប្រើប្រាស់ដទៃទៀតក្នុងបណ្តាញអាចឃើញនិងទាញយកឯកសារនេះ
                      </span>
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className='flex gap-3 pt-2'>
                    <button 
                      type='submit'
                      disabled={uploading}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                        uploading 
                          ? 'bg-slate-400 dark:bg-slate-600 text-white cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {uploading ? '⏳ កំពុងលើក...' : '✓ ចែករំលែក'}
                    </button>
                    <button 
                      type='button'
                      onClick={resetForm}
                      disabled={uploading}
                      className={`py-3 px-6 rounded-lg font-semibold transition ${
                        uploading
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark'
                          ? 'text-slate-300 border border-slate-600 hover:bg-slate-700'
                          : 'text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      សម្អាត
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        documentId={selectedPostForComment?.id || ''}
        documentTitle={selectedPostForComment?.content?.substring(0, 50) || 'Post'}
        authorName={selectedPostForComment?.author?.name || 'Unknown'}
        userId={userId}
        onCommentAdded={() => handleCommentAdded(selectedPostForComment?.id)}
      />
    </main>
  )
}
