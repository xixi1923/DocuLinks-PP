
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import DocumentCard from '@/components/DocumentCard'
import { User, Mail, Calendar, FileText, Heart, MessageSquare, Edit2, Camera, Shield, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [docs, setDocs] = useState<any[]>([])
  const [stats, setStats] = useState({ uploads: 0, likes: 0, comments: 0, favorites: 0 })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
      setDisplayName(currentUser.displayName || currentUser.email?.split('@')[0] || '')

      // Get profile from Supabase
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.uid)
        .maybeSingle()
      setProfile(profileData)

      // Get user's documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false })
      setDocs(docsData || [])

      // Get stats
      const { count: uploadsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.uid)

      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.uid)

      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.uid)

      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.uid)

      setStats({
        uploads: uploadsCount || 0,
        likes: likesCount || 0,
        comments: commentsCount || 0,
        favorites: favoritesCount || 0
      })

      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleUpdateProfile = async () => {
    if (!user) return
    try {
      // Update Firebase display name
      await updateProfile(user, { displayName })
      
      // Update Supabase profile
      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.uid)

      setEditing(false)
      // Refresh user
      setUser({ ...user, displayName })
    } catch (error) {
      console.error('Failed to update profile', error)
    }
  }

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
              {profile?.role === 'admin' && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Shield size={20} className="text-white" />
                </div>
              )}
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
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>ចូលរួមនៅថ្ងៃទី {new Date(user.metadata.creationTime).toLocaleDateString('km-KH')}</span>
                    </div>
                    {profile?.role === 'admin' && (
                      <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-semibold">
                        <Shield size={14} />
                        អ្នកគ្រប់គ្រង
                      </div>
                    )}
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
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">📄 ឯកសារដែលបានផ្ទុកឡើង</h2>
          {docs.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">អ្នកមិនទាន់បានផ្ទុកឯកសារណាមួយឡើយទេ</p>
              <button
                onClick={() => router.push('/upload')}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                ⬆️ ផ្ទុកឯកសារដំបូង
              </button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {docs.map((d: any) => <DocumentCard key={d.id} doc={d} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
