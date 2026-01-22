'use client'

import { useEffect, useState } from 'react'
import { getIdTokenResult, User } from 'firebase/auth'
import { auth, onAuthStateChanged } from '@/lib/firebaseClient'
import {
  getDocumentsByStatus,
  updateDocumentStatus,
  deleteDocumentById,
  type DocumentData,
} from '@/lib/firestoreHelpers'
import { Check, XCircle, Trash2, Shield } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendingDocs, setPendingDocs] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      setUser(u)
      setIsAdmin(false)
      setError(null)

      if (u) {
        const token = await getIdTokenResult(u)
        const role = token.claims.role
        if (role === 'admin') {
          setIsAdmin(true)
        } else {
          setError('Not an admin account')
        }
      } else {
        setError('Please sign in')
      }
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!isAdmin) {
        setPendingDocs([])
        setLoading(false)
        return
      }
      setLoading(true)
      const docs = await getDocumentsByStatus('pending')
      setPendingDocs(docs)
      setLoading(false)
    }
    load()
  }, [isAdmin])

  const handleAction = async (docId: string, action: 'approve' | 'reject' | 'delete') => {
    if (!isAdmin) return
    setBusyId(docId)
    try {
      if (action === 'approve') {
        await updateDocumentStatus(docId, 'approved')
        toast.success('Document approved successfully!')
      } else if (action === 'reject') {
        await updateDocumentStatus(docId, 'rejected')
        toast.warning('Document rejected')
      } else if (action === 'delete') {
        await deleteDocumentById(docId)
        toast.success('Document deleted successfully!')
      }
      setPendingDocs(prev => prev.filter(d => d.id !== docId))
    } catch (err: any) {
      toast.error(err?.message || 'Action failed')
    } finally {
      setBusyId(null)
    }
  }

  if (!user || !isAdmin) {
    return (
      <main className='min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-6'>
        <div className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 max-w-md w-full text-center'>
          <Shield className='w-10 h-10 mx-auto mb-3 text-blue-600' />
          <h1 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>Admin Access</h1>
          <p className='text-slate-600 dark:text-slate-400'>{error || 'Loading...'}</p>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-slate-50 dark:bg-slate-900 p-6'>
      <div className='max-w-5xl mx-auto space-y-4'>
        <header className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Signed in as {user.email}</p>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-white'>Admin Panel</h1>
            <p className='text-slate-600 dark:text-slate-400'>Approve or delete pending uploads</p>
          </div>
        </header>

        {loading ? (
          <div className='text-slate-600 dark:text-slate-400'>Loading pending documents...</div>
        ) : pendingDocs.length === 0 ? (
          <div className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-slate-600 dark:text-slate-400'>
            No pending documents.
          </div>
        ) : (
          <div className='space-y-3'>
            {pendingDocs.map(doc => (
              <div key={doc.id} className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold text-slate-900 dark:text-white'>{doc.title}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>From: {doc.user_email || 'Unknown'}</p>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>Category: {doc.category_id}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleAction(doc.id, 'approve')}
                      disabled={busyId === doc.id}
                      className='inline-flex items-center gap-1 px-3 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60'
                    >
                      <Check className='w-4 h-4' /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(doc.id, 'reject')}
                      disabled={busyId === doc.id}
                      className='inline-flex items-center gap-1 px-3 py-2 rounded-md bg-amber-500 text-white text-sm disabled:opacity-60'
                    >
                      <XCircle className='w-4 h-4' /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(doc.id, 'delete')}
                      disabled={busyId === doc.id}
                      className='inline-flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white text-sm disabled:opacity-60'
                    >
                      <Trash2 className='w-4 h-4' /> Delete
                    </button>
                  </div>
                </div>
                <p className='text-sm text-slate-600 dark:text-slate-300'>{doc.description || '(No description)'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
