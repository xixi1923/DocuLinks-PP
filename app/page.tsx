'use client'
import { useState, useEffect } from 'react'
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

const DocCard = ({ doc, onClick }: { doc: any, onClick: () => void }) => {
  const CATEGORIES = [
    { id: 'academics', label: 'សិក្សាធិការ', icon: BookOpen, color: 'from-purple-500 via-pink-500 to-red-500', emoji: '📚' },
    { id: 'tech', label: 'បច្ចេកវិទ្យា', icon: Code, color: 'from-cyan-500 via-blue-500 to-indigo-500', emoji: '💻' },
    { id: 'business', label: 'ធុរកិច្ច', icon: TrendingUp, color: 'from-emerald-500 via-teal-500 to-cyan-500', emoji: '💼' },
    { id: 'legal', label: 'ច្បាប់', icon: Shield, color: 'from-orange-500 via-red-500 to-pink-500', emoji: '⚖️' },
  ]
  const cat = CATEGORIES.find(c => c.id === doc.category_id) || CATEGORIES[0]
  return (
    <div
      onClick={onClick}
      className="group relative bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${cat.color} shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
            <span className="text-2xl">{cat.emoji}</span>
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 bg-white/80 backdrop-blur-sm text-slate-400 rounded-xl hover:text-rose-500 transition-all duration-300 hover:scale-110 shadow-sm">
               <Heart size={16} />
             </button>
             <button className="p-2.5 bg-white/80 backdrop-blur-sm text-slate-400 rounded-xl hover:text-indigo-600 transition-all duration-300 hover:scale-110 shadow-sm">
               <Share2 size={16} />
             </button>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
          {doc.title}
        </h3>
        <p className="text-sm font-semibold text-slate-500 mb-6 flex items-center gap-2">
          <User size={14} />
          By Author
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {['Study', 'Trending'].map(tag => (
            <span key={tag} className="px-4 py-2 bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 text-purple-700 text-xs font-black uppercase rounded-full border-2 border-white/50 shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-current animate-pulse" />
              ))}
            </div>
            <span className="text-slate-700 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4.5</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1 rounded-full">
            <Eye size={14} className="animate-pulse" />
            <span>0 Reads</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Homepage() {
  const CATEGORIES = [
    { id: 'academics', label: 'សិក្សាធិការ', icon: BookOpen, color: 'from-purple-500 via-pink-500 to-red-500', emoji: '📚' },
    { id: 'tech', label: 'បច្ចេកវិទ្យា', icon: Code, color: 'from-cyan-500 via-blue-500 to-indigo-500', emoji: '💻' },
    { id: 'business', label: 'ធុរកិច្ច', icon: TrendingUp, color: 'from-emerald-500 via-teal-500 to-cyan-500', emoji: '💼' },
    { id: 'legal', label: 'ច្បាប់', icon: Shield, color: 'from-orange-500 via-red-500 to-pink-500', emoji: '⚖️' },
  ]

  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  useEffect(() => {
    const loadDocs = async () => {
      setLoading(true)
      const { data } = await supabase.from('documents')
        .select('id,title,description,file_type,category_id,created_at')
        .order('created_at', { ascending: false })
        .limit(24)
      setDocs(data || [])
      setLoading(false)
    }
    loadDocs()
  }, [])

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => setPageLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 animate-gradient-x">
        <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-6xl lg:text-7xl font-black leading-tight mb-8 text-slate-900 animate-bounce">
            ចែករំលែកឯកសារ<br/>
            <span className="text-indigo-600 animate-pulse">ឌីជីថល</span><br/>
            សម្រាប់និស្សិត
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            វេទិកាចែករំលែកឯកសារឌីជីថលដ៏ទំនើបបំផុតសម្រាប់និស្សិតកម្ពុជា។
            ចែករំលែក រៀនសូត្រ និងរីកចម្រើនជាមួយគ្នា។
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <button className="bg-indigo-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 hover:rotate-1 flex items-center justify-center gap-3 animate-pulse">
              ផ្ទុកឯកសារឡើង
              <Upload size={20} className="animate-bounce" />
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-all duration-300 hover:scale-110 hover:-rotate-1">
              ស្វែងរកឯកសារ
            </button>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900">
              ឯកសារថ្មីៗ
            </h2>
            <p className="text-xl text-slate-600">
              ស្វែងរកឯកសារដែលត្រូវនឹងតម្រូវការសិក្សារបស់អ្នក
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-3xl shadow-lg animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-gray-300 rounded-2xl"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-xl"></div>
                      <div className="w-8 h-8 bg-gray-300 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6"></div>
                  <div className="flex gap-2 mb-8">
                    <div className="h-6 bg-gray-300 rounded-full px-4 py-2"></div>
                    <div className="h-6 bg-gray-300 rounded-full px-4 py-2"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-4 h-4 bg-gray-300 rounded"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docs.map((doc) => (
                <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2 mx-auto">
              <Search size={20} />
              មើលឯកសារទាំងអស់
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-6 bg-gray-50 animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900 animate-bounce">
              គោលបំណង និងបេសកកម្មរបស់ DocuLink
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-pulse">
              យើងជាវេទិកាឌីជីថលដែលបង្កើតឡើងដោយនិស្សិតសម្រាប់និស្សិត
              ដើម្បីផ្តល់ជូនឱកាសចែករំលែកចំណេះដឹង និងធនធានសិក្សា។
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'ចែករំលែកសម្ភារៈសិក្សា', desc: 'ចែករំលែកកិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សា' },
              { icon: Users, title: 'សហគមន៍និស្សិត', desc: 'ភ្ជាប់និស្សិតទាំងអស់គ្នាក្នុងការរៀនសូត្រ និងចែករំលែក' },
              { icon: FileText, title: 'ឯកសារឌីជីថល', desc: 'ផ្តល់ជូនឯកសារឌីជីថលដែលងាយស្រួលចូលប្រើ' },
              { icon: Search, title: 'ស្វែងរកងាយស្រួល', desc: 'ប្រព័ន្ធស្វែងរកឯកសារដ៏មានប្រសិទ្ធភាព' },
              { icon: Shield, title: 'សុវត្ថិភាព', desc: 'ការពារឯកសារនិងភាពឯកជនភាពរបស់អ្នកប្រើប្រាស់' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-2 animate-fade-in-up border border-gray-100" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6 animate-pulse">
                  <item.icon size={32} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900 animate-bounce">
              អត្ថប្រយោជន៍នៃការប្រើប្រាស់ DocuLink
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'ចែករំលែកឯកសារ',
                items: ['ផ្ទុកឯកសារឡើងដោយឥតគិតថ្លៃ', 'ចែករំលែកទៅកាន់និស្សិតផ្សេងទៀត', 'ឯកសារជាច្រើនប្រភេទ']
              },
              {
                icon: Search,
                title: 'ស្វែងរកងាយស្រួល',
                items: ['ប្រព័ន្ធស្វែងរកឆ្លាតវៃ', 'តម្រងតាមប្រភេទឯកសារ', 'រកឃើញឯកសារដែលចង់បានរហ័ស']
              },
              {
                icon: Users,
                title: 'សហគមន៍និស្សិត',
                items: ['ភ្ជាប់និស្សិតទាំងអស់គ្នា', 'ចែករំលែកចំណេះដឹង', 'រៀនសូត្រពីគ្នាទៅវិញទៅមក']
              },
              {
                icon: Shield,
                title: 'សុវត្ថិភាព',
                items: ['ការពារឯកសាររបស់អ្នក', 'ភាពឯកជនភាពខ្ពស់', 'ចូលប្រើបានពីគ្រប់ទីកន្លែង']
              },
              {
                icon: Download,
                title: 'ទាញយកដោយឥតគិតថ្លៃ',
                items: ['ទាញយកឯកសារដោយឥតគិតថ្លៃ', 'គ្មានកំណត់ចំនួន', 'រក្សាទុកក្នុងឧបករណ៍របស់អ្នក']
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 animate-fade-in-up border border-gray-100" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-6 animate-pulse">
                  <benefit.icon size={32} className="animate-bounce" />
                </div>
                <h3 className="text-xl font-bold mb-6 text-slate-900">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 animate-fade-in-up" style={{animationDelay: `${(index * 0.1) + (i * 0.05)}s`}}>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 animate-ping" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-24 px-6 bg-slate-900 text-white animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 animate-bounce">
              ផលប៉ះពាល់របស់ DocuLink
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto animate-pulse">
              តួលេខដែលនិយាយពីការប្តេជ្ញាចិត្តរបស់យើងក្នុងការចែករំលែកចំណេះដឹង
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'ឯកសារចែករំលែក', icon: FileText },
              { number: '5K+', label: 'និស្សិតសកម្ម', icon: Users },
              { number: '50+', label: 'ប្រភេទឯកសារ', icon: BookOpen },
              { number: '24/7', label: 'ការប្រើប្រាស់', icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="bg-slate-800 p-8 rounded-xl hover:scale-110 transition-all duration-500 animate-pulse border border-slate-700">
                  <stat.icon size={48} className="text-indigo-400 mx-auto mb-4 animate-bounce" />
                  <div className="text-4xl font-black mb-2 animate-pulse">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Categories Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900">
              ប្រភេទឯកសារដែលមាន
            </h2>
            <p className="text-xl text-slate-600">
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
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`w-full h-32 rounded-lg mb-4 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <category.categoryIcon size={48} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{category.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{category.description}</p>
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

      {/* Upcoming Events Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900">
              ព្រឹត្តិការណ៏មកដល់ឆាប់ៗនេះ
            </h2>
            <p className="text-xl text-slate-600">
              ព្រឹត្តិការណ៍ដ៏ពិសេស នឹងត្រូវប្រព្រឹត្តឡើងនៅពេលឆាប់ៗខាងមុខនេះ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'ការសម្អាតឆ្នេរ',
                description: 'ចូលរួមជាមួយយើងក្នុងការសម្អាតឆ្នេរ',
                location: 'ខេត្តកោះកុង',
                time: '៧:៣០ - ១១:៣០ចុះឈ្មោះឥឡូវ',
                date: '១៦តុលា',
                category: 'បរិស្ថាន',
                categoryIcon: Globe
              },
              {
                title: 'ការមើលថែទាំកុមារ',
                description: 'ចូលរួមជួយមើលថែទាំកុមារ',
                location: 'ភ្នំពេញ',
                time: '៨:००ー១២:००ចុះឈ្មោះឥឡូវ',
                date: '២១តុលា',
                category: 'អប់រំ',
                categoryIcon: BookOpen
              },
              {
                title: 'វគ្គសិក្សាបរិស្ថាន',
                description: 'រៀនអំពីការថែរក្សាបរិស្ថាន',
                location: 'ខេត្តសៀមរាប',
                time: '៩:००ー១៦:००ចុះឈ្មោះឥឡូវ',
                date: '០២វិច្ឆកា',
                category: 'បរិស្ថាន',
                categoryIcon: Globe
              },
              {
                title: 'ដាំឈើជាសហគមន៍',
                description: 'ចូលរួមដាំដើមឈើជាមួយសហគមន៍',
                location: 'ខេត្តកំពង់ធំ',
                time: '៦:៣០ - ១០:៣០ចុះឈ្មោះឥឡូវ',
                date: '០៥តុលា',
                category: 'បរិស្ថាន',
                categoryIcon: Globe
              }
            ].map((event, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {event.category}
                  </span>
                  <event.categoryIcon size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{event.title}</h3>
                <p className="text-slate-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {event.time}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">{event.date}</span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300">
                    ចុះឈ្មោះ
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">
              ផ្តល់បទពិសោធន៍ថ្មីៗ និងឱកាសក្នុងការបង្កើតទំនាក់ទំនងថ្មីៗ
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900">
              មតិយោបល់របស់និស្សិត
            </h2>
            <p className="text-xl text-slate-600">
              ស្តាប់អ្វីដែលនិស្សិតរបស់យើងនិយាយអំពីបទពិសោធន៍
              ក្នុងការប្រើប្រាស់វេទិកា DocuLink
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'លី គឹមស៊ុន',
                role: 'និស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ',
                text: 'DocuLink ជួយខ្ញុំយ៉ាងខ្លាំងក្នុងការស្វែងរកសម្ភារៈសិក្សា។ ខ្ញុំអាចចែករំលែកកិច្ចការដ្ឋានរបស់ខ្ញុំ និងទទួលបានធនធានាដ៏មានតម្លៃពីនិស្សិតផ្សេងទៀត។',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ចន្ទ មុនី',
                role: 'និស្សិតវិទ្យាសាស្ត្រធុរកិច្ច',
                text: 'វេទិកានេះធ្វើឱ្យការសិក្សារបស់ខ្ញុំកាន់តែងាយស្រួល។ ខ្ញុំអាចស្វែងរកគំរូរបាយការណ៍ និងឯកសារសិក្សាដោយឥតគិតថ្លៃ។ វាជាកន្លែងដ៏ល្អសម្រាប់និស្សិត។',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ចាន់ ចំរើន',
                role: 'និស្សិតវិទ្យាសាស្ត្របរិស្ថាន',
                text: 'ខ្ញុំបានរកឃើញសម្ភារៈសិក្សាជាច្រើនដែលពាក់ព័ន្ធនឹងជំនាញរបស់ខ្ញុំ។ ការចែករំលែកចំណេះដឹងនេះធ្វើឱ្យសហគមន៍និស្សិតកាន់តែរឹងមាំ។',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'កែវ សុជាតា',
                role: 'និស្សិតវិទ្យាសាស្ត្រសង្គម',
                text: 'DocuLink ជាវេទិកាដ៏ល្អសម្រាប់និស្សិតដែលចង់ចែករំលែកចំណេះដឹង។ ខ្ញុំបានជួបប្រទះនិស្សិតជាច្រើនដែលមានចំណាប់អារម្មណ៍ដូចគ្នា។',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'ផល សុភា',
                role: 'អ្នកស្ម័គ្រចិត្តបរិច្ចាគ',
                text: 'ការចូលរួមជាស្ម័គ្រចិត្តក្នុងវិស័យអប់រំនេះ បានផ្តល់ឱកាសដ៏អស្ចារ្យមួយឱ្យខ្ញុំ។',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden animate-pulse">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">"{testimonial.text}"</p>
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

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-slate-900 animate-bounce">
              សំណួរញឹកញាប់ (FAQ)
            </h2>
            <p className="text-xl text-slate-600 animate-pulse">
              ស្វែងរកចម្លើយសម្រាប់សំណួរដែលអ្នកប្រើប្រាស់តែងតែសួរ
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'តើ DocuLink គឺជាវេទិកាដោយឥតគិតថ្លៃទេ?',
                a: 'បាទ! DocuLink ជាវេទិកាដោយឥតគិតថ្លៃទាំងស្រុង។ អ្នកអាចផ្ទុកឯកសារឡើង ទាញយកឯកសារ និងចែករំលែកចំណេះដឹងដោយឥតគិតថ្លៃ។'
              },
              {
                q: 'តើខ្ញុំអាចផ្ទុកឯកសារប្រភេទអ្វីខ្លះ?',
                a: 'អ្នកអាចផ្ទុកឯកសារប្រភេទ PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, រូបភាព និងឯកសារផ្សេងទៀតដែលទាក់ទងនឹងការសិក្សា។'
              },
              {
                q: 'តើឯកសាររបស់ខ្ញុំមានសុវត្ថិភាពទេ?',
                a: 'បាទ! យើងយកចិត្តទុកដាក់ខ្ពស់ចំពោះសុវត្ថិភាពឯកសារ។ ឯកសារទាំងអស់ត្រូវបានធានាសុវត្ថិភាព និងភាពឯកជនភាព។'
              },
              {
                q: 'តើខ្ញុំអាចចែករំលែកឯកសាររបស់ខ្ញុំទៅកាន់និស្សិតផ្សេងទេ?',
                a: 'បាទ! វាជាគោលបំណងចម្បងរបស់វេទិការបស់យើង។ អ្នកអាចចែករំលែកឯកសាររបស់អ្នកទៅកាន់និស្សិតផ្សេងទៀតដោយងាយស្រួល។'
              },
              {
                q: 'តើមានកំណត់ចំនួនឯកសារដែលខ្ញុំអាចផ្ទុកឡើងបានទេ?',
                a: 'បច្ចុប្បន្នយើងមិនមានកំណត់ចំនួនឯកសារទេ។ អ្នកអាចផ្ទុកឯកសារចំនួនប៉ុន្មានក៏បានដែលចង់បាន។'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-102 animate-fade-in-up border-l-4 border-l-indigo-500" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-slate-900 flex items-center gap-3 animate-pulse">
                    <span className="text-indigo-600 animate-bounce"></span>
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 leading-relaxed animate-fade-in-up" style={{animationDelay: `${index * 0.1 + 0.1}s`}}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <p className="text-slate-600 mb-6">មានសំណួរទៀតទេ? <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium animate-pulse">ទាក់ទងយើងខ្ញុំ</a></p>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition-all duration-300 hover:scale-110 animate-bounce">
              ចាប់ផ្តើមថ្ងៃនេះ
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-indigo-600 text-white animate-fade-in-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6 animate-bounce">
            ក្លាយជាស្ម័គ្រចិត្តថ្ងៃនេះ!
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-pulse">
            កម្ពុជាកំពុងត្រូវការមនុស្សមានចិត្តស្ម័គ្របដូចអ្នក។
            ចូលរួមជាមួយយើងក្នុងការអភិវឌ្ឍសហគមន៍ និងផ្លាស់ប្តូរជីវិត។
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <div className="flex items-center gap-4 text-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CheckCircle size={20} className="text-green-400 animate-ping" />
              <span>ចុះឈ្មោះឥតគិតថ្លៃ</span>
            </div>
            <div className="flex items-center gap-4 text-sm animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <CheckCircle size={20} className="text-green-400 animate-ping" />
              <span>ជ្រើសរើសកម្មវិធីដែលអ្នកចូលចិត្ត</span>
            </div>
            <div className="flex items-center gap-4 text-sm animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <CheckCircle size={20} className="text-green-400 animate-ping" />
              <span>ទទួលបានវិញ្ញាបនប័ត្រ</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <button className="bg-white text-indigo-600 px-12 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:rotate-1 flex items-center gap-2 animate-pulse">
              <UserPlus size={20} className="animate-bounce" />
              ចុះឈ្មោះឥឡូវនេះ
            </button>
          </div>

          <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '1s'}}>
            <p className="text-indigo-200 mb-4 animate-pulse">អ្នកស្ម័គ្រចិត្តជាង 650+ នាក់</p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-6">
                ស្ម័គ្រចិត្ត
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                បេសកកម្មរបស់យើងគឺភ្ជាប់ស្មារតីអាណិតអាសូរជាមួយនឹងឱកាសស្ម័គ្រចិត្ត
                ដើម្បីកសាងសហគមន៍កាន់តែរឹងមាំ និងមានការចូលរួម។
              </p>
              <div className="flex gap-4">
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110">
                  <Facebook size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110">
                  <Twitter size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110">
                  <Linkedin size={20} />
                </button>
                <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110">
                  <Instagram size={20} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">តំណរភ្ជាប់រហ័ស</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">ទំព័រដើម</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ការងារស្ម័គ្រចិត្ត</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">សហគមន៍</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ព្រឹត្តិការណ៏</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">អត្ថបទ</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">បរិច្ចាក</a></li>
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
                  info@volunteer.org
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p className="text-lg">© 2026 ស្ម័គ្រចិត្ត។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
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

