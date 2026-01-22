# Firestore Collection Schema - DocuLinks

This document outlines the Firestore database structure for the DocuLinks project.

## Collections Overview

### 1. `documents` Collection
Stores all uploaded learning documents.

```
documents/
├── {docId}
│   ├── title: string
│   ├── description: string
│   ├── file_type: string (e.g., "application/pdf", "application/msword")
│   ├── category_id: number
│   ├── user_id: string (Firebase UID)
│   ├── user_email: string
│   ├── file_url: string (Cloudflare R2 public URL)
│   ├── status: string ("pending", "approved", "rejected")
│   ├── created_at: timestamp
│   ├── university: string (optional)
│   └── likes_count: number (optional, for quick lookup)
```

**Indexes to Create:**
- `status` (ascending) - for filtering approved documents
- `created_at` (descending) - for sorting by newest
- `category_id` (ascending) - for filtering by category

### 2. `likes` Collection
Tracks which users liked which documents.

```
likes/
├── {likeId}
│   ├── document_id: string (references documents)
│   ├── user_id: string (Firebase UID)
│   └── created_at: timestamp
```

**Indexes to Create:**
- `user_id` + `document_id` (composite) - for checking if liked
- `user_id` (ascending) - for getting user's likes
- `document_id` (ascending) - for getting document likes count

### 3. `favorites` Collection
Tracks which users favorited which documents.

```
favorites/
├── {favoriteId}
│   ├── document_id: string (references documents)
│   ├── user_id: string (Firebase UID)
│   └── created_at: timestamp
```

**Indexes to Create:**
- `user_id` + `document_id` (composite) - for checking if favorited
- `user_id` (ascending) - for getting user's favorites

### 4. `comments` Collection
Stores comments on documents.

```
comments/
├── {commentId}
│   ├── document_id: string (references documents)
│   ├── user_id: string (Firebase UID)
│   ├── user_email: string
│   ├── user_name: string (optional)
│   ├── content: string (comment text)
│   └── created_at: timestamp
```

**Indexes to Create:**
- `document_id` + `created_at` (composite, descending) - for fetching comments ordered by date
- `user_id` (ascending) - for getting user's comments

### 5. `categories` Collection
Stores document categories.

```
categories/
├── {catId}
│   ├── id: number
│   ├── name: string (e.g., "គណិតវិទ្យា", "ភាសាអង់គ្លេស")
```

**Data:**
```json
{
  "id": 1,
  "name": "គណិតវិទ្យា"
},
{
  "id": 2,
  "name": "ភាសាអង់គ្លេស"
},
{
  "id": 3,
  "name": "បច្ចេកវិទ្យា"
},
{
  "id": 4,
  "name": "រូបវិទ្យា"
}
```

## Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read approved documents
    match /documents/{document=**} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }

    // Likes - anyone can read, only authenticated users can create
    match /likes/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.user_id;
    }

    // Favorites - only owner can access
    match /favorites/{document=**} {
      allow read, create, delete: if request.auth != null && 
        (request.auth.uid == resource.data.user_id || !('user_id' in resource.data));
    }

    // Comments - anyone can read, authenticated users can create
    match /comments/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete, update: if request.auth.uid == resource.data.user_id;
    }

    // Categories - anyone can read
    match /categories/{document=**} {
      allow read: if true;
    }
  }
}
```

## Setup Instructions

### 1. Enable Firestore
- Go to Firebase Console → Your Project
- Select "Firestore Database"
- Click "Create database" → Select "Start in production mode"

### 2. Create Collections (optional - auto-created on first write)
- Collections are automatically created when first document is added
- You can pre-create them for organization:
  - `documents`
  - `likes`
  - `favorites`
  - `comments`
  - `categories`

### 3. Add Indexes
- Firebase will prompt you to create indexes as needed
- Or manually create in: Firestore Database → Indexes → Create Composite Index

### 4. Create Categories
Add sample categories:
```
documents/
├── id: 1, name: "គណិតវិទ្យា"
├── id: 2, name: "ភាសាអង់គ្លេស"
├── id: 3, name: "បច្ចេកវិទ្យា"
└── id: 4, name: "រូបវិទ្យា"
```

### 5. Set Security Rules
Copy the rules above to Firestore Rules tab.

## Usage Examples

### Fetch Approved Documents
```typescript
import { getApprovedDocuments } from '@/lib/firestoreHelpers';

const docs = await getApprovedDocuments();
```

### Add Like
```typescript
import { addLike } from '@/lib/firestoreHelpers';

await addLike(userId, documentId);
```

### Get Comments
```typescript
import { getComments } from '@/lib/firestoreHelpers';

const comments = await getComments(documentId);
```

### Format Timestamp
```typescript
import { formatTime } from '@/lib/firestoreHelpers';

const timeAgo = formatTime(comment.created_at);
// Output: "2h ago"
```

## Migration Notes

- All user IDs should use Firebase Authentication UID
- All timestamps use Firestore Timestamp type
- File URLs point to Cloudflare R2 storage
- Likes/favorites/comments are stored in separate collections for scalability
