'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { BookOpen, Users, Target, Lightbulb, CheckCircle2, LayoutDashboard, Handshake, Facebook, Mail, ChevronLeft, ChevronRight, Send, Twitter, Linkedin, Instagram, MapPin, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Animation Constants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

export default function AboutPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [teamSlide, setTeamSlide] = useState(0)

  // Timeline Data from Images (updated for professionalism)
  const timeline = [
    {
      year: '2020',
      title: language === 'km' ? 'ការបង្កើតគំនិត' : 'Foundation Year',
      points: language === 'km' 
        ? ['ចាប់ផ្តើមគំនិតដោយក្រុមយុវជនតូចៗ', 'គោលបំណងដំបូង៖ ជួយសហគមន៍ក្នុងវិស័យអប់រំ និងបរិស្ថាន', 'រៀបចំការជួបជុំដំបូងជាមួយសហគមន៍ក្នុងតំបន់']
        : ['Concept initiated by a small youth group', 'Initial focus: Supporting education and environmental communities', 'Organized first community meetings locally']
    },
    {
      year: '2021',
      title: language === 'km' ? 'ការចាប់ផ្តើមសកម្មភាព' : 'Launching Activities',
      points: language === 'km'
        ? ['រៀបចំសកម្មភាពសម្អាតតំបន់សាធារណៈដំបូង', 'ចូលរួមបង្រៀនអក្សរខ្មែរ និងគណិតវិទ្យាដល់កុមារ', 'ទទួលបានការគាំទ្រពីអាជ្ញាធរ និងស្ថាប័នមូលដ្ឋាន']
        : ['Launched first public area cleaning activities', 'Participated in teaching Khmer and mathematics to children', 'Received support from local authorities and institutions']
    },
    {
      year: '2024',
      title: language === 'km' ? 'ការទទួលស្គាល់' : 'Recognition',
      points: language === 'km'
        ? ['ទទួលបានពានរង្វាន់សកម្មភាពសង្គមឆ្នើមជាតិ', 'ចំនួនស្ម័គ្រចិត្តកើនដល់ 400 នាក់', 'ការគាំទ្រពីស្ថាប័នបានកើនឡើង']
        : ['Awarded national social action excellence prize', 'Volunteer count reached 400', 'Increased institutional support']
    },
    {
      year: '2025',
      title: language === 'km' ? 'សម្រេចជោគជ័យធំ' : 'Major Achievements',
      points: language === 'km'
        ? ['ចំនួនស្ម័គ្រចិត្តកើនដល់ 3,000 នាក់', 'បង្កើតគម្រោងថ្មីសម្រាប់ការការពារបរិស្ថាន', 'មានដៃគូសហការជាច្រើនបានទាក់ទងមក']
        : ['Volunteers expanded to 3,000', 'Launched new environmental protection initiatives', 'Attracted multiple global partnerships']
    }
  ]

  const teamMembers = [
    {
      id: 1,
      name: 'Thoeun Engyi',
      khName: 'ធឿន អេងយី',
      role: 'Team Leader',
      khRole: 'ប្រធានក្រុម',
      image: '/images/engyi.jpg',
      description: 'ខ្ញុំជានិស្សិតមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP) ឆ្នាំទី ៣ ផ្នែកវិស្វកម្មបច្ចេកវិទ្យាព័ត៌មាន។',
      social: { facebook: '#', telegram: '#', email: 'engyi61200@gmail.com' }
    },
    {
      id: 2,
      name: 'Pa borasy',
      khName: ' ប៉ា បូរ៉ាស៊ី',
      role: 'Member',
      khRole: 'សមាជិក',
      image: '/images/rasy.jpg', 
      description: 'ខ្ញុំជានិស្សិតមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP) ឆ្នាំទី ៣ ផ្នែកវិស្វកម្មបច្ចេកវិទ្យាព័ត៌មាន។',
      social: { facebook: '#', telegram: '#', email: 'paborasy31@gmail.com' }
    }
  ]

  // Auto-play carousel for team members
  useEffect(() => {
    const interval = setInterval(() => {
      setTeamSlide((prev) => (prev + 1) % teamMembers.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [teamMembers.length])

  return (
    <main className={`overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900'}`}>
      
      {/* --- HERO SECTION (Vision/Mission/Goal) --- */}
      <section className={`py-20 px-6 max-w-7xl mx-auto ${theme === 'dark' ? 'bg-transparent' : ''}`}>
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-[#0066FF]'}`}>{language === 'km' ? 'អំពីយើង' : 'About Us'}</h1>
          <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-600'}`}>
            {language === 'km' 
              ? 'យើងជឿជាក់ថា សង្គមអាចក្លាយជាកន្លែងប្រសើរជាងមុន ប្រសិនបើយុវជន និងសហគមន៍ទទួលបានឱកាសអប់រំ និងការគាំទ្រសមស្រប។'
              : 'We believe society can become a better place when youth and communities receive appropriate education and support.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Vision Card */}
          <motion.div {...fadeInUp} className={`p-10 rounded-[32px] shadow-2xl border transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)] text-center hover:scale-110 hover:-translate-y-2 ${theme === 'dark' ? 'bg-blue-900/20 backdrop-blur-md border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-blue-50'}`}>
              <Lightbulb className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-blue-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>{language === 'km' ? 'ចក្ខុវិស័យ' : 'Vision'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-blue-100' : 'text-slate-500'}`}>
              {language === 'km' 
                ? 'ចង់ឃើញសង្គមដែលមានមនុស្សគ្រប់រូបមានឱកាសស្មើគ្នា ទទួលបានការអប់រំ និងជីវភាពប្រសើរ ទាំងជនបទនិងទីប្រជុំជន។'
                : 'To envision a society where everyone has equal opportunities for education and improved living standards, both in rural and urban areas.'}
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={`p-10 rounded-[32px] shadow-2xl border transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.5)] text-center hover:scale-110 hover:-translate-y-2 ${theme === 'dark' ? 'bg-emerald-900/20 backdrop-blur-md border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]' : 'bg-white border-slate-200 hover:border-emerald-300'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-green-50'}`}>
              <Users className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-green-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-emerald-300' : 'text-green-600'}`}>{language === 'km' ? 'បេសកកម្ម' : 'Mission'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-emerald-100' : 'text-slate-500'}`}>
              {language === 'km'
                ? 'ផ្តល់ឱកាសអប់រំ ការបណ្តុះបណ្តាល ដើម្បីបង្កើតកម្លាំងយុវជន និងសហគមន៍ ក្លាយជាអ្នកដឹកនាំ និងផ្លាស់ប្តូរសង្គមឲ្យកាន់តែប្រសើរ។'
                : 'To provide education and training opportunities to empower youth and communities to become leaders and agents of positive social change.'}
            </p>
          </motion.div>

          {/* Goal Card */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={`p-10 rounded-[32px] shadow-2xl border transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(244,63,94,0.5)] text-center hover:scale-110 hover:-translate-y-2 ${theme === 'dark' ? 'bg-rose-900/20 backdrop-blur-md border-rose-500/30 hover:border-rose-400 hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]' : 'bg-white border-slate-200 hover:border-rose-300'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-rose-500 to-pink-500' : 'bg-red-50'}`}>
              <Target className={`transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-red-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-rose-300' : 'text-red-600'}`}>{language === 'km' ? 'គោលដោ' : 'Goals'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-rose-100' : 'text-slate-500'}`}>
              {language === 'km'
                ? 'ជំរុញការចូលរួមសហគមន៍ អភិវឌ្ឍសេដ្ឋកិច្ច និងបរិស្ថាន ព្រមទាំងគាំទ្រដល់អ្នកដែលត្រូវការជំនួយទាំងឡាយគ្រប់ខេត្តក្រុង។'
                : 'To promote community engagement, economic development, and environmental sustainability while supporting those in need across all provinces.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-red-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-20 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-300 via-cyan-300 to-rose-300 bg-clip-text text-transparent' : 'text-slate-900'}`}>{language === 'km' ? 'ប្រវត្តិសង្ខេបរបស់យើង' : 'Our Journey'}</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-blue-500 via-cyan-500 to-rose-500' : 'bg-blue-100'}`} />

            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content Card */}
                  <motion.div 
                    {...fadeInUp}
                    className={`flex-1 p-8 rounded-3xl shadow-2xl border relative group hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 hover:-translate-y-3 ${theme === 'dark' ? 'bg-white/5 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]' : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-[0_20px_60px_-15px_rgba(6,182,212,0.5)]'}`}
                  >
                    <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-cyan-200' : 'text-slate-900'}`}>{item.title}</h3>
                    <ul className="space-y-3">
                      {item.points.map((p, i) => (
                        <li key={i} className={`flex items-start gap-3 text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-blue-100' : 'text-slate-600'}`}>
                          <CheckCircle2 className={`text-green-500 mt-1 flex-shrink-0 ${theme === 'dark' ? 'text-cyan-400' : ''}`} size={18} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Year Bubble */}
                  <div className={`z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-2xl shrink-0 animate-pulse transition-all duration-300 hover:scale-125 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 to-rose-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.8)]' : 'bg-[#00A3FF] text-white shadow-blue-400 hover:shadow-[0_0_20px_rgba(0,163,255,0.8)]'}`}>
                    {item.year}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Squares) --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent' : 'text-slate-900'}`}>{language === 'km' ? 'សម្រេចលទ្ធផល និងសមិទ្ធផល' : 'Results & Achievements'}</h2>
          <p className={`mb-12 transition-colors duration-300 ${theme === 'dark' ? 'text-purple-200' : 'text-slate-500'}`}>{language === 'km' ? 'មើលសេចក្តីសង្ខេបអំពីអ្វីដែលយើងបានសម្រេច' : 'A summary of what we have achieved together'}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: language === 'km' ? 'គ្រួសារទទួលបានសុខភាព' : 'Families Supported', count: '1000+' },
              { label: language === 'km' ? 'កុមារទទួលបានការអប់រំ' : 'Children Educated', count: '500+' },
              { label: language === 'km' ? 'យុវជនបានបណ្តុះបណ្តាល' : 'Youth Trained', count: '200+' },
              { label: language === 'km' ? 'សហគមន៍បានអភិវឌ្ឍ' : 'Communities Developed', count: '500+' }
            ].map((stat, i) => {
              const darkGradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-emerald-500 to-teal-500',
                'from-orange-500 to-rose-500'
              ]
              return (
              <motion.div key={i} whileHover={{ y: -10, scale: 1.05 }} className={`p-10 rounded-2xl shadow-2xl border transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ${theme === 'dark' ? `bg-white/5 backdrop-blur-md border-${i === 0 ? 'blue' : i === 1 ? 'purple' : i === 2 ? 'emerald' : 'orange'}-500/30 hover:border-${i === 0 ? 'blue' : i === 1 ? 'purple' : i === 2 ? 'emerald' : 'orange'}-400 hover:shadow-[0_0_40px_rgba(${i === 0 ? '59,130,246' : i === 1 ? '168,85,247' : i === 2 ? '16,185,129' : '249,115,22'},0.6)]` : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.5)]'}`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 transition-colors duration-300 ${theme === 'dark' ? `bg-gradient-to-br ${darkGradients[i]}` : 'bg-green-500'}`} />
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent' : 'text-blue-600'}`}>{stat.count}</div>
                <div className={`text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{stat.label}</div>
              </motion.div>
            )
            })}
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION (Carousel) --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-16 transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent' : 'text-slate-900'}`}>{language === 'km' ? 'ក្រុមរបស់យើង' : 'Our Team'}</h2>

          <div className="relative flex items-center justify-center gap-8">
            {/* Left Navigation Button */}
            <button 
              onClick={() => setTeamSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)}
              className={`absolute left-4 md:left-20 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <ChevronLeft size={24} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={teamMembers[teamSlide].id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`relative w-full max-w-md aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group ${theme === 'dark' ? 'shadow-[0_0_60px_rgba(59,130,246,0.4)] hover:shadow-[0_0_80px_rgba(59,130,246,0.6)]' : 'hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'} transition-all duration-500`}
              >
                {/* Member Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${teamMembers[teamSlide].image})`, backgroundColor: '#e2e8f0' }}
                />
                
                {/* Dark Overlay with Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-2">{teamMembers[teamSlide].khName}</h3>
                    <p className="text-sm opacity-90 leading-relaxed mb-6">
                      {teamMembers[teamSlide].description}
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex justify-center gap-4">
                      <a href={teamMembers[teamSlide].social.facebook} className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-all">
                        <Facebook size={20} />
                      </a>
                      <a href={teamMembers[teamSlide].social.telegram} className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-all">
                        <Send size={20} />
                      </a>
                      <a href={`mailto:${teamMembers[teamSlide].social.email}`} className="w-10 h-10 rounded-lg bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-all">
                        <Mail size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right Navigation Button */}
            <button 
              onClick={() => setTeamSlide((prev) => (prev + 1) % teamMembers.length)}
              className={`absolute right-4 md:right-20 z-20 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Name and Role Subtitle */}
          <div className="mt-12">
            <h4 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent' : 'text-blue-600'}`}>{teamMembers[teamSlide].khName}</h4>
            <div className="flex items-center justify-center gap-4">
              <div className={`h-[2px] w-12 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-blue-300'}`} />
              <p className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-slate-500'}`}>{teamMembers[teamSlide].khRole}</p>
              <div className={`h-[2px] w-12 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-blue-300'}`} />
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {teamMembers.map((_, i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${teamSlide === i ? `w-8 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-blue-500'}` : `w-2 ${theme === 'dark' ? 'bg-purple-700' : 'bg-blue-200'}`}`}
              />
            ))}
          </div>
        </div>
      </section>

     
      {/* --- PARTNERSHIP SECTION (MOU) --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className={`text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'ព័ត៌មានអំពីកិច្ចសហប្រតិបត្តិការ' : 'Partnership Information'}</h2>
              <div className="space-y-4">
                {[
                  { title: language === 'km' ? 'សហការផ្នែកបណ្តុះបណ្តាលគ្រូ' : 'Teacher Training Collaboration', partner: 'ANT Center', tag: 'Workshops' },
                  { title: language === 'km' ? 'គម្រោងបរិស្ថានជាមួយសហគមន៍' : 'Community Environmental Project', partner: 'Green Life Group', tag: 'Community Action' },
                  { title: language === 'km' ? 'MOU ជាមួយ NGO ថ្មី' : 'MOU with New NGO', partner: 'ABC Foundation', tag: 'MOU / Agreement' }
                ].map((item, i) => (
                  <div key={i} className={`flex gap-4 items-start p-4 border-l-4 border-blue-500 rounded-r-xl transition-all duration-500 hover:shadow-lg hover:scale-105 hover:-translate-y-1 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-white hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.4)]'}`}>
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <h4 className={`font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                      <p className={`text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>ជាមួយ <strong>{item.partner}</strong></p>
                      <span className={`inline-block mt-2 px-3 py-1 text-[10px] rounded-md font-bold uppercase transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-700 text-blue-100' : 'bg-blue-600 text-white'}`}>{item.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-[32px] shadow-2xl border transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:scale-105 hover:-translate-y-2 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)]'}`}>
              <h3 className={`font-bold text-xl mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'ប្រភេទសហការ' : 'Types of Partnerships'}</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}><Handshake size={20} className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} /></div>
                  <div>
                    <h5 className={`font-bold text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'កិច្ចព្រមព្រៀង (MOU)' : 'MOU'}</h5>
                    <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>កំណត់គោលដៅ សិទ្ធិ និងការទទួលខុសត្រូវ</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}><LayoutDashboard size={20} className={`${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} /></div>
                  <div>
                    <h5 className={`font-bold text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'សកម្មភាពរួម' : 'Joint Activities'}</h5>
                    <p className={`text-xs transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Workshop, Training, Hackathon...</p>
                  </div>
                </li>
              </ul>
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
                អំពី DocuLink
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                បេសកកម្មរបស់យើងគឺការមានស្មារតីចែករំលែកឯកសារជំនួយដល់និស្សិតទាំងអស់ក្នុងការសិក្សារស្រាវជ្រាវ។
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
    </main>
  )
}

