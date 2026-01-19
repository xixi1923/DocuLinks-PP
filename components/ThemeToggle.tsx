
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(()=>setMounted(true),[])
  if (!mounted) return null
  const isDark = resolvedTheme === 'dark'
  return (
    <button 
      aria-label="Toggle dark mode" 
      onClick={()=>setTheme(isDark?'light':'dark')} 
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition duration-300"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
