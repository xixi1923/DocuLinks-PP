
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return setMsg(error.message)
    if (data.user) { await supabase.from('profiles').insert({ id: data.user.id, display_name: email.split('@')[0] }) }
    router.push('/')
  }
  return (
    <main className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
      <form onSubmit={signup} className="space-y-3">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-md p-2 bg-white dark:bg-slate-900 dark:border-slate-800"/>
        <button className="btn btn-primary">Create account</button>
        {msg && <p className="text-sm text-rose-600">{msg}</p>}
      </form>
    </main>
  )
}
