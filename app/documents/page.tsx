'use client'

import { useState } from 'react'
import { FileText, Heart, MessageCircle, Share2, Bookmark, Download, Eye, Search, X } from 'lucide-react'

// Mock data
const MOCK_POSTS = [
  {
    id: '1',
    title: 'ដើម្បីសិក្សាវិទ្យាសាស្ត្របាន់តិច្ចក្នុងក្ដ្ឋាន',
    description: 'សម្ភារៈសិក្សាលម្អិតលម្អិតអំពីផ្នែកមូលដ្ឋាននៃវិទ្យាសាស្ត្របាន់តិច្ចក្នុងក្ដ្ឋាន',
    file_type: 'PDF',
    file_name: 'computer_science_basics.pdf',
    created_at: new Date().toISOString(),
    views: 245,
    likes: 32,
    comments: 8,
    category_id: 1,
    category_name: 'សិក្សាធិការ',
    subject: 'វិទ្យាសាស្ត្រ',
    tags: 'programming,coding,education',
    user: { id: 'user1', name: 'សុខ សាម៉ុន', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1' }
  },
  {
    id: '2',
    title: 'គាត់មេរៀនវិជ្ជមាន - ធុរកិច្ច',
    description: 'ម៉ាស៊ីនបង្រៀនមូលដ្ឋាននិងគោលលទ្ធិលម្អិត។ សម្ភារៈនេះមានប្រយោជន៍ក្នុងការរៀនសូត្រ',
    file_type: 'DOCX',
    file_name: 'business_fundamentals.docx',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    views: 156,
    likes: 21,
    comments: 5,
    category_id: 2,
    category_name: 'ធុរកិច្ច',
    subject: 'ការគ្រប់គ្រង',
    tags: 'business,management,strategy',
    user: { id: 'user2', name: 'កញ្ញា មេដូច', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2' }
  },
  {
    id: '3',
    title: 'ច្បាប់ស្នើសុំលក្ខណ៍',
    description: 'ឯកសារស្នើសុំលក្ខណ៍ទូលំទូលាយ សម្រាប់ការងារផ្សេងៗ',
    file_type: 'PDF',
    file_name: 'legal_documents.pdf',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    views: 89,
    likes: 15,
    comments: 3,
    category_id: 3,
    category_name: 'ច្បាប់',
    subject: 'ច្បាប់',
    tags: 'legal,law,documents',
    user: { id: 'user3', name: 'ល្អ ធម', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3' }
  },
  {
    id: '4',
    title: 'ការរៀនដោយទំនាក់ទំនង',
    description: 'វិធីសាស្ត្រ និងលក្ខណៈពិសេសក្នុងការរៀនសូត្រ។ បទឧទ្ទរណ៍ និងលទ្ធផល',
    file_type: 'PPT',
    file_name: 'interactive_learning.pptx',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    views: 423,
    likes: 67,
    comments: 12,
    category_id: 1,
    category_name: 'សិក្សាធិការ',
    subject: 'ការបង្រៀន',
    tags: 'education,learning,interactive',
    user: { id: 'user4', name: 'ចាន់ វិក្រម', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4' }
  },
  {
    id: '5',
    title: 'គម្រោងសម្រាប់អនាគត',
    description: 'ផែនការនិងលក្ខណៈពិសេសក្នុងការរៀបចំគម្រោងផ្សេងៗ',
    file_type: 'XLSX',
    file_name: 'future_projects.xlsx',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    views: 178,
    likes: 42,
    comments: 7,
    category_id: 2,
    category_name: 'ធុរកិច្ច',
    subject: 'ផែនការ',
    tags: 'projects,planning,business',
    user: { id: 'user5', name: 'ផល ឆាយ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5' }
  },
  {
    id: '6',
    title: 'បច្ចេកវិទ្យាដ៏ទំនើប',
    description: 'សូត្របច្ចេកវិទ្យាបង្អស់ក្នុងលោកនេះ។ AI, Machine Learning, Cloud Computing',
    file_type: 'PDF',
    file_name: 'modern_technology.pdf',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    views: 567,
    likes: 94,
    comments: 18,
    category_id: 1,
    category_name: 'សិក្សាធិការ',
    subject: 'បច្ចេកវិទ្យា',
    tags: 'technology,ai,cloud',
    user: { id: 'user6', name: 'សូ ឡាប', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6' }
  },
]

const MOCK_CATEGORIES = [
  { id: '1', name: 'សិក្សាធិការ' },
  { id: '2', name: 'ធុរកិច្ច' },
  { id: '3', name: 'ច្បាប់' },
]

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedComments, setExpandedComments] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [commentText, setCommentText] = useState('')
  const [newCommentPost, setNewCommentPost] = useState<string | null>(null)

  // Filter logic
  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || post.category_id.toString() === selectedCategory

    return matchesSearch && matchesCategory
  })

  const addComment = (postId: string) => {
    if (!commentText.trim()) return
    
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      user: 'អ្នកប្រើប្រាស់',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-current',
      timestamp: new Date().toISOString()
    }

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }))

    setCommentText('')
    setNewCommentPost(null)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-12'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-2'>📚 ឯកសារ និង ធនធាន</h1>
          <p className='text-slate-600 dark:text-slate-400'>ចែករំលែក ស្វែងរក និងរៀនសូត្រពីឯកសាររបស់អ្នកផ្សេងទៀត</p>
        </div>

        {/* Search and Filter Bar */}
        <div className='sticky top-16 z-40 mb-6 space-y-3 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-950 pb-4'>
          {/* Search */}
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='ស្វងរក​ឯកសារ ប្រធានបទ ឬលក្ខណៈ...'
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

          {/* Category Filter */}
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
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {filteredPosts.length > 0 && (
          <p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>
            ស្វែងរកឃើញ <strong>{filteredPosts.length}</strong> ឯកសារ
          </p>
        )}

        {/* Posts Feed */}
        <div className='space-y-6'>
          {filteredPosts.length === 0 ? (
            <div className='text-center py-16'>
              <FileText className='w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50' />
              <p className='text-slate-600 dark:text-slate-400 text-lg font-medium'>មិនឃើញឯកសារ</p>
              <p className='text-slate-500 dark:text-slate-500 text-sm mt-2'>សូមព្យាយាមស្វែងរកដែលខុសគ្នា ឬ ជ្រើសរើសប្រភេទផ្សេង</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition'>
                
                {/* Post Header */}
                <div className='p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between'>
                  <div className='flex items-center gap-3 flex-1'>
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name}
                      className='w-12 h-12 rounded-full'
                    />
                    <div className='flex-1'>
                      <p className='font-bold text-slate-900 dark:text-white'>{post.user.name}</p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>
                        {new Date(post.created_at).toLocaleDateString('km-KH')}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold'>
                      {post.category_name}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className='p-4'>
                  <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>{post.title}</h2>
                  <p className='text-slate-600 dark:text-slate-300 mb-3'>{post.description}</p>
                  
                  {/* Tags */}
                  {post.tags && (
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {post.tags.split(',').map(tag => (
                        <span key={tag} className='text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full'>
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* File Preview */}
                <div className='mx-4 mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                      {post.file_type.substring(0, 3)}
                    </div>
                    <div>
                      <p className='font-semibold text-slate-900 dark:text-white text-sm'>{post.file_name}</p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>{post.file_type}</p>
                    </div>
                  </div>
                  <button className='p-2 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-lg transition text-indigo-600 dark:text-indigo-400'>
                    <Download size={20} />
                  </button>
                </div>

                {/* Engagement Stats */}
                <div className='px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400'>
                  <span className='flex items-center gap-1'>
                    <Heart size={16} /> {post.likes}
                  </span>
                  <span className='flex items-center gap-1'>
                    <MessageCircle size={16} /> {post.comments + (comments[post.id]?.length || 0)}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Eye size={16} /> {post.views}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className='px-4 py-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-2'>
                  <button className='flex items-center justify-center gap-1 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 font-semibold text-sm'>
                    <Heart size={18} />
                    ចូលចិត្ត
                  </button>
                  <button 
                    onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                    className='flex items-center justify-center gap-1 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 font-semibold text-sm'>
                    <MessageCircle size={18} />
                    យោបល់
                  </button>
                  <button className='flex items-center justify-center gap-1 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 font-semibold text-sm'>
                    <Bookmark size={18} />
                    រក្សាទុក
                  </button>
                  <button className='flex items-center justify-center gap-1 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition text-slate-600 dark:text-slate-300 hover:text-green-500 dark:hover:text-green-400 font-semibold text-sm'>
                    <Share2 size={18} />
                    ចែក
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments === post.id && (
                  <div className='border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50'>
                    {/* Existing Comments */}
                    {comments[post.id] && comments[post.id].length > 0 && (
                      <div className='space-y-3 mb-4 max-h-64 overflow-y-auto'>
                        {comments[post.id].map(comment => (
                          <div key={comment.id} className='flex gap-3'>
                            <img src={comment.avatar} alt={comment.user} className='w-8 h-8 rounded-full' />
                            <div className='flex-1'>
                              <p className='font-semibold text-sm text-slate-900 dark:text-white'>{comment.user}</p>
                              <p className='text-sm text-slate-600 dark:text-slate-400'>{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Comment Input */}
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={newCommentPost === post.id ? commentText : ''}
                        onChange={(e) => {
                          setNewCommentPost(post.id)
                          setCommentText(e.target.value)
                        }}
                        onFocus={() => setNewCommentPost(post.id)}
                        placeholder='ប្រឹក្សាយោបល់...'
                        className='flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm'
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition'
                      >
                        ផ្ញើ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
