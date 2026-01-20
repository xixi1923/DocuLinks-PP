'use client'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'

interface OnboardingCheckProps {
  onShowOnboarding: () => void
}

declare global {
  interface Window {
    previousUser: any
  }
}

export default function OnboardingCheck({ onShowOnboarding }: OnboardingCheckProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check if user just logged out
      if (window.previousUser && !currentUser) {
        // User logged out, reset onboarding
        localStorage.removeItem('onboardingCompleted')
        localStorage.removeItem('userType')
        localStorage.removeItem('selectedField')
        localStorage.removeItem('onboardingData')

        // Show onboarding again
        onShowOnboarding()
      }
      window.previousUser = currentUser
    })

    // Small delay to ensure providers are initialized
    const timer = setTimeout(() => {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted')

      // If not completed, show onboarding
      if (!onboardingCompleted) {
        onShowOnboarding()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      unsubscribe()
    }
  }, [onShowOnboarding])

  return null // This component doesn't render anything
}