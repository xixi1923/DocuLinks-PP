'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
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

  // Timeline Data from Images
  const timeline = [
    {
      year: '2020',
      title: language === 'km' ? 'ឆ្នាំបង្កើត (Foundation Year)' : 'Foundation Year',
      points: language === 'km' 
        ? ['ចាប់ផ្តើមគំនិតបង្កើតគម្រោងដោយក្រុមយុវជនតូចៗ', 'គោលបំណងដំបូង៖ ជួយសហគមន៍ក្នុងវិស័យអប់រំ និងបរិស្ថាន', 'រៀបចំការជួបជុំដំបូងជាមួយសហគមន៍ក្នុងតំបន់']
        : ['Concept started by a small youth group', 'Initial Goal: Help education and environment', 'First community meeting organized']
    },
    {
      year: '2021',
      title: language === 'km' ? 'ការចាប់ផ្តើមសកម្មភាព' : 'Starting Activities',
      points: language === 'km'
        ? ['រៀបចំសកម្មភាពសម្អាតតំបន់សាធារណៈដំបូង', 'ចូលរួមជាមួយកុមារ និងមាតាបិតាក្នុងការបង្រៀនអក្សរខ្មែរ និងគណិតវិទ្យា', 'ទទួលបានការគាំទ្រពីអាជ្ញាធរ និងស្ថាប័នមូលដ្ឋាន']
        : ['First public cleaning activity', 'Teaching Khmer and Math to children', 'Received support from local authorities']
    },
    {
      year: '2024',
      title: language === 'km' ? 'ការទទួលស្គាល់' : 'Recognition',
      points: language === 'km'
        ? ['ទទួលបានពានរង្វាន់សកម្មភាពសង្គមឆ្នើមថ្នាក់ជាតិ', 'ការចូលរួមស្ម័គ្រចិត្តកើនដល់ 400 នាក់', 'ទទួលបានការគាំទ្រពីអាជ្ញាធរ និងស្ថាប័នមូលដ្ឋាន']
        : ['National Social Action Award', 'Volunteer count reached 400', 'Institutional support increased']
    },
    {
      year: '2025',
      title: language === 'km' ? 'ការសម្រេចជោគជ័យធំ' : 'Major Success',
      points: language === 'km'
        ? ['ចំនួនស្ម័គ្រចិត្តកើនដល់ 3,000 នាក់', 'បង្កើតគម្រោងថ្មីសម្រាប់ការការពារបរិស្ថាន', 'មានដៃគូសហការជាច្រើនបានទាក់ទងមកយើង']
        : ['Volunteers reached 3,000', 'New environmental protection projects', 'Increased global partnerships']
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
      description: 'ខ្ញុំជានិស្សិតមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP) ឆ្នាំទី ៣ ផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ',
      social: { facebook: '#', telegram: '#', email: 'engyi@example.com' }
    },
    {
      id: 2,
      name: 'Pa borasy',
      khName: ' ប៉ា​ បូរ៉ាស៊ី',
      role: 'Member',
      khRole: 'សមាជិក',
      image: '/images/rasy.jpg',
      description: 'ខ្ញុំជានិស្សិតមកពីសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP) ឆ្នាំទី ៣ ផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ',
      social: { facebook: '#', telegram: '#', email: 'paborasy@example.com' }
    }
  ]

  return (
    <main className={`overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* --- HERO SECTION (Vision/Mission/Goal) --- */}
      <section className={`py-20 px-6 max-w-7xl mx-auto ${theme === 'dark' ? 'bg-slate-950' : ''}`}>
        <motion.div {...fadeInUp} className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-[#0066FF]'}`}>{language === 'km' ? 'អំពីយើង' : 'About Us'}</h1>
          <p className={`text-lg max-w-3xl mx-auto transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'km' 
              ? 'យើងជឿជាក់ថា សង្គមអាចក្លាយជាកន្លែងប្រសើរជាងមុន ប្រសិនបើយុវជន និងសហគមន៍ទទួលបានឱកាសអប់រំ និងការគាំទ្រសមស្រប។'
              : 'We believe society becomes better when youth and communities receive proper education and support.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Vision Card */}
          <motion.div {...fadeInUp} className={`p-10 rounded-[32px] shadow-sm border transition-colors duration-300 text-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <Lightbulb className={`transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{language === 'km' ? 'ចក្ខុវិស័យ' : 'Vision'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'km' 
                ? 'ចង់ឃើញសង្គមដែលមានមនុស្សគ្រប់រូបមានឱកាសស្មើគ្នា ទទួលបានការអប់រំ និងជីវភាពប្រសើរ ទាំងជនបទនិងទីប្រជុំជន។'
                : 'To see a society where everyone has equal opportunity for education and better living.'}
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className={`p-10 rounded-[32px] shadow-sm border transition-colors duration-300 text-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <Users className={`transition-colors duration-300 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{language === 'km' ? 'បេសកកម្ម' : 'Mission'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'km'
                ? 'ផ្តល់ឱកាសអប់រំ ការបណ្តុះបណ្តាល ដើម្បីបង្កើតកម្លាំងយុវជន និងសហគមន៍ ក្លាយជាអ្នកដឹកនាំ និងផ្លាស់ប្តូរសង្គមឲ្យកាន់តែប្រសើរ។'
                : 'Providing education and training to empower youth to become leaders and social changemakers.'}
            </p>
          </motion.div>

          {/* Goal Card */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className={`p-10 rounded-[32px] shadow-sm border transition-colors duration-300 text-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <Target className={`transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} size={32} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{language === 'km' ? 'គោលដៅ' : 'Goal'}</h3>
            <p className={`leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'km'
                ? 'ជំរុញការចូលរួមសហគមន៍ អភិវឌ្ឍសេដ្ឋកិច្ច និងបរិស្ថាន ព្រមទាំងគាំទ្រដល់អ្នកដែលត្រូវការជំនួយទាំងឡាយគ្រប់ខេត្តក្រុង។'
                : 'Promote community engagement, economic development, and environment across all provinces.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-20 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'បស់ស្រីដបេមហែភភាសក្រចមខ្ខ' : 'Our Foundation Journey'}</h2>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 hidden md:block transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'}`} />

            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content Card */}
                  <motion.div 
                    {...fadeInUp}
                    className={`flex-1 p-8 rounded-3xl shadow-lg border relative group hover:shadow-xl transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}
                  >
                    <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                    <ul className="space-y-3">
                      {item.points.map((p, i) => (
                        <li key={i} className={`flex items-start gap-3 text-sm transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={18} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Year Bubble */}
                  <div className="z-10 bg-[#00A3FF] text-white w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-blue-200 shadow-lg shrink-0">
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
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'សម្រេចលទ្ធផល និងសមិទ្ធផល' : 'Results & Achievements'}</h2>
          <p className={`mb-12 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'km' ? 'មើលសេចក្តីសង្ខេបអំពីអ្វីដែលយើងបានសម្រេច' : 'A summary of what we have achieved together'}</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: language === 'km' ? 'គ្រួសារទទួលបានសុខភាព' : 'Families Healthy', count: '1000+' },
              { label: language === 'km' ? 'កុមារទទួលបានការអប់រំ' : 'Children Educated', count: '500+' },
              { label: language === 'km' ? 'យុវជនបានបណ្តុះបណ្តាលជំនាញ' : 'Youth Trained', count: '200+' },
              { label: language === 'km' ? 'សហគមន៍បានអភិវឌ្ឍ' : 'Communities Developed', count: '500+' }
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className={`p-10 rounded-2xl shadow-sm border transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`} />
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{stat.count}</div>
                <div className={`text-sm font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* --- TEAM SECTION (Carousel) --- */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Section Title */}
          <h2 className="text-3xl font-bold mb-16 text-slate-800">សមាជិកក្រុម</h2>

          <div className="relative flex items-center justify-center gap-8">
            {/* Left Navigation Button */}
            <button 
              onClick={() => setTeamSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)}
              className="absolute left-4 md:left-20 z-20 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
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
                className="relative w-full max-w-md aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl group"
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
              className="absolute right-4 md:right-20 z-20 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Name and Role Subtitle */}
          <div className="mt-12">
            <h4 className="text-2xl font-bold text-blue-600 mb-1">{teamMembers[teamSlide].khName}</h4>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 bg-blue-300" />
              <p className="text-slate-500 font-medium">{teamMembers[teamSlide].khRole}</p>
              <div className="h-[2px] w-12 bg-blue-300" />
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {teamMembers.map((_, i) => (
              <div 
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${teamSlide === i ? 'w-8 bg-blue-500' : 'w-2 bg-blue-200'}`}
              />
            ))}
          </div>
        </div>
      </section>
       {/* --- PARTNERSHIP SECTION (MOU) --- */}
      <section className={`py-24 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className={`text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'ព័ត៌មានអំពីកិច្ចសហប្រតិបត្តិការ' : 'Partnership Information'}</h2>
              <div className="space-y-4">
                {[
                  { title: language === 'km' ? 'សហការផ្នែកបណ្តុះបណ្តាលគ្រូ' : 'Teacher Training', partner: 'ANT Center', tag: 'Workshops' },
                  { title: language === 'km' ? 'គម្រោងបរិស្ថានជាមួយសហគមន៍' : 'Community Environment', partner: 'Green Life Group', tag: 'Community Action' },
                  { title: language === 'km' ? 'MOU ជាមួយ NGO ថ្មី' : 'MOU with New NGO', partner: 'ABC Foundation', tag: 'MOU / Agreement' }
                ].map((item, i) => (
                  <div key={i} className={`flex gap-4 items-start p-4 border-l-4 border-blue-500 rounded-r-xl transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
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

            <div className="bg-slate-50 p-8 rounded-[32px]">
              <h3 className="font-bold text-xl mb-6">{language === 'km' ? 'ប្រភេទសហការ' : 'Types of Support'}</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Handshake size={20} /></div>
                  <div>
                    <h5 className="font-bold text-sm">{language === 'km' ? 'កិច្ចព្រមព្រៀង (MOU)' : 'MOU'}</h5>
                    <p className="text-xs text-slate-500">កំណត់គោលដៅ សិទ្ធិ និងការទទួលខុសត្រូវ</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><LayoutDashboard size={20} /></div>
                  <div>
                    <h5 className="font-bold text-sm">{language === 'km' ? 'សកម្មភាពរួម' : 'Joint Activities'}</h5>
                    <p className="text-xs text-slate-500">Workshop, Training, Hackathon...</p>
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