'use client'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react'

interface FooterSectionProps {
  theme: string
}

export default function FooterSection({ theme }: FooterSectionProps) {
  return (
    <footer className={`text-white py-16 px-6 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950' : 'bg-slate-900'}`}>
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
              <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Facebook">
                <Facebook size={20} />
              </button>
              <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Twitter">
                <Twitter size={20} />
              </button>
              <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="LinkedIn">
                <Linkedin size={20} />
              </button>
              <button className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-300 hover:scale-110" aria-label="Instagram">
                <Instagram size={20} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">តំណរភ្ជាប់រហ័ស</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors duration-300">ទំព័រដើម</Link></li>
              <li><Link href="/documents" className="hover:text-white transition-colors duration-300">រុករកឯកសារ</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">សហគមន៍</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300">ព្រឹត្តិការណ៏</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">អត្ថបទ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">ព័ត៌មាន</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">អំពីរយើង</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300">ទំនាក់ទំនង</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">គោលការណ៍ឯកជន</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300">លក្ខខណ្ឌប្រើប្រាស់</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300">ជំនួយ</Link></li>
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
  )
}
