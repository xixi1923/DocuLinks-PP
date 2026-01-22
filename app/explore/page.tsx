'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, Heart, Download, Eye, FileText, Filter, SortAsc, X, Grid, List, ChevronDown, Bookmark, MessageCircle, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth } from '@/lib/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { getApprovedDocuments, getUserLikes, getUserFavorites, addLike, removeLike, addFavorite, removeFavorite } from '@/lib/firestoreHelpers'
import CommentModal from '@/components/CommentModal'
import { useToast } from '@/contexts/ToastContext'
import { useUserRole } from '@/contexts/UserRoleContext'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  category: string
  subject: string
  university: string
  fileType: string
  likes: number
  comments: number
  favorites: number
  downloads: number
  views: number
  uploadDate: string
  fileName: string
  isLiked: boolean
  isFavorited: boolean
  author?: string
  difficulty?: string
  studyLevel?: string
  file_url?: string
}

const FILE_TYPES = ['All', 'PDF', 'DOCX', 'PPT', 'XLSX', 'PNG', 'JPG']

const DOC_TYPE_CATEGORIES = [
  { id: 1, name: 'Lecture', icon: '📖' },
  { id: 2, name: 'Exam', icon: '✏️' },
  { id: 3, name: 'Assignment', icon: '🗂️' },
  { id: 4, name: 'Slide', icon: '📽️' },
  { id: 5, name: 'Notes', icon: '📝' },
  { id: 6, name: 'Other', icon: '📁' },
]

