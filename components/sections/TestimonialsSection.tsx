'use client'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  text: string
  image: string
}

interface TestimonialsSectionProps {
  theme: string
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ theme, testimonials }: TestimonialsSectionProps) {
  return (
    <section className={`py-24 px-6 transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-violet-950 via-blue-950 to-violet-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            មតិយោបល់របស់និស្សិត
          </h2>
          <p className={`text-2xl md:text-3xl font-semibold leading-relaxed ${theme === 'dark' ? 'text-violet-200' : 'text-slate-700'}`}>
            ស្តាប់អ្វីដែលនិស្សិតរបស់យើងនិយាយអំពីបទពិសោធន៍
          </p>
          <p className={`text-2xl md:text-3xl font-semibold leading-relaxed mt-2 ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
            ក្នុងការប្រើប្រាស់វេទិកា DocuLink
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const lightBgColors = [
              'bg-gradient-to-br from-blue-50 to-indigo-50',
              'bg-gradient-to-br from-purple-50 to-pink-50',
              'bg-gradient-to-br from-teal-50 to-cyan-50',
              'bg-gradient-to-br from-violet-50 to-purple-50',
              'bg-gradient-to-br from-indigo-50 to-blue-50',
              'bg-gradient-to-br from-sky-50 to-blue-50'
            ]
            return (
            <div
              key={index}
              className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : `${lightBgColors[index % lightBgColors.length]} border border-white/50`
              }`}
            >
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 rounded-full mr-4 overflow-hidden ${theme === 'dark' ? 'bg-violet-500/30 ring-2 ring-violet-400' : 'bg-gray-200'}`}>
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-violet-200' : 'text-slate-600'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className={`leading-relaxed mb-6 ${theme === 'dark' ? 'text-blue-100' : 'text-slate-600'}`}>
                "{testimonial.text}"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current animate-pulse" />
                ))}
              </div>
            </div>
          )
          })}
        </div>
      </div>
    </section>
  )
}
