
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub?.subscription.unsubscribe()
  }, [])

  const link = (href: string, label: string) => (
    <Link href={href} className={clsx(
      'px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition',
      pathname === href ? 'text-brand' : 'text-slate-700 dark:text-slate-300'
    )}>{label}</Link>
  )

  return (
    <header className="header">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-white">docu<span className="text-brand">Link</span></Link>
        <nav className="hidden md:flex items-center gap-1">
          {link('/', 'Home')}
          {link('/upload', 'Upload')}
          {link('/favorites', 'Favorites')}
          {link('/profile', 'Profile')}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Link href="/auth/login" className="px-3 py-2 text-slate-700 dark:text-slate-300">Log in</Link>
              <Link href="/auth/signup" className="btn btn-primary">Sign up</Link>
            </>
          ) : (
            <button onClick={()=>supabase.auth.signOut()} className="btn btn-outline">Sign out</button>
          )}
        </div>
      </div>
    </header>
  )
}
