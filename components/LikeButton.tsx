
'use client'
import { useEffect, useState } from 'react'
import { auth, db, collection, getDocs, onAuthStateChanged, query, where } from '@/lib/firebaseClient'
import { addLike, removeLike, checkIfLiked } from '@/lib/firestoreHelpers'

export default function LikeButton({ documentId }: { documentId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  const refreshCount = async () => {
    const snapshot = await getDocs(query(collection(db, 'likes'), where('document_id', '==', documentId)))
    setCount(snapshot.size)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isLiked = await checkIfLiked(user.uid, documentId)
        setLiked(isLiked)
      } else {
        setLiked(false)
      }
      await refreshCount()
    })
    return () => unsub()
  }, [documentId])

  const toggle = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('Please log in')
      return
    }
    if (liked) {
      await removeLike(user.uid, documentId)
      setLiked(false)
      setCount((c) => Math.max(0, c - 1))
    } else {
      await addLike(user.uid, documentId)
      setLiked(true)
      setCount((c) => c + 1)
    }
  }

  return (
    <button onClick={toggle} className={`btn btn-outline ${liked ? 'bg-pink-600 text-white border-pink-600' : ''}`}>
      ❤️ {count}
    </button>
  )
}
