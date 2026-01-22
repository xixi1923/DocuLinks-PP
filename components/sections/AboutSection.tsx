'use client'
import { Award, BookOpen, Users, FileText, Shield } from 'lucide-react'

interface AboutSectionProps {
  theme: string
}

export default function AboutSection({ theme }: AboutSectionProps) {
  const features = [
    {
      icon: Award,
      title: 'គុណភាពឯកសារ',
      desc: 'ឯកសារទាំងអស់ត្រូវបានពិនិត្យមុនទទួលបាន ដើម្បីធានាបានគុណភាព',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'ចំណេះដឹងចែករំលែក',
      desc: 'ទទួលបាននូវចំណេះដឹងពីគ្រប់ផ្នែករឺវិញ្ញាសា',
      color: 'from-indigo-500 to-blue-500'
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
  ]

  return (
    <section className={`py-24 px-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-teal-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="flex items-center justify-center">
            <div className={`relative w-full max-w-lg ${theme === 'light' ? 'p-1 bg-gradient-to-br from-blue-400 via-teal-400 to-cyan-400 rounded-3xl' : ''}`}>
              <img
                src="/images/about-documents.jpg"
                alt="Students collaborating with documents"
                className={`w-full h-auto rounded-3xl ${theme === 'light' ? 'border-4 border-white' : ''}`}
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'}`}>
                គោលបំណង
              </div>

              <h2 className={`text-4xl lg:text-5xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                បេសកកម្មរបស់យើងគឺជួយនិស្សិតទាំងអស់នៅកម្ពុជា
              </h2>

             <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-teal-100' : 'text-slate-600'}`}>
                យើងផ្តល់ជូននូវឯកសារ និងធនធានផ្សេងៗតាមរយៈប្រព័ន្ធរបស់យើង ដោយផ្អែកលើភាពងាយស្រួល និងភាពត្រឹមត្រូវ។ 
                យើងផ្តោតសំខាន់លើគុណភាពខ្ពស់ក្នុងដំណើរការ ការគ្រប់គ្រងប្រព័ន្ធប្រកបដោយប្រសិទ្ធភាព 
                និងការផ្តល់ព័ត៌មានដែលអាចទុកចិត្តបានសម្រាប់អ្នកប្រើប្រាស់។
                    </p>

            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 group"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
