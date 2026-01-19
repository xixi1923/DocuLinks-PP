
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, UserPlus, ArrowRight, Sparkles, Shield, Check, X } from 'lucide-react'
import { auth, googleProvider } from '@/lib/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState<{email?: string, password?: string, confirm?: string}>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: {email?: string, password?: string, confirm?: string} = {}
    
    if (!email) newErrors.email = 'អ៊ីម៉ែលគឺចាំបាច់'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'អ៊ីម៉ែលមិនត្រឹមត្រូវ'
    
    if (!password) newErrors.password = 'ពាក្យសម្ងាត់គឺចាំបាច់'
    else if (password.length < 6) newErrors.password = 'យ៉ាងតិច ៦ តួអក្សរ'
    
    if (!confirmPassword) newErrors.confirm = 'សូមយืន្យ ពាក្យសម្ងាត់'
    else if (password !== confirmPassword) newErrors.confirm = 'ពាក្យសម្ងាត់មិនផ្គូផ្គង'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      await updateProfile(user, {
        displayName: email.split('@')[0]
      })
      
      // Create profile in Supabase
      await supabase.from('profiles').insert({ 
        id: user.uid, 
        display_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
      })
      
      setLoading(false)
      router.push('/')
    } catch (error: any) {
      setMsg(error.message || 'មានបញ្ហាក្នុងការបង្កើតគណនី')
      setLoading(false)
    }
  }

  const signupWithGoogle = async () => {
    setLoading(true)
    setMsg('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Create or update profile in Supabase
      const { error } = await supabase.from('profiles').upsert({ 
        id: user.uid, 
        display_name: user.displayName || user.email?.split('@')[0] || 'User',
        avatar_url: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
      }, { onConflict: 'id' })
      
      setLoading(false)
      router.push('/')
    } catch (error: any) {
      setMsg(error.message || 'មានបញ្ហាក្នុងការចុះឈ្មោះ')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4 py-12 animate-gradient-x">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}} />
        
        {/* Card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-4 shadow-lg animate-bounce">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">ចុះឈ្មោះឥឡូវនេះ</h1>
            <p className="text-slate-600">ចាប់ផ្តើមចែករំលែកចំណេះដឹងជាមួយគ្នា</p>
          </div>

          {/* Form */}
          <form onSubmit={signup} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-indigo-600" />
                អ៊ីម៉ែល
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="your@email.com" 
                  className={`w-full border-2 rounded-xl p-4 pl-12 bg-white focus:ring-4 transition-all duration-300 outline-none font-medium ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.email && <p className="text-xs text-red-600 flex items-center gap-1"><X size={12} /> {errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-indigo-600" />
                ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className={`w-full border-2 rounded-xl p-4 pl-12 bg-white focus:ring-4 transition-all duration-300 outline-none font-medium ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600 flex items-center gap-1"><X size={12} /> {errors.password}</p>
              ) : (
                <p className="text-xs text-slate-500 flex items-center gap-1"><Shield size={12} /> យ៉ាងតិច ៦ តួអក្សរ</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-indigo-600" />
                បញ្ជាក់ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e=>setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className={`w-full border-2 rounded-xl p-4 pl-12 bg-white focus:ring-4 transition-all duration-300 outline-none font-medium ${
                    errors.confirm 
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.confirm && <p className="text-xs text-red-600 flex items-center gap-1"><X size={12} /> {errors.confirm}</p>}
            </div>

            {/* Error Message */}
            {msg && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 animate-fade-in-up">
                <p className="text-sm text-rose-600 font-medium">{msg}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-4 font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  កំពុងដំណើរការ...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="animate-pulse" />
                  បង្កើតគណនី
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={signupWithGoogle}
            disabled={loading}
            className="w-full mt-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl p-4 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ចុះឈ្មោះជាមួយ Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">មានគណនីរួចហើយ?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/auth/login"
            className="block w-full text-center border-2 border-indigo-200 text-indigo-700 rounded-xl p-4 font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
          >
            ចូលប្រើប្រាស់គណនី
          </Link>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            ← ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </main>
  )
}
