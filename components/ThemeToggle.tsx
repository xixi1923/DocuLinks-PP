
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
    <button aria-label="Toggle dark mode" onClick={()=>setTheme(isDark?'light':'dark')} className="btn btn-outline">
      {isDark ? '🌙' : '🌞'}
    </button>
  )
}
