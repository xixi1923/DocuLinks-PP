'use client'
import { Heart, Share2, User, Star, Eye, ArrowRight, BookOpen, Code, TrendingUp, Shield } from 'lucide-react'

const CATEGORIES = [
  { id: 'academics', label: 'សិក្សាធិការ', icon: BookOpen, color: 'from-purple-500 via-pink-500 to-red-500', emoji: '📚' },
  { id: 'tech', label: 'បច្ចេកវិទ្យា', icon: Code, color: 'from-cyan-500 via-blue-500 to-indigo-500', emoji: '💻' },
  { id: 'business', label: 'ធុរកិច្ច', icon: TrendingUp, color: 'from-emerald-500 via-teal-500 to-cyan-500', emoji: '💼' },
  { id: 'legal', label: 'ច្បាប់', icon: Shield, color: 'from-orange-500 via-red-500 to-pink-500', emoji: '⚖️' },
]

interface DocCardProps {
  doc: any
  onClick: () => void
  theme: string
}

export default function DocCard({ doc, onClick, theme }: DocCardProps) {
  const cat = CATEGORIES.find(c => c.id === doc.category_id) || CATEGORIES[0]

  return (
    <div
      onClick={onClick}
      className={`group relative backdrop-blur-sm border p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:scale-[1.02] overflow-hidden animate-fade-in-up ${
        theme === 'dark' ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/95 border-white/30'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick() }}
      aria-label={`View document: ${doc.title}`}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
        theme === 'dark' ? 'from-slate-700/50 to-transparent' : 'from-white/50 to-transparent'
      }`} />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 bg-gradient-to-br ${cat.color}`}>
            <span className="text-2xl">{cat.emoji}</span>
          </div>
          <div className="flex gap-3">
            <button 
              className={`p-3 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${
                theme === 'dark' ? 'bg-slate-700/80 text-slate-400 hover:text-rose-400' : 'bg-white/80 text-slate-400 hover:text-rose-500'
              }`}
              aria-label="Like document"
            >
              <Heart size={18} />
            </button>
            <button 
              className={`p-3 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 shadow-lg ${
                theme === 'dark' ? 'bg-slate-700/80 text-slate-400 hover:text-blue-400' : 'bg-white/80 text-slate-400 hover:text-indigo-600'
              }`}
              aria-label="Share document"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <h3 className={`text-2xl font-black mb-4 leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          {doc.title}
        </h3>
        <p className={`text-base font-semibold mb-6 flex items-center gap-3 ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <User size={16} />
          <span>ដោយ {doc.author || 'អ្នកចែករំលែក'}</span>
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {['សិក្សាធិការ', 'ពេញនិយម'].map((tag, index) => (
            <span
              key={tag}
              className={`px-4 py-2 text-sm font-bold uppercase rounded-full border-2 shadow-lg hover:scale-105 transition-all duration-300 animate-pulse ${
                theme === 'dark'
                  ? 'bg-slate-700/80 text-blue-300 border-slate-600'
                  : 'bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 text-purple-700 border-white/50'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className={`mt-auto pt-6 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-slate-700/50' : 'border-white/30'
        }`}>
          <div className="flex items-center gap-3 text-sm font-black">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current animate-pulse" />
              ))}
            </div>
            <span className="text-slate-700 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold">
              4.5
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-full">
            <Eye size={16} className="animate-pulse" />
            <span>{doc.reads || 0} អាន</span>
          </div>
        </div>

        {/* Hover effect indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}
