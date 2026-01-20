'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import {
  Mail, Phone, MapPin, Clock, Send, X, Loader,
  Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react'

const CONTACT = {
  address: 'ផ្លូវលេខ២១០A សង្កាត់ទឹកល្អក់ ខណ្ឌទួលគោក ភ្នំពេញ',
  phone: '+855 086 280 862',
  email: 'doculink@gmail.com',
  hours: 'ច័ន្ទ - សុក្រ · 7:00AM – 5:00PM'
}

export default function ContactPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const currentTheme = theme || 'dark' // Fixes TypeScript 'undefined' error
  const [isVisible, setIsVisible] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', message: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsVisible(true) // Trigger entrance animations
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  }

  return (
    <main className={`min-h-screen flex flex-col transition-all duration-500 ${currentTheme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900'}`}>
      
      {/* HEADER SECTION */}
      <section className={`pt-24 pb-12 text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
          {language === 'km' ? 'ទំនាក់ទំនងមកយើង' : 'Contact Us'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {language === 'km' ? 'សូមទាក់ទងមកយើង ប្រសិនបើអ្នកមានសំណួរ' : 'Get in touch with us for any questions or support'}
        </p>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="flex-grow px-6 pb-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10">

          {/* LEFT: COMPACT INFO FRAME (MATCHES IMAGE 2/3) */}
          <aside className={`lg:col-span-5 space-y-6 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className={`p-8 rounded-3xl border shadow-xl ${currentTheme === 'dark' ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="space-y-8">
                <InfoItem icon={<MapPin size={20}/>} label="LOCATION" value={CONTACT.address} />
                <hr className="border-slate-100 dark:border-slate-800" />
                <InfoItem icon={<Phone size={20}/>} label="PHONE" value={CONTACT.phone} />
                <hr className="border-slate-100 dark:border-slate-800" />
                <InfoItem icon={<Mail size={20}/>} label="EMAIL" value={CONTACT.email} />
                <hr className="border-slate-100 dark:border-slate-800" />
                <InfoItem icon={<Clock size={20}/>} label="HOURS" value={CONTACT.hours} />
              </div>
            </div>

            {/* MAP COMPONENT */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 shadow-lg grayscale-[0.3] hover:grayscale-0 transition-all duration-500">
              <iframe
                title="map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3908.7706124621143!2d104.9015024!3d11.5683017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2skh!4v1700000000000"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </aside>

          {/* RIGHT: PROFESSIONAL FORM FRAME (MATCHES IMAGE 2/3/9) */}
          <div className={`lg:col-span-7 p-10 rounded-3xl border transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} ${
            currentTheme === 'dark' ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/50'
          }`}>
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                {language === 'km' ? 'ផ្ញើសារមកយើង' : 'Send a Message'}
              </h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">We respond within 24 hours</p>
            </div>

            <form className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label={language === 'km' ? 'នាមត្រកូល' : 'Last Name'} name="lastName" value={form.lastName} onChange={handleChange} theme={currentTheme} />
                <Input label={language === 'km' ? 'នាមខ្លួន' : 'First Name'} name="firstName" value={form.firstName} onChange={handleChange} theme={currentTheme} />
              </div>
              <Input label={language === 'km' ? 'អ៊ីម៉ែល' : 'Email'} type="email" name="email" value={form.email} onChange={handleChange} theme={currentTheme} />
              <Textarea label={language === 'km' ? 'ធ្វើការផ្ញើសារ...' : 'Message'} name="message" value={form.message} onChange={handleChange} theme={currentTheme} />

              {/* ACTION BUTTONS (MATCHES IMAGE 8/9 STYLE) */}
              <div className="flex flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-[#0077cc] hover:bg-[#005fa3] transition-all flex items-center justify-center gap-2 text-base shadow-lg active:scale-95"
                >
                  {language === 'km' ? 'បញ្ជូន' : 'Send'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-[#0077cc] hover:bg-[#005fa3] transition-all flex items-center justify-center gap-2 text-base shadow-lg active:scale-95"
                >
                  {language === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION (MATCHES IMAGE 2) */}
      <footer className={`${currentTheme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'} border-t py-16 px-6`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-black text-blue-600 mb-4">DocuLink</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Share and discover study materials together. Empowering the next generation of students in Cambodia.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <li className="hover:text-blue-600 cursor-pointer">Home</li>
                <li className="hover:text-blue-600 cursor-pointer">Documents</li>
                <li className="hover:text-blue-600 cursor-pointer">Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Contact</h4>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 break-all">{CONTACT.email}</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">{CONTACT.phone}</p>
            </div>
          </div>
          <div className="flex gap-4 items-start md:justify-end">
            <SocialBtn icon={<Facebook size={18}/>} />
            <SocialBtn icon={<Twitter size={18}/>} />
            <SocialBtn icon={<Linkedin size={18}/>} />
            <SocialBtn icon={<Instagram size={18}/>} />
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-100 dark:border-slate-800 mt-12 pt-8 text-center text-[11px] text-slate-400 font-bold tracking-widest uppercase">
          © 2026 DocuLink PP. All Rights Reserved.
        </div>
      </footer>
    </main>
  )
}

/* ---------------- HELPER COMPONENTS ---------------- */

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase mb-1">{label}</p>
        <p className="text-sm font-bold leading-relaxed dark:text-slate-200">{value}</p>
      </div>
    </div>
  )
}

function Input({ label, theme, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className={`w-full px-5 py-3.5 rounded-2xl border outline-none transition-all text-sm font-bold ${
          theme === 'dark' 
            ? 'bg-[#0f172a] border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
            : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        }`}
      />
    </div>
  )
}

function Textarea({ label, theme, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">{label}</label>
      <textarea
        {...props}
        rows={5}
        className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all resize-none text-sm font-bold ${
          theme === 'dark' 
            ? 'bg-[#0f172a] border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
            : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
        }`}
      />
    </div>
  )
}

function SocialBtn({ icon }: any) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:-translate-y-1 cursor-pointer transition-all duration-300 shadow-sm">
      {icon}
    </div>
  )
}