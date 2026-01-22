'use client'
import Link from 'next/link'
import { Star, CheckCircle, Upload, ArrowRight } from 'lucide-react'

interface CTASectionProps {
  theme: string
}

export default function CTASection({ theme }: CTASectionProps) {
  return (
    <section className={`py-24 px-6 text-white overflow-hidden transition-all duration-500 ${
      theme === 'dark' ? 'bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800' : 'bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-700'
    }`}>
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
              {[
                'បង្រួមឯកសារបង្រៀនរបស់អ្នក',
                'ចូលរួមនឹងសហគមន៍ 650+ នាក់',
                'ជួយសិស្សក្នុងការរៀន និងស្រាវជ្រាវ'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">{text}</span>
                </div>
              ))}
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
                        <p className="text-xs text-slate-500 font-semibold">និស្សិត</p>
                        <p className="font-bold text-slate-900 text-lg">650+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
