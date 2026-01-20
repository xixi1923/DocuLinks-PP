'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { Globe, Sun, Moon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isHydrated])

  const handleLanguageChange = (lang: 'en' | 'km') => {
    setLanguage(lang)
    setOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle Button */}
      {isHydrated && (
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-300"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      )}

      {/* Language Switcher */}
      {isHydrated && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-300"
            title="Switch Language"
          >
            <Globe size={20} />
            <span className="text-sm font-semibold uppercase">{language}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition duration-200 flex items-center gap-2 ${
                language === 'en'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <img src="/images/english.png" alt="En Flag" className="w-5 h-5" />
              English
            </button>
            <button
              onClick={() => handleLanguageChange('km')}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition duration-200 flex items-center gap-2 ${
                language === 'km'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <img src="/images/khmerr.jpg" alt="Cambodia Flag" className="w-5 h-5" />
              ខ្មែរ (Khmer)
            </button>
          </div>
        )}
        </div>
      )}
    </div>
  )
}