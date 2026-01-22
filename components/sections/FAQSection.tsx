'use client'
import { useState } from 'react'
import { ChevronRight, MessageCircle } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface FAQSectionProps {
  theme: string
  faqData: FAQItem[]
}

export default function FAQSection({ theme, faqData }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  return (
    <section className={`py-24 px-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 ${theme === 'dark' ? 'from-purple-950 via-indigo-950 to-purple-900' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <MessageCircle className="w-12 h-12 text-purple-300 mx-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            សំណួរដែលសួរញឹកញាប់
          </h2>
          <p className="text-xl text-purple-200">
            ស្វែងយល់បន្ថែមអំពីវេទិការបស់យើង
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <div
                key={index}
                className={`overflow-hidden transition-all duration-300 rounded-2xl backdrop-blur-sm border ${
                  isActive 
                    ? 'bg-white/10 border-purple-400/50 shadow-2xl shadow-purple-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/30'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  className="w-full text-left p-6 flex items-center justify-between transition-all duration-300"
                >
                  <h3 className="text-lg font-bold pr-4 text-white">
                    {item.q}
                  </h3>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-purple-500' : 'bg-white/10'
                  }`}>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-300 text-white ${
                        isActive ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent mb-4"></div>
                    <p className="leading-relaxed text-purple-100">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-purple-200 mb-6 text-lg">
            មិនឃើញសំណួរដែលលោកអ្នកកំពុងស្វែងរក?
          </p>
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105">
            <MessageCircle size={20} />
            <span>ទាក់ទងយើងឥឡូវនេះ</span>
          </button>
        </div>
      </div>
    </section>
  )
}
