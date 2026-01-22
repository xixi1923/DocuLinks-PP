'use client'
import { ArrowRight, Search, LucideIcon } from 'lucide-react'

interface Category {
  title: string
  description: string
  count: string
  category: string
  categoryIcon: LucideIcon
  color: string
}

interface CategoriesSectionProps {
  theme: string
  categories: Category[]
}

export default function CategoriesSection({ theme, categories }: CategoriesSectionProps) {
  return (
    <section className={`py-24 px-6 transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-950 via-blue-950 to-cyan-900' : 'bg-gradient-to-br from-indigo-100 via-slate-50 to-blue-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ប្រភេទឯកសារដែលមាន
          </h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-cyan-200' : 'text-slate-600'}`}>
            ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                theme === 'dark' ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white'
              }`}
            >
              <div className={`w-full h-32 rounded-lg mb-4 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                <category.categoryIcon size={48} className="text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {category.title}
              </h3>
              <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-cyan-100' : 'text-slate-600'}`}>
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20' : 'text-indigo-600 bg-indigo-100'}`}>
                  {category.count}
                </span>
                <button className={`font-medium flex items-center gap-1 ${theme === 'dark' ? 'text-cyan-300 hover:text-cyan-200' : 'text-indigo-600 hover:text-indigo-700'}`}>
                  ស្វែងរក <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className={`px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 mx-auto ${
            theme === 'dark' ? 'bg-cyan-500 text-white hover:bg-cyan-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
            <Search size={20} />
            មើលឯកសារទាំងអស់
          </button>
        </div>
      </div>
    </section>
  )
}
