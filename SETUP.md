# DocuLinks Setup Guide

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Email/Password**
   - Enable **Google** sign-in provider
4. Get your Firebase config:
   - Go to **Project Settings** > **General**
   - Scroll down to "Your apps" and click the web icon `</>`
   - Copy the config values

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Supabase Configuration (for database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run the Application

```bash
npm install
npm run dev
```

Visit:
- http://localhost:3000/auth/signup - Sign up with Email or Google
- http://localhost:3000/auth/login - Log in with Email or Google

## Features

✅ Email/Password authentication with Firebase
✅ Google OAuth sign-in
✅ Beautiful modern UI with gradients and animations
✅ Khmer language support
✅ User profile synced with Supabase database
