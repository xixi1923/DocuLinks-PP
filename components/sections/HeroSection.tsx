'use client'
import Link from 'next/link'
import { Sparkles, Search, Upload, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  theme: string
}

export default function HeroSection({ theme }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden transition-all duration-500 ${
      theme === 'dark' ? 'bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950' : 'bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-6 py-3 rounded-full font-bold text-sm mb-8 shadow-lg border border-indigo-200/50 backdrop-blur-sm animate-bounce-slow">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>វេទិកាចែករំលែកឯកសារសិក្សាដ៏ល្អបំផុត</span>
          </div>

          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight animate-fade-in-up ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>ចែករំលែក</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ឯកសារសិក្សា
            </span>
            <br />
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>ដោយងាយស្រួល</span>
          </h1>

          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200 ${
            theme === 'dark' ? 'text-blue-100' : 'text-slate-600'
          }`}>
            វេទិកាដ៏ល្អបំផុតសម្រាប់និស្សិតក្នុងការចែករំលែក និងស្វែងរកឯកសារសិក្សា។
            <br />
            ចូលរួមជាមួយសហគមន៍និស្សិតរាប់ពាន់នាក់ ដើម្បីជួយគ្នាទៅរកភាពជោគជ័យ។
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-200">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Upload className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>បង្រួមឯកសារ</span>
            </Link>

            <Link
              href="/documents"
              className={`group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'bg-white/10 backdrop-blur-md text-white border-2 border-white/30'
                  : 'bg-white text-indigo-600 border-2 border-indigo-200'
              }`}
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>ស្វែងរកឯកសារ</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
