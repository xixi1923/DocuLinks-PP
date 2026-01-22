'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import OnboardingCheck from '@/components/OnboardingCheck'
import OnboardingModal from '@/components/OnboardingModal'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import DocumentsSection from '@/components/sections/DocumentsSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import FAQSection from '@/components/sections/FAQSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'
import FooterSection from '@/components/sections/FooterSection'
import { FAQ_DATA, CATEGORIES_DATA, TESTIMONIALS_DATA } from '@/lib/sectionData'

export default function Homepage() {
  const { theme } = useTheme()
  const resolvedTheme = theme || 'light'
  const [pageLoading, setPageLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">កំពុងផ្ទុក...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${resolvedTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900'}`}>
      <OnboardingCheck onShowOnboarding={() => setShowOnboarding(true)} />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      
      <HeroSection theme={resolvedTheme} />
      <AboutSection theme={resolvedTheme} />
      <DocumentsSection theme={resolvedTheme} />
      <CategoriesSection theme={resolvedTheme} categories={CATEGORIES_DATA} />
      <FAQSection theme={resolvedTheme} faqData={FAQ_DATA} />
      <TestimonialsSection theme={resolvedTheme} testimonials={TESTIMONIALS_DATA} />
      <CTASection theme={resolvedTheme} />
      <FooterSection theme={resolvedTheme} />
    </div>
  )
}