export default function ExplorePage() {
  const { theme } = useTheme()
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedUniversity, setSelectedUniversity] = useState('All')
  const [selectedFileType, setSelectedFileType] = useState('All')
  const [sortBy, setSortBy] = useState<'newest' | 'mostLiked' | 'mostDownloaded'>('newest')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedResourceForComment, setSelectedResourceForComment] = useState<Resource | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([
    { value: 'All', label: '🌐 All' },
  ])
  const [universityOptions, setUniversityOptions] = useState<string[]>(['All'])
  const [otherCategoryText, setOtherCategoryText] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const toast = useToast()
  const { role } = useUserRole()

  // Load real data from Firestore
  useEffect(() => {
    const loadResources = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUserId(user?.uid || null)

          const categoryMap = new Map<number, string>(DOC_TYPE_CATEGORIES.map(cat => [cat.id, cat.name]))
          setCategoryOptions([
            { value: 'All', label: '🌐 All' },
            ...DOC_TYPE_CATEGORIES.map(cat => ({ value: cat.name, label: `${cat.icon} ${cat.name}` })),
          ])

          // Load approved documents
          const docs = await getApprovedDocuments()

          // Get user's likes and favorites
          let userLikes: string[] = []
          let userFavorites: string[] = []
          
          if (user) {
            userLikes = await getUserLikes(user.uid)
            userFavorites = await getUserFavorites(user.uid)
          }

          // Transform data
          const transformed: Resource[] = docs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            category: categoryMap.get(Number(doc.category_id)) || 'Other',
            subject: doc.description || doc.title,
            university: doc.university || 'DocuLink User',
            fileType: getFileType(doc.file_type),
            likes: doc.likes_count || 0,
            comments: doc.comments_count || 0,
            favorites: doc.favorites_count || 0,
            downloads: 0,
            views: 0,
            uploadDate: doc.created_at?.toDate ? doc.created_at.toDate().toISOString() : new Date().toISOString(),
            fileName: doc.title,
            isLiked: userLikes.includes(doc.id),
            isFavorited: userFavorites.includes(doc.id),
            author: doc.user_email,
            difficulty: doc.difficulty,
            studyLevel: doc.study_level,
            file_url: doc.file_url,
          }))

          const uniqueUniversities = Array.from(new Set(transformed.map(t => t.university).filter(Boolean)))
          setUniversityOptions(['All', ...uniqueUniversities])

          setResources(transformed)
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error('Error loading resources:', error)
        setLoading(false)
      }
    }

    loadResources()
  }, [])

  const getFileType = (fileTypeStr: string): string => {
    if (fileTypeStr.includes('pdf')) return 'PDF'
    if (fileTypeStr.includes('word')) return 'DOCX'
    if (fileTypeStr.includes('presentation')) return 'PPT'
    if (fileTypeStr.includes('sheet')) return 'XLSX'
    return 'PDF'
  }

  // Filtering and sorting logic
  const filteredAndSortedResources = useMemo(() => {
    const trimmedOther = otherCategoryText.trim()
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All'
        ? true
        : selectedCategory === 'Other'
          ? trimmedOther.length > 0 && resource.category === 'Other'
          : resource.category === selectedCategory
      const matchesUniversity = selectedUniversity === 'All' || resource.university === selectedUniversity
      const matchesFileType = selectedFileType === 'All' || resource.fileType === selectedFileType

      return matchesSearch && matchesCategory && matchesUniversity && matchesFileType
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      } else if (sortBy === 'mostLiked') {
        return b.likes - a.likes
      } else if (sortBy === 'mostDownloaded') {
        return b.downloads - a.downloads
      }
      return 0
    })

    return filtered
  }, [resources, searchTerm, selectedCategory, selectedUniversity, selectedFileType, sortBy])

  const handleLike = async (id: string) => {
    try {
      if (role === 'admin') {
        toast.warning('Admin accounts cannot like documents')
        return
      }
      const user = auth.currentUser
      if (!user) {
        toast.warning('Please sign in to like documents')
        return
      }

      const resource = resources.find(r => r.id === id)
      if (!resource) return

      if (resource.isLiked) {
        await removeLike(user.uid, id)
      } else {
        await addLike(user.uid, id)
        toast.success('Liked!')
      }

      setResources(resources.map(r => 
        r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r
      ))
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleFavorite = async (id: string) => {
    try {
      if (role === 'admin') {
        toast.warning('Admin accounts cannot favorite documents')
        return
      }
      const user = auth.currentUser
      if (!user) {
        toast.warning('Please sign in to favorite documents')
        return
      }

      const resource = resources.find(r => r.id === id)
      if (!resource) return

      if (resource.isFavorited) {
        await removeFavorite(user.uid, id)
      } else {
        await addFavorite(user.uid, id)
        toast.success('Added to favorites!')
      }

      setResources(resources.map(r => 
        r.id === id ? { ...r, isFavorited: !r.isFavorited, favorites: r.isFavorited ? Math.max(0, (r.favorites || 0) - 1) : (r.favorites || 0) + 1 } : r
      ))
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const handleDownload = (resource: Resource) => {
    // Simulate download
    setResources(resources.map(r => 
      r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
    ))
  }

  // Unified Resource Card Component (matches screenshot design)
  const ResourceCard = ({ resource, index }: { resource: Resource; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
        theme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-slate-200'
      }`}
    >
      {/* Header with author info */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
            : 'bg-gradient-to-br from-purple-400 to-blue-400 text-white'
        }`}>
          {resource.author?.charAt(0) || '📄'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {resource.author || 'Anonymous'}
          </h3>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {resource.university}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          theme === 'dark'
            ? 'bg-purple-900/30 text-purple-400'
            : 'bg-purple-50 text-purple-600'
        }`}>
          {resource.category}
        </span>
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <Link href={`/documents/${resource.id}`}>
          <h2 className={`font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {resource.title}
          </h2>
        </Link>
        <p className={`text-sm line-clamp-2 ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {resource.subject || 'No description'}
        </p>

        {/* Level and Year chips */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {resource.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
              theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'
            }`}>
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
              {resource.difficulty}
            </span>
          )}
          {resource.studyLevel && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
              theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'
            }`}>
              🎓 {resource.studyLevel}
            </span>
          )}
        </div>
      </div>

      {/* File Info Box */}
      {resource.fileName && (
        <div className={`rounded-xl p-4 mb-4 border ${
          theme === 'dark'
            ? 'bg-slate-700/50 border-slate-600'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl flex-shrink-0`}>
              {resource.fileType === 'PDF' ? '📄' : 
               resource.fileType === 'DOCX' ? '📝' : 
               resource.fileType === 'PPT' ? '🎬' : 
               resource.fileType === 'XLSX' ? '📊' : '🖼️'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {resource.fileName}
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {resource.fileType}
              </p>
            </div>
            {resource.file_url && (
              <a
                href={resource.file_url}
                target='_blank'
                rel='noopener noreferrer'
                className={`p-1 rounded-lg text-sm font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={(e) => e.stopPropagation()}
                title='View File'
              >
                <Eye size={16} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className={`flex items-center justify-between pt-4 border-t ${
        theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLike(resource.id)}
            className={`flex items-center gap-1 text-sm font-medium transition-all ${
              resource.isLiked
                ? 'text-red-500'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-red-400'
                : 'text-slate-600 hover:text-red-600'
            }`}
          >
            <Heart size={16} fill={resource.isLiked ? 'currentColor' : 'none'} />
            {resource.likes}
          </button>
          <button
            onClick={() => {
              if (role === 'admin') {
                toast.warning('Admin accounts cannot comment')
                return
              }
              setSelectedResourceForComment(resource)
              setCommentModalOpen(true)
            }}
            className={`flex items-center gap-1 text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-blue-400'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <MessageCircle size={16} />
            {resource.comments}
          </button>
        </div>
        <button
          onClick={() => handleFavorite(resource.id)}
          className={`flex items-center gap-1 text-sm font-medium transition-all ${
            resource.isFavorited
              ? 'text-yellow-500'
              : theme === 'dark'
              ? 'text-slate-400 hover:text-yellow-400'
              : 'text-slate-600 hover:text-yellow-600'
          }`}
        >
          <Bookmark size={16} fill={resource.isFavorited ? 'currentColor' : 'none'} />
          {resource.favorites}
        </button>
      </div>
    </motion.div>
  )

  return (
    <main className={`min-h-screen pt-20 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            🔍 ស្វាគមន៍មកកាន់គង្ហារធនធាន
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            ស្វែងរកនិងស្វាលដាល់សាលលើកទឹក ឯកសារសិក្សា មេរៀន និងចំណាំ
          </p>
        </div>

        {/* Search Bar */}
        <div className={`rounded-xl p-4 mb-6 shadow-sm ${
          theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
        }`}>
          <div className="relative flex items-center">
            <Search className={`absolute left-4 ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`} size={20} />
            <input
              type="text"
              placeholder="ស្វែងរក​ដោយចំណងជើង ឬប្រធានបទ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border outline-none transition ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showFilters
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Filter size={18} />
              <span>តម្រង</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-4 py-2 rounded-lg font-medium outline-none transition ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              <option value="newest">ថ្មីបំផុត</option>
              <option value="mostLiked">ចូលចិត្តច្រើនបំផុត</option>
              <option value="mostDownloaded">ទាញយកច្រើនបំផុត</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-opacity-0">
            {/* View mode toggle removed - using vertical layout */}
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-xl p-6 mb-6 shadow-sm border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    ប្រភេទ
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const value = e.target.value
                      setSelectedCategory(value)
                      if (value !== 'Other') {
                        setCategoryError('')
                        return
                      }
                      if (!otherCategoryText.trim()) {
                        setCategoryError('សូមបញ្ចូលប្រភេទផ្សេងៗ')
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {selectedCategory === 'Other' && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        value={otherCategoryText}
                        onChange={(e) => {
                          setOtherCategoryText(e.target.value)
                          if (e.target.value.trim()) {
                            setCategoryError('')
                          }
                        }}
                        placeholder="បញ្ជាក់ប្រភេទផ្សេងៗ"
                        className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                          theme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      {categoryError && (
                        <p className="text-xs text-red-500">{categoryError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* University Filter */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    សាកលវិទ្យាល័យ
                  </label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {universityOptions.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                  </select>
                </div>

                {/* File Type Filter */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    ប្រភេទឯកសារ
                  </label>
                  <select
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {FILE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedUniversity('All')
                  setSelectedFileType('All')
                  setSearchTerm('')
                }}
                className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                សម្អាតតម្រង
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className={`mb-4 text-sm font-medium ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          រកឃើញ {filteredAndSortedResources.length} ធនធាន
        </div>

        {/* Resources Display - Vertical Card List */}
        {filteredAndSortedResources.length > 0 ? (
          <div className='space-y-4 max-w-2xl mx-auto'>
            <AnimatePresence>
              {filteredAndSortedResources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <p className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              គ្មានលទ្ធផលដែលត្រូវគ្នា
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
            }`}>
              សូមព្យាយាមផ្លាស់ប្តូរលក្ខខណ្ឌស្វែងរក ឬតម្រង
            </p>
          </motion.div>
        )}
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        documentId={selectedResourceForComment?.id || ''}
        documentTitle={selectedResourceForComment?.title || 'Resource'}
        authorName={selectedResourceForComment?.author || 'Unknown'}
        userId={userId}
        onCommentAdded={() => {
          const id = selectedResourceForComment?.id
          if (!id) return
          setResources(prev => prev.map(r => r.id === id ? { ...r, comments: (r.comments || 0) + 1 } : r))
        }}
      />
    </main>
  )
}
