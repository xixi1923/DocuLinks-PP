# Firebase Storage & Firestore Setup Guide

## Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click **Storage**
4. Click **Get started**
5. Choose **Production mode** or **Test mode**:
   - **Test mode** (for development):
     ```
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
   - **Production mode**: Adjust rules as needed
6. Click **Next** and **Done**

## Enable Firestore Database

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose location (select closest to your users)
4. Choose **Production mode** or **Test mode**:
   - **Test mode** (for development):
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
5. Click **Enable**

## Security Rules (Production-ready)

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Documents folder - authenticated users can read, only owner can write/delete
    match /documents/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Profile pictures
    match /avatars/{userId}/{fileName} {
      allow read: if true;  // Public read
      allow write, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profiles collection
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Documents collection
    match /documents/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Likes, comments, favorites
    match /likes/{likeId} {
      allow read: if true;
      allow create, delete: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create, delete: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## What's Now Available

✅ **Firebase Storage** - For file uploads (PDFs, images, documents)
✅ **Firestore Database** - NoSQL database for documents, profiles, likes, comments
✅ **Firebase Auth** - Already configured with Email/Password and Google OAuth

## Usage in Your Code

```typescript
import { storage, db } from '@/lib/firebaseConfig'

// Upload file to Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
const storageRef = ref(storage, 'documents/user123/file.pdf')
await uploadBytes(storageRef, file)
const url = await getDownloadURL(storageRef)

// Write to Firestore
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
await setDoc(doc(db, 'profiles', userId), { name: 'John' })
await addDoc(collection(db, 'documents'), { title: 'My Doc' })

// Read from Firestore
import { getDoc, getDocs, query, where } from 'firebase/firestore'
const docSnap = await getDoc(doc(db, 'profiles', userId))
const q = query(collection(db, 'documents'), where('status', '==', 'approved'))
const querySnapshot = await getDocs(q)
```

## Next Steps

Your Firebase configuration is ready! You can now:
1. Migrate from Supabase Storage to Firebase Storage
2. Migrate from Supabase Database to Firestore
3. Upload files directly to Firebase Storage
4. Store document metadata in Firestore
