'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Mail, Phone, MapPin, Send, Loader, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({ name: '', lastName: '', email: '', phone: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Header Section */}
      <div className={`pt-28 pb-16 px-6 text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {language === 'km' ? 'ទំនាក់ទំនងនៅទីនេះ!' : 'Contact Us Here!'}
        </h1>
        <p className={`max-w-3xl mx-auto px-6 leading-relaxed transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          {language === 'km' 
            ? 'យើងនៅទីនេះដើម្បីជួយអ្នក។ ទាក់ទងមកយើងសម្រាប់សំណួរ ការជួយ ឬព័ត៌មានបន្ថែម។ សូមធ្វើការបំពេញព័ត៌មានរបស់លោកអ្នក ឬ ទំនាក់ទំនងតាមលេខទូរស័ព្ទខាងក្រោម ដើម្បីធ្វើការទំនាក់ទំនងមកកាន់ពួកយើង។'
            : 'We are here to help. Contact us for questions, support, or more information. Please fill out your details or contact us via the phone number below.'}
        </p>
      </div>

      {/* Main Contact Section */}
      <section className={`py-24 px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: Contact Information Cards - Professional Style */}
          <div className="md:col-span-5 space-y-5">
            {/* Contact Info Card 1 - Address */}
            <div className={`group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-100 hover:border-blue-500/50'}`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/40 group-hover:scale-110' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:scale-110'}`}>
                <MapPin size={28} />
              </div>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'អាសយដ្ឋាន' : 'Address'}</h3>
              <p className={`transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>ផ្លូវលេខ២១០A សង្កាត់ទឹកល្អក់ ខណ្ឌទួលគោក ភ្នំពេញ</p>
            </div>

            {/* Contact Info Card 2 - Phone */}
            <div className={`group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-500/50'}`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 relative z-10 ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/40 group-hover:scale-110' : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 group-hover:scale-110'}`}>
                <Phone size={28} />
              </div>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'ទូរស័ព្ទទំនាក់ទំនង' : 'Contact Phone'}</h3>
              <p className={`transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>+855 086 280 862</p>
            </div>

            {/* Contact Info Card 3 - Email */}
            <div className={`group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50' : 'bg-white border-slate-100 hover:border-purple-500/50'}`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 relative z-10 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/40 group-hover:scale-110' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200 group-hover:scale-110'}`}>
                <Mail size={28} />
              </div>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'អ៊ីមែល' : 'Email'}</h3>
              <p className={`transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>doculink@gmail.com</p>
            </div>

            {/* Contact Info Card 4 - Hours */}
            <div className={`group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden relative ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 hover:border-orange-500/50' : 'bg-white border-slate-100 hover:border-orange-500/50'}`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 relative z-10 ${theme === 'dark' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/40 group-hover:scale-110' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200 group-hover:scale-110'}`}>
                <Clock size={28} />
              </div>
              <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{language === 'km' ? 'ម៉ោងធ្វើការ' : 'Working Hours'}</h3>
              <p className={`transition-colors duration-300 relative z-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>ច័ន្ទ - សុក្រ ម៉ោង ៧:០០ - ៥:០០</p>
            </div>

            {/* Google Map */}
            <div className={`w-full h-64 rounded-2xl overflow-hidden shadow-lg border transition-colors duration-300 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.770663446347!2d104.899212!3d11.568291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027633503d2e15%3A0xc3c9a632e8f176e5!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* RIGHT SIDE: Professional Contact Form */}
          <div className={`md:col-span-7 p-10 rounded-3xl shadow-2xl border backdrop-blur-md transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'}`}>
            {/* Form Header */}
            <div className="mb-8">
              <h3 className={`text-2xl md:text-3xl font-bold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {language === 'km' ? 'ផ្ញើសារមកយើង' : 'Send us a Message'}
              </h3>
              <div className={`h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4`} />
              <p className={`transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'km' ? 'សូមបំពេញទម្រង់ខាងក្រោម ហើយយើងនឹងឆ្លើយឆ្លងទៅលោកអ្នក។' : 'Fill in the form below and we will get back to you.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {language === 'km' ? 'នាមត្រកូល' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={language === 'km' ? 'នាមត្រកូលរបស់អ្នក' : 'Your last name'}
                    className={`w-full px-5 py-3.5 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {language === 'km' ? 'នាមខ្លួន' : 'First Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={language === 'km' ? 'នាមខ្លួនរបស់អ្នក' : 'Your first name'}
                    className={`w-full px-5 py-3.5 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'km' ? 'អ៊ីមែល' : 'Email Address'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'km' ? 'example@gmail.com' : 'your@email.com'}
                  className={`w-full px-5 py-3.5 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={language === 'km' ? '+855 12 345 678' : '+855 12 345 678'}
                  className={`w-full px-5 py-3.5 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'km' ? 'សារ' : 'Message'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={language === 'km' ? 'សូមក្រុមក្រងសាររបស់លោកអ្នក...' : 'Your message...'}
                  rows={5}
                  className={`w-full px-5 py-3.5 rounded-xl border-2 font-medium focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'}`}
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl disabled:opacity-50' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl disabled:opacity-50'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      {language === 'km' ? 'ផ្ញើឡើង...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      {language === 'km' ? 'បញ្ជូន' : 'Send Message'}
                    </>
                  )}
                </button>
                <button
                  type="reset"
                  onClick={() => setFormData({ name: '', lastName: '', email: '', phone: '', message: '' })}
                  className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
                >
                  {language === 'km' ? 'បោះបង់' : 'Clear'}
                </button>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-500/20 border-2 border-green-500 rounded-xl text-green-500 font-bold text-center animate-pulse">
                  {language === 'km' ? '✓ សារត្រូវបានផ្ញើដោយជោគជ័យ!' : '✓ Message sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`text-white py-16 px-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-900'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-6">DocuLink</h3>
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
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">ព័ត៌មាន</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors duration-300">អំពីរយើង</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">ទំនាក់ទំនង</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">គោលការណ៍ឯកជន</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">លក្ខខណ្ឌប្រើប្រាស់</a></li>
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
            <p className="text-lg">© 2026 DocuLink។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
