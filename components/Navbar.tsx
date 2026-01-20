
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { auth } from '@/lib/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { supabase } from '@/lib/supabaseClient'
import { User, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const link = (href: string, labelKey: string) => (
    <Link href={href} className={clsx(
      'px-4 py-2 rounded-lg text-sm font-semibold transition duration-300',
      pathname === href 
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' 
        : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    )}>{t(labelKey)}</Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">docu<span className="text-brand">Link</span></Link>
        <nav className="hidden md:flex items-center gap-6">
          {link('/', 'home')}
          {link('/documents', 'explore')}
          {link('/upload', 'upload')}
          {link('/about', 'aboutUs')}
          {link('/contact', 'contactUs')}
          {user && (<AdminLink />)}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {!user ? (
            <>
              <Link href="/auth/login" className="px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-200">{t('login')}</Link>
              <Link href="/auth/signup" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition duration-300">{t('signup')}</Link>
            </>
          ) : (
            <ProfileMenu user={user} />
          )}
        </div>
      </div>
    </header>
  )
}

function ProfileMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
    setOpen(false)
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-300"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
          {user.photoURL ? (
            <img src={user.photoURL} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* User Info */}
          <div className="px-5 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{displayName}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-3">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition duration-200 text-sm font-medium"
            >
              <User size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span>{t('viewProfile')}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-5 py-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition duration-200 border-t border-slate-200 dark:border-slate-700 text-sm font-medium"
            >
              <LogOut size={18} />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminLink() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useLanguage()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setIsAdmin(false); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.uid).maybeSingle()
      setIsAdmin((profile?.role ?? 'user') === 'admin')
    })
    return () => unsubscribe()
  }, [])
  if (!isAdmin) return null
  return (
    <Link href="/admin" className={clsx(
      'px-4 py-2 rounded-lg text-sm font-semibold transition duration-300',
      pathname === '/admin'
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
        : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    )}>{t('admin')}</Link>
  )
}
