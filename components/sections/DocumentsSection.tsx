'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FileText, Search, ArrowRight } from 'lucide-react'
import DocCard from '@/components/DocCard'

interface DocumentsSectionProps {
  theme: string
}

export default function DocumentsSection({ theme }: DocumentsSectionProps) {
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

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

  return (
    <section className={`py-32 px-6 relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-blue-200/30 to-purple-200/30' : 'bg-gradient-to-br from-indigo-400/40 to-purple-400/40'}`} />
        <div className={`absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-200/30 to-teal-200/30' : 'bg-gradient-to-br from-pink-400/40 to-rose-400/40'}`} style={{ animationDelay: '3s' }} />
        <div className={`absolute top-1/2 left-1/4 w-36 h-36 rounded-full blur-3xl animate-float ${theme === 'dark' ? 'bg-gradient-to-br from-purple-300/20 to-blue-300/20' : 'bg-gradient-to-br from-cyan-400/30 to-blue-400/30'}`} style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 animate-fade-in-up shadow-lg ${theme === 'dark' ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'}`}>
            <FileText className="w-5 h-5" />
            <span>ឯកសារសិក្សាដ៏មានតម្លៃ</span>
          </div>
          <h2 className={`text-4xl lg:text-6xl font-black mb-6 animate-fade-in-up ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            រកឃើញឯកសារសិក្សា<br />
            <span className={theme === 'dark' ? 'text-purple-300' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'}>ពីសហគមន៍របស់យើង</span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100 ${theme === 'dark' ? 'text-purple-100' : 'text-slate-600'}`}>
            រុករកបណ្ណសារជាច្រើនដែលបានចែករំលែកដោយនិស្សិតពីសាកលវិទ្យាល័យផ្សេងៗ រួមមានកិច្ចការដ្ឋាន សៀវភៅ និងសម្ភារៈសិក្សាដ៏មានតម្លៃ។
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleDocs.map((doc) => (
            <DocCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc)} theme={theme} />
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in-up animate-delay-300">
          <Link
            href="/documents"
            className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'}`}
          >
            <Search className="w-6 h-6" />
            <span>មើលឯកសារទាំងអស់</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
