'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import {
  FileText, Upload, Search, Shield, Zap,
  Menu, ChevronRight, Globe, Layers, Shapes,
  ArrowRight, Star, Clock, Download, Share2,
  Filter, X, Plus, ExternalLink, Bookmark,
  Github, Twitter, Linkedin, Facebook, Sparkles,
  Users, BookOpen, Award, Heart, CheckCircle,
  Calendar, MapPin, User, MessageSquare, Flame,
  Rocket, Zap as ZapIcon, TrendingUp, Eye,
  ThumbsUp, MessageCircle, Send, Hash, Crown,
  Diamond, Gem, Palette, Music, Camera, Coffee,
  Sun, Moon, Cloud, Rainbow,
  IceCream, Pizza, Gamepad2, Headphones, Smartphone,
  Laptop, Code, Brush, PenTool, Scissors, Wand2,
  UserPlus, Instagram, Phone, Mail
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import OnboardingCheck from '@/components/OnboardingCheck'
import OnboardingModal from '@/components/OnboardingModal'

// Constants for categories to avoid repetition
const CATEGORIES = [
  { id: 'academics', label: 'សិក្សាធិការ', icon: BookOpen, color: 'from-purple-500 via-pink-500 to-red-500', emoji: '📚' },
  { id: 'tech', label: 'បច្ចេកវិទ្យា', icon: Code, color: 'from-cyan-500 via-blue-500 to-indigo-500', emoji: '💻' },
  { id: 'business', label: 'ធុរកិច្ច', icon: TrendingUp, color: 'from-emerald-500 via-teal-500 to-cyan-500', emoji: '💼' },
  { id: 'legal', label: 'ច្បាប់', icon: Shield, color: 'from-orange-500 via-red-500 to-pink-500', emoji: '⚖️' },
]

