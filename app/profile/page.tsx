
'use client'
import { useEffect, useState, useMemo } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged, updateProfile, signOut } from 'firebase/auth'
import DocumentCard from '@/components/DocumentCard'
import { User, Mail, Calendar, FileText, Heart, MessageSquare, Edit2, Shield, Bookmark, LogOut, Upload, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { useUserRole } from '@/contexts/UserRoleContext'
import { getUserStats, getUserDocuments, getUserFavoritedDocuments, type DocumentData } from '@/lib/firestoreHelpers'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ uploads: 0, likes: 0, comments: 0, favorites: 0 })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [userDocuments, setUserDocuments] = useState<DocumentData[]>([])
  const [favoritedDocuments, setFavoritedDocuments] = useState<DocumentData[]>([])
  const [activeTab, setActiveTab] = useState<'uploads' | 'favorites'>('uploads')
  const router = useRouter()
  const toast = useToast()
  const { role } = useUserRole()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      setDisplayName(currentUser.displayName || currentUser.email?.split('@')[0] || '')
      
      // Load real stats
      const userStats = await getUserStats(currentUser.uid)
      setStats(userStats)
      
      // Load user's documents
      const docs = await getUserDocuments(currentUser.uid)
      setUserDocuments(docs)
      
      // Load favorited documents
      const favDocs = await getUserFavoritedDocuments(currentUser.uid)
      setFavoritedDocuments(favDocs)
      
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router, toast])

  const handleUpdateProfile = async () => {
    if (!user) return
    try {
      await updateProfile(user, { displayName })
      setEditing(false)
      setUser({ ...user, displayName })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully!')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const displayedDocuments = useMemo(() => {
    return activeTab === 'uploads' ? userDocuments : favoritedDocuments
  }, [activeTab, userDocuments, favoritedDocuments])

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-lg overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border-2 border-slate-300 dark:border-slate-600 rounded-lg p-3 text-2xl font-bold dark:bg-slate-700 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      រក្សាទុក
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-6 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300"
                    >
                      បោះបង់
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="កែសម្រួលប្រវត្តិលម្អិត"
                    >
                      <Edit2 size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  {role === 'admin' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-lg">
                      <Shield size={14} />
                      Admin
                    </div>
                  )}
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>ចូលរួមនៅថ្ងៃទី {new Date(user.metadata.creationTime).toLocaleDateString('km-KH')}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <FileText size={24} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.uploads}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">ឯកសារផ្ទុកឡើង</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl">
              <Heart size={24} className="text-rose-600 dark:text-rose-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.likes}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">ចូលចិត្ត</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
              <MessageSquare size={24} className="text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.comments}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">មតិយោបល់</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl">
              <Bookmark size={24} className="text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.favorites}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">ឯកសាររក្សាទុក</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
            >
              <LogOut size={18} />
              ចាកចេញ
            </button>
          </div>
        </div>

        {/* Documents Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('uploads')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'uploads'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-lg border-2 border-indigo-200 dark:border-indigo-900'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent'
              }`}
            >
              <Upload className="inline-block w-5 h-5 mr-2" />
              ឯកសារផ្ទុកឡើង ({stats.uploads})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-lg border-2 border-amber-200 dark:border-amber-900'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent'
              }`}
            >
              <Bookmark className="inline-block w-5 h-5 mr-2" />
              ឯកសាររក្សាទុក ({stats.favorites})
            </button>
          </div>
        </div>

        {/* Documents Display */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          {displayedDocuments.length === 0 ? (
            <div className="text-center py-16">
              {activeTab === 'uploads' ? (
                <>
                  <Upload size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-4">គ្មានឯកសារដែលបានផ្ទុកឡើង</p>
                  <button
                    onClick={() => router.push('/upload')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    ផ្ទុកឯកសារឥឡូវនេះ
                  </button>
                </>
              ) : (
                <>
                  <Bookmark size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-4">គ្មានឯកសាររក្សាទុក</p>
                  <button
                    onClick={() => router.push('/explore')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    ស្វែងរកឯកសារ
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-shadow bg-slate-50 dark:bg-slate-900/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {activeTab === 'uploads' && (
                          <span
                            className={`px-3 py-1 rounded-full font-semibold ${
                              doc.status === 'approved'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : doc.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {doc.status === 'approved' ? '✓ Approved' : doc.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Heart size={16} />
                          {doc.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <MessageSquare size={16} />
                          {doc.comments_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Bookmark size={16} />
                          {doc.favorites_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock size={16} />
                          {doc.created_at.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                      >
                        ទាញយក
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

