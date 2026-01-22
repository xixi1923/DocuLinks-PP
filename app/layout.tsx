import type { Metadata } from 'next'
import '../styles/globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/Navbar'
import { Hanuman, Battambang } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { UserRoleProvider } from '@/contexts/UserRoleContext'
import { ToastProvider } from '@/contexts/ToastContext'

const hanuman = Hanuman({ 
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['khmer', 'latin'],
  variable: '--font-hanuman',
  display: 'swap'
})

const battambang = Battambang({ 
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['khmer', 'latin'],
  variable: '--font-battambang',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'DocuLink - Share & Discover Study Documents',
  description: 'Find and share study documents with fellow students. Access thousands of academic resources, notes, and study materials for free.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${hanuman.variable} ${battambang.variable} font-sans`}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserRoleProvider>
              <ToastProvider>
                <Navbar />
                <div className="relative">
                  {children}
                </div>
              </ToastProvider>
            </UserRoleProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}