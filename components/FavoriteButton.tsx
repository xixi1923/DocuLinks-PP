
'use client'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from '@/lib/firebaseClient'
import { addFavorite, removeFavorite, checkIfFavorited } from '@/lib/firestoreHelpers'

export default function FavoriteButton({ documentId }: { documentId: string }) {
  const [fav, setFav] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isFav = await checkIfFavorited(user.uid, documentId)
        setFav(isFav)
      } else {
        setFav(false)
      }
    })
    return () => unsub()
  }, [documentId])

  const toggle = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('Please log in')
      return
    }
    if (fav) {
      await removeFavorite(user.uid, documentId)
      setFav(false)
    } else {
      await addFavorite(user.uid, documentId)
      setFav(true)
    }
  }

  return (
    <button onClick={toggle} className={`btn btn-outline ${fav ? 'bg-amber-500 text-white border-amber-500' : ''}`}>
      ⭐ {fav ? 'Saved' : 'Save'}
    </button>
  )
}