// DocCard component extracted for better modularity
const DocCard = ({ doc, onClick, t, theme }: { doc: any, onClick: () => void, t: any, theme: string }) => {
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

export default function Homepage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const resolvedTheme = theme || 'light'

  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Sample Khmer documents for display
  const sampleDocs = [
    {
      id: 'sample-1',
      title: 'ឯកសារថ្មីៗ - គណិតវិទ្យាគ្រឹះ',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'pdf',
      category_id: 'academics',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    },
    {
      id: 'sample-2',
      title: 'ឯកសារថ្មីៗ - ប្រលេឌីកូដ JavaScript',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'pdf',
      category_id: 'tech',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    },
    {
      id: 'sample-3',
      title: 'ឯកសារថ្មីៗ - ដោះលែងអាជីវកម្ម',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'docx',
      category_id: 'business',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    },
    {
      id: 'sample-4',
      title: 'ឯកសារថ្មីៗ - ច្បាប់ប៉ាឡាម៉ែត្រ',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'pdf',
      category_id: 'legal',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    },
    {
      id: 'sample-5',
      title: 'ឯកសារថ្មីៗ - រូបវិទ្យាទូទៅ',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'pdf',
      category_id: 'academics',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    },
    {
      id: 'sample-6',
      title: 'ឯកសារថ្មីៗ - ការលម្អិតលម្អិត AI',
      description: 'ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក',
      file_type: 'pptx',
      category_id: 'tech',
      created_at: new Date().toISOString(),
      author: 'អ្នកចែករំលែក',
      reads: 0
    }
  ]

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('documents')
          .select('id,title,description,file_type,category_id,created_at,author,reads')
          .order('created_at', { ascending: false })
          .limit(24)
        if (error) throw error
        setDocs(data && data.length > 0 ? data : sampleDocs)
      } catch (error) {
        console.error('Error loading documents:', error)
        setDocs(sampleDocs)
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900'}`}>
      <OnboardingCheck onShowOnboarding={() => setShowOnboarding(true)} />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      {/* Hero Section */}
      <section className={`relative py-24 px-6 overflow-hidden transition-all duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="hero-blob-1 animate-float" />
          <div className="hero-blob-2 animate-float" style={{ animationDelay: '2s' }} />
          <div className="hero-blob-3 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full font-bold text-sm shadow-lg animate-fade-in-up">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>វេទិកាចែករំលែកឯកសារសិក្សាដ៏ល្អបំផុត</span>
              </div>

              <h1 className={`text-5xl lg:text-7xl font-black leading-tight animate-fade-in-left ${theme === 'dark' ? 'text-white' : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent'}`}>
                រកឃើញ & <br />
                <span className="text-indigo-600 animate-gradient-x">ចែករំលែក</span><br />
                ចំណេះដឹង
              </h1>

              <p className={`text-xl leading-relaxed max-w-xl animate-fade-in-left animate-delay-200 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                ចូលរួមជាមួយសហគមន៍និស្សិតជាង 650 នាក់ក្នុងការចែករំលែកឯកសារសិក្សា និងធនធានអប់រំដ៏មានតម្លៃ។
              </p>

              <div className="flex flex-wrap gap-8 animate-fade-in-left animate-delay-300">
                <div className="text-center">
                  <div className="text-3xl font-black text-indigo-600">650+</div>
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>សមាជិកសកម្ម</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600">1200+</div>
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ឯកសារចែករំលែក</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600">50+</div>
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>សាកលវិទ្យាល័យ</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-fade-in-left animate-delay-400">
                <Link
                  href="/documents"
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
                >
                  <Search className="w-6 h-6" />
                  <span>រុករកឯកសារ</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/upload"
                  className={`group px-8 py-4 border-2 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-lg ${
                    theme === 'dark'
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                      : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <Upload className="w-6 h-6" />
                  <span>ចែករំលែកឯកសារ</span>
                </Link>
              </div>

              <div className="flex items-center gap-6 animate-fade-in-left animate-delay-500">
                <div className="flex -space-x-2">
                  {['👨‍🎓', '👩‍🎓', '👨‍💼', '👩‍💻'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center text-lg shadow-md">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>ទទួលបានការជឿទុក</strong> ពីនិស្សិតជាច្រើន
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">DocuLink</h3>
                      <p className="text-sm text-slate-500">វេទិកាចែករំលែកឯកសារ</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                  </div>
                </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="ស្វែងរកឯកសារសិក្សា..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors bg-slate-50"
                  />
                  <Search className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { title: 'គណិតវិទ្យា', icon: '📐', color: 'bg-blue-100 text-blue-600' },
                    { title: 'រូបវិទ្យា', icon: '⚗️', color: 'bg-green-100 text-green-600' },
                    { title: 'ប្រវត្តិវិទ្យា', icon: '📜', color: 'bg-orange-100 text-orange-600' },
                    { title: 'ភាសាអង់គ្លេស', icon: '🇺🇸', color: 'bg-purple-100 text-purple-600' }
                  ].map((subject, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center text-lg mb-3`}>
                        {subject.icon}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{subject.title}</h4>
                      <p className="text-xs text-slate-500">25+ ឯកសារ</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">ឯកសារថ្មីៗ</h4>
                  {[
                    { title: 'កិច្ចការគណិតវិទ្យា ២០២៤', type: 'PDF', size: '2.1 MB' },
                    { title: 'សៀវភៅរូបវិទ្យា', type: 'DOC', size: '5.8 MB' }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900 text-sm">{doc.title}</h5>
                        <p className="text-xs text-slate-500">{doc.type} • {doc.size}</p>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl animate-bounce flex items-center justify-center text-white font-bold text-lg">
                📚
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-xl animate-pulse flex items-center justify-center text-white font-bold text-lg">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section className={`py-32 px-6 bg-white relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-96 h-96 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden shadow-2xl border-8 border-white/50 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <img
                    src="/images/about-documents.jpg"
                    alt="Students collaborating with documents"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl animate-bounce flex items-center justify-center text-white font-bold text-xl">
                    📚
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-xl animate-pulse flex items-center justify-center text-white font-bold text-2xl">
                    🎓
                  </div>
                  <div className="absolute top-1/4 -left-8 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-xl animate-float flex items-center justify-center text-white font-bold text-lg">
                    ⭐
                  </div>
                  <div className="absolute bottom-1/4 -right-8 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-xl animate-float flex items-center justify-center text-white font-bold text-lg" style={{ animationDelay: '1s' }}>
                    📖
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm">
                <Award className="w-4 h-4" />
                <span>គោលបំណងរបស់យើង</span>
              </div>

              <div>
                <h2 className={`text-4xl lg:text-5xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  វេទិកាឌីជីថលសម្រាប់<br />
                  <span className="text-indigo-600">និស្សិតដោយនិស្សិត</span>
                </h2>
                <p className={`text-xl text-slate-600 leading-relaxed max-w-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  យើងបង្កើត DocuLink ឡើងដើម្បីផ្តល់ជូនឱកាសដល់និស្សិតទូទាំងប្រទេសក្នុងការចែករំលែកចំណេះដឹង និងធនធានសិក្សា។
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: BookOpen,
                    title: 'ចែករំលែកសម្ភារៈសិក្សា',
                    desc: 'កិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សាពីសាកលវិទ្យាល័យជាច្រើន',
                    color: 'from-blue-500 to-indigo-500'
                  },
                  {
                    icon: Users,
                    title: 'សហគមន៍រឹងមាំ',
                    desc: 'ភ្ជាប់និស្សិតក្នុងការរៀន និងចែករំលែកចំណេះដឹង',
                    color: 'from-emerald-500 to-teal-500'
                  },
                  {
                    icon: FileText,
                    title: 'ឯកសារឌីជីថល',
                    desc: 'ផ្តល់ឯកសារដែលងាយស្រួលចូលប្រើ និងទាញយក',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: Shield,
                    title: 'សុវត្ថិភាព & ភាពឯកជន',
                    desc: 'ការពារឯកសាររបស់អ្នកជាមួយបច្ចេកវិទ្យាសុវត្ថិភាពខ្ពស់',
                    color: 'from-orange-500 to-red-500'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100/50 animate-fade-in-up ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700/50' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={24} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors ${theme === 'dark' ? 'text-white' : ''}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-slate-600 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : ''}`}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>ស្វែងយល់បន្ថែម</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className={`py-32 px-6 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : ''}`}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full font-bold text-sm mb-6 animate-fade-in-up">
              <FileText className="w-5 h-5" />
              <span>ឯកសារសិក្សាដ៏មានតម្លៃ</span>
            </div>
            <h2 className={`text-4xl lg:text-6xl font-black mb-6 text-slate-900 animate-fade-in-up ${theme === 'dark' ? 'text-white' : ''}`}>
              រកឃើញឯកសារសិក្សា<br />
              <span className="text-indigo-600">ពីសហគមន៍របស់យើង</span>
            </h2>
            <p className={`text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100 ${theme === 'dark' ? 'text-slate-300' : ''}`}>
              រុករកបណ្ណសារជាច្រើនដែលបានចែករំលែកដោយនិស្សិតពីសាកលវិទ្យាល័យផ្សេងៗ រួមមានកិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សាដ៏មានតម្លៃ។
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`bg-white/80 backdrop-blur-sm border border-white/20 p-8 rounded-3xl shadow-xl animate-pulse ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700/50' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                      <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-8"></div>
                  <div className="flex gap-3 mb-8">
                    <div className="h-8 bg-gray-300 rounded-full px-4 py-2"></div>
                    <div className="h-8 bg-gray-300 rounded-full px-4 py-2"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-5 h-5 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docs.map((doc) => (
                <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} t={t} theme={resolvedTheme} />
              ))}
            </div>
          )}

          <div className="text-center mt-16 animate-fade-in-up animate-delay-300">
            <Link
              href="/documents"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <Search className="w-6 h-6" />
              <span>មើលឯកសារទាំងអស់</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-24 px-6 bg-white transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-6 py-2 rounded-full font-bold mb-6">
              <span>📖</span>
              <span>សំណួរញឹកញាប់</span>
            </div>
            <h2 className={`text-4xl font-black mb-4 text-slate-900 ${theme === 'dark' ? 'text-white' : ''}`}>សំណួរញឹកញាប់ (FAQ)</h2>
            <p className={`text-lg text-slate-600 max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-300' : ''}`}>សូមស្វាគមន៍ទៅកាន់ផ្នែកសួលសម្ងាក់របស់យើង សូមស្វែងយល់ពីព័ត៌មានលម្អិត</p>
          </div>

          <div className="space-y-4">
            {[
              { 
                q: 'តើ DocuLinks ជាវេទិកាឥតគិតថ្លៃឬ?', 
                a: 'បាទ! DocuLinks ជាវេទិកាឥតគិតថ្លៃទាំងស្រុង។ អ្នកអាចផ្ទុកឯកសារ ទាញយកឯកសារ និងចែករំលែកចំណេះដឹងបានឥតគិតថ្លៃ។'
              },
              { 
                q: 'តើខ្ញុំអាចផ្ទុកឯកសារប្រភេទណាដែលលើប្រព័ន្ធ?', 
                a: 'អ្នកអាចផ្ទុក PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, រូបភាព និងឯកសារផ្សេងទៀតដែលទាក់ទងនឹងការសិក្សា។'
              },
              { 
                q: 'តើឯកសាររបស់ខ្ញុំមានសុវត្ថិភាពឬ?', 
                a: 'បាទ! យើងយកសុវត្ថិភាពឯកសារយ៉ាងធ្ងន់ធ្ងរ។ ឯកសារទាំងអស់របស់អ្នកត្រូវបានការពារក្នុងលក្ខណៈសុវត្ថិភាព និងឯកជនភាព។'
              },
              { 
                q: 'តើខ្ញុំអាចចែករំលែកឯកសាររបស់ខ្ញុំទៅនឹងនិស្សិតផ្សេងទៀតបានឬ?', 
                a: 'បាទ! នោះជាគោលបំណងសំខាន់របស់វេទិកាយើង។ អ្នកអាចចែករំលែកឯកសា្ររបស់អ្នកទៅកាន់និស្សិតផ្សេងទៀតបានយ៉ាងងាយស្រួល។'
              }
            ].map((item, idx) => {
              const open = openFaq === idx
              return (
                <div key={idx} className={`faq-card bg-slate-50 rounded-2xl border-2 transition-all duration-300 ${open ? 'border-slate-400 shadow-lg' : 'border-slate-200 hover:border-slate-300'} ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <button 
                    onClick={() => setOpenFaq(open ? null : idx)} 
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={open}
                    aria-controls={`faq-${idx}`}
                  >
                    <h3 className={`text-lg font-bold text-slate-900 flex-1 ${theme === 'dark' ? 'text-white' : ''}`}>{item.q}</h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${open ? 'bg-cyan-500 text-white' : 'bg-cyan-400 text-white'}`}>
                      {open ? <X size={20} /> : <Plus size={20} />}
                    </div>
                  </button>

                  <div 
                    id={`faq-${idx}`}
                    className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="px-6 pb-6 border-t border-slate-200 pt-6">
                      <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className={`text-slate-600 mb-4 ${theme === 'dark' ? 'text-slate-300' : ''}`}>មិនឃើញសម្ងាក់ដែលលោកអ្នកកំពុងស្វែងរក?</p>
            <button className="inline-flex items-center gap-2 bg-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              <MessageCircle size={18} />
              <span>ទាក់ទងយើងឥឡូវនេះ</span>
            </button>
          </div>
        </div>
      </section>

      {/* Document Categories Section */}
      <section className={`py-24 px-6 bg-gray-50 transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-black mb-6 text-slate-900 ${theme === 'dark' ? 'text-white' : ''}`}>
              ប្រភេទឯកសារដែលមាន
            </h2>
            <p className={`text-xl text-slate-600 ${theme === 'dark' ? 'text-slate-300' : ''}`}>
              ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'សម្ភារៈសិក្សាសាកលវិទ្យាល័យ',
                description: 'កិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សាពីសាកលវិទ្យាល័យជាច្រើន',
                count: '៣០០០+ ឯកសារ',
                category: 'សិក្សាធិការ',
                categoryIcon: BookOpen,
                color: 'from-purple-500 via-pink-500 to-red-500'
              },
              {
                title: 'ធនធានបច្ចេកវិទ្យា',
                description: 'កូដ កម្មវិធី និងឯកសារបច្ចេកទេសសម្រាប់អ្នកសិក្សាទេស',
                count: '១៥០០+ ឯកសារ',
                category: 'បច្ចេកវិទ្យា',
                categoryIcon: Code,
                color: 'from-cyan-500 via-blue-500 to-indigo-500'
              },
              {
                title: 'ឯកសារធុរកិច្ច',
                description: 'គំរូឯកសារ របាយការណ៍ និងធនធានាធុរកិច្ច',
                count: '៨០០+ ឯកសារ',
                category: 'ធុរកិច្ច',
                categoryIcon: TrendingUp,
                color: 'from-emerald-500 via-teal-500 to-cyan-500'
              }
            ].map((category, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : ''}`}>
                <div className={`w-full h-32 rounded-lg mb-4 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.categoryIcon size={48} className="text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 text-slate-900 ${theme === 'dark' ? 'text-white' : ''}`}>{category.title}</h3>
                <p className={`text-slate-600 mb-4 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : ''}`}>{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    ស្វែងរក <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2 mx-auto">
              <Search size={20} />
              មើលឯកសារទាំងអស់
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 px-6 bg-gray-50 transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-black mb-6 text-slate-900 ${theme === 'dark' ? 'text-white' : ''}`}>
              មតិយោបល់របស់និស្សិត
            </h2>
            <p className={`text-xl text-slate-600 ${theme === 'dark' ? 'text-slate-300' : ''}`}>
              ស្តាប់អ្វីដែលនិស្សិតរបស់យើងនិយាយអំពីបទពិសោធន៍
              ក្នុងការប្រើប្រាស់វេទិកា DocuLink
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'សុខ សុភា',
                role: 'និស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ',
                text: 'DocuLink ជួយខ្ញុំយ៉ាងខ្លាំងក្នុងការស្វែងរកសម្ភារៈសិក្សា។ ខ្ញុំអាចចែករំលែកកិច្ចការដ្ឋានរបស់ខ្ញុំ និងទទួលបានធនធានាដ៏មានតម្លៃពីនិស្សិតផ្សេងទៀត។',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'លី វិច្ឆិកា',
                role: 'និស្សិតវិទ្យាសាស្ត្រធុរកិច្ច',
                text: 'វេទិកានេះធ្វើឱ្យការសិក្សារបស់ខ្ញុំកាន់តែងាយស្រួល។ ខ្ញុំអាចស្វែងរកគំរូរបាយការណ៍ និងឯកសារសិក្សាដោយឥតគិតថ្លៃ។ វាជាកន្លែងដ៏ល្អសម្រាប់និស្សិត។',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ជា សុវណ្ណរ៉ា',
                role: 'និស្សិតវិទ្យាសាស្ត្របរិស្ថាន',
                text: 'ខ្ញុំបានរកឃើញសម្ភារៈសិក្សាជាច្រើនដែលពាក់ព័ន្ធនឹងជំនាញរបស់ខ្ញុំ។ ការចែករំលែកចំណេះដឹងនេះធ្វើឱ្យសហគមន៍និស្សិតកាន់តែរឹងមាំ។',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ណូ វិជ្ជា',
                role: 'និស្សិតវិទ្យាសាស្ត្រសង្គម',
                text: 'DocuLink ជាវេទិកាដ៏ល្អសម្រាប់និស្សិតដែលចង់ចែករំលែកចំណេះដឹង។ ខ្ញុំបានជួបប្រទះនិស្សិតជាច្រើនដែលមានចំណាប់អារម្មណ៍ដូចគ្នា។',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ហុង សុភាព',
                role: 'អ្នកស្ម័គ្រចិត្តបរិច្ចាគ',
                text: 'ការចូលរួមជាស្ម័គ្រចិត្តក្នុងវិស័យអប់រំនេះ បានផ្តល់ឱកាសដ៏អស្ចារ្យមួយឱ្យខ្ញុំ។',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
              }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up border border-gray-100 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden animate-pulse">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold text-slate-900 ${theme === 'dark' ? 'text-white' : ''}`}>{testimonial.name}</h4>
                    <p className={`text-sm text-slate-600 ${theme === 'dark' ? 'text-slate-300' : ''}`}>{testimonial.role}</p>
                  </div>
                </div>
                <p className={`text-slate-600 leading-relaxed mb-6 ${theme === 'dark' ? 'text-slate-300' : ''}`}>"{testimonial.text}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-8">
                <Star size={18} className="text-yellow-300 fill-yellow-300" />
                <span className="text-white font-bold text-sm">⭐ ចូលរួមឥឡូវនេះ</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                តោះ! <span className="text-yellow-300">ចូលរួម</span><br />ជាមួយយើង
              </h2>

              <p className="text-white/95 text-lg leading-relaxed mb-10">
                ការចែករំលែកឯកសារ និងចំណេះដឹងធ្វើឱ្យសហគមន៍និស្សិតកាន់តែរឹងមាំ។ ដោយផ្តល់ជូនឯកសាររបស់អ្នក អ្នកក្លាយជាផ្នែកមួយនៃចលនាអប់រំដ៏អស្ចារ្យមួយ ដែលផ្តល់ឱកាសដល់និស្សិតទូទាំងប្រទេស។
              </p>

              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">បង្រួមឯកសារបង្រៀនរបស់អ្នក</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">ចូលរួមនឹងសហគមន៍ 650+ នាក់</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">ជួយសិស្សក្នុងការរៀន និងស្រាវជ្រាវ</span>
                </div>
              </div>

              <Link 
                href="/upload" 
                className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:bg-yellow-300"
              >
                <Upload size={24} />
                <span>បង្រួមឯកសារឥឡូវនេះ</span>
                <ArrowRight size={24} />
              </Link>
            </div>

            <div className="relative h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/30 to-pink-200/30 rounded-full blur-3xl transform translate-y-12" />
              <div className="relative h-full mx-auto max-w-xs">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[50px] p-3 shadow-2xl">
                  <div className="w-full h-full bg-slate-900 rounded-[45px] p-2 flex flex-col overflow-hidden">
                    <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-white text-xs font-semibold">
                      <span>1:32 PM</span>
                      <div className="flex gap-1">
                        <span>📶</span>
                        <span>📡</span>
                        <span>🔋</span>
                      </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-b from-blue-50 to-purple-50 rounded-[40px] overflow-hidden flex flex-col p-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            👥
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-base">650+</p>
                            <p className="text-xs text-slate-500 font-medium">អ្នកប្រើប្រាស់សកម្ម</p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white">
                            🔔
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-100 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition-transform">
                          📚
                        </div>
                        <h3 className="font-black text-slate-900 text-center text-lg">
                          ឯកសារថ្មីៗ
                        </h3>
                        <p className="text-xs text-slate-500 text-center leading-relaxed max-w-xs">
                          ឯកសារសិក្សា ឯកសារគ្រូបង្រៀន និងឯកសារស្រាវជ្រាវដ៏វិស័យ
                        </p>
                        <button className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-2xl hover:shadow-lg transition-all">
                          មើលលម្អិត
                        </button>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-semibold">ឯកសារ</p>
                          <p className="font-bold text-slate-900 text-lg">1200+</p>
                        </div>
                        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-semibold">ចូលចិត្ត</p>
                          <p className="font-bold text-slate-900 text-lg">125+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 left-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/50 flex items-center gap-3 z-10">
                  <div className="flex -space-x-2">
                    {['👨', '👩', '👦'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-sm">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-900 font-bold">+650</span>
                </div>

                <div className="absolute -bottom-10 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/50 flex items-center gap-2 z-10">
                  <Heart size={20} className="text-red-500 fill-red-500" />
                  <span className="text-slate-900 font-bold">125+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-slate-900 text-white py-16 px-6 ${theme === 'dark' ? 'bg-slate-950' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-6">
                អំពី DocuLink
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                បេសកកម្មរបស់យើងគឺការមានស្មារតីចែករំលែកឯកសារជំនួយដល់និស្សិតទាំងអស់ក្នុងការសិក្សារស្រាវជ្រាវ។
              </p>
              <div className="flex gap-4">
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Facebook">
                  <Facebook size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Twitter">
                  <Twitter size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Instagram">
                  <Instagram size={20} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">តំណរភ្ជាប់រហ័ស</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">ទំព័រដើម</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">រុករកឯកសារ</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">សហគមន៍</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ព្រឹត្តិការណ៏</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">អត្ថបទ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">ព័ត៌មាន</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">អំពីរយើង</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ទំនាក់ទំនង</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">គោលការណ៍ឯកជន</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">លក្ខខណ្ឌប្រើប្រាស់</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ជំនួយ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">ទំនាក់ទំនង</h4>
              <div className="text-slate-400 space-y-3">
                <p className="flex items-center gap-3">
                  <MapPin size={16} />
                  ផ្ទះលេខ: XXXX, ផ្លូវ YYYY, ភ្នំពេញ
                </p>
                <p className="flex items-center gap-3">
                  <Phone size={16} />
                  (855) 12 345 678
                </p>
                <p className="flex items-center gap-3">
                  <Mail size={16} />
                  doculink@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p className="text-lg">© 2026 Doculink។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedDoc(null)} />
          <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/30">
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-2xl text-sm font-bold w-fit mb-8">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  Category
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-6 text-slate-900">{selectedDoc.title}</h2>
                <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">
                  នេះគឺជាឯកសារសំខាន់ដែលត្រូវបានត្រួតពិនិត្យដោយក្រុមបច្ចេកទេស។ អ្នកអាចទាញយក ឬអានដោយសេរីតាមរយៈវេទិកានេះ។
                </p>
                <div className="flex flex-wrap gap-8">
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400 uppercase leading-none mb-1">Reads</div>
                      <div className="font-black text-xl">0</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl shadow-sm">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-500">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-400 uppercase leading-none mb-1">Rating</div>
                      <div className="font-black text-xl">4.5</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-96 p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-center items-center gap-6">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-pulse">
                  <FileText size={56} />
                </div>
                <button className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                  <ExternalLink size={22} /> អានឯកសារ
                </button>
                <button className="w-full py-6 bg-white border-2 border-indigo-200 text-indigo-700 rounded-2xl font-black text-lg hover:bg-indigo-50 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                  <Download size={22} /> ទាញយក PDF
                </button>
                <button onClick={() => setSelectedDoc(null)} className="mt-4 text-slate-500 hover:text-slate-700 font-bold transition-colors duration-300">
                  បិទវិញ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}