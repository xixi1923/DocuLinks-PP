# 🎓 DocuLink - Complete Project Explanation & Demo Guide

## 📋 Executive Summary

**DocuLink** is a **modern document-sharing web application** designed for students and educators to collaborate on learning resources. It functions like a combination of **Facebook** (for social features) and **Google Drive** (for document management), with advanced filtering and search capabilities.

---

## 🎯 Project Purpose & Problem Solved

### Problem Statement
Students struggle to find quality study materials and course-specific documents. Traditional file-sharing methods are fragmented and lack:
- Centralized searchability
- Community engagement (likes, comments)
- Subject/category-based filtering
- Institution-specific resource discovery
- Social features for peer-to-peer learning

### Solution
DocuLink provides a **unified platform** where students can:
- 📤 Upload and share documents
- 🔍 Discover resources through advanced search and filtering
- 👥 Engage with the community (likes, comments, bookmarks)
- 🏫 Filter by university/institution
- 🏆 Help peers learn through collaborative sharing

---

## 🏗️ Technology Stack (What We Used)

### Frontend Layer
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with server-side rendering and API routes |
| **React 18** | Component-based UI library |
| **TypeScript** | Type-safe JavaScript for reliability |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Framer Motion** | Smooth animations and transitions |
| **Next-Themes** | Dark mode support |
| **Lucide React** | 500+ clean SVG icons |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Firebase Auth** | User authentication (email/password, Google OAuth) |
| **Firestore Database** | NoSQL database for documents, likes, comments, favorites |
| **Firebase Admin SDK** | Server-side backend operations |

### File Storage
| Technology | Purpose |
|------------|---------|
| **Cloudflare R2** | S3-compatible cloud storage for document files |
| **AWS SDK** | Interface with Cloudflare R2 using S3 protocol |

### Deployment & Tools
| Technology | Purpose |
|------------|---------|
| **Wrangler** | Cloudflare deployment CLI |
| **Jest & React Testing Library** | Unit and component testing |
| **Next.js API Routes** | Custom backend endpoints |

---

## 🏛️ Architecture Overview

### System Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend Application                      │  │
│  │  • Upload Page (Post)                              │  │
│  │  • Explore Page (Search & Filter)                  │  │
│  │  • Documents Page (List View)                      │  │
│  │  • Authentication Pages                            │  │
│  └────────────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────────┘
         │
         ├─────────────────┬──────────────────┬──────────────────┐
         │                 │                  │                  │
         ↓                 ↓                  ↓                  ↓
    ┌─────────┐      ┌──────────┐      ┌──────────┐      ┌─────────────┐
    │Firebase │      │Firestore │      │Cloudflare│      │Next.js API  │
    │  Auth   │      │  Database │      │   R2     │      │  Routes     │
    │         │      │           │      │ Storage  │      │ (/upload)   │
    │ • Users │      │ • Docs    │      │          │      │             │
    │ • Login │      │ • Likes   │      │ • Files  │      │ • Validates │
    │ • Roles │      │ • Comments│      │ • URLs   │      │ • Processes │
    │         │      │ • Favs    │      │          │      │ • Metadata  │
    └─────────┘      └──────────┘      └──────────┘      └─────────────┘
```

### Key Components Flow

```
1. USER REGISTRATION & LOGIN
   ├─ Sign up with email/password OR Google
   ├─ Firebase Auth validates credentials
   └─ Session maintained in browser

2. DOCUMENT UPLOAD PROCESS
   ├─ User selects file on /post page
   ├─ Fills: Title, Category, Subject, University, Description
   ├─ Submits to /api/upload route
   ├─ API validates file (size, type)
   ├─ Uploads to Cloudflare R2 storage
   ├─ Saves metadata to Firestore
   └─ Returns success & document ID

3. DOCUMENT DISCOVERY
   ├─ User visits /documents or /explore
   ├─ Fetches documents from Firestore
   ├─ Applies filters (category, university, type)
   ├─ Searches by title/keywords
   ├─ Displays results in grid/list format
   └─ Can download via R2 public URL

4. SOCIAL INTERACTIONS
   ├─ Like: Toggles in 'likes' collection
   ├─ Comment: Adds to 'comments' collection
   ├─ Favorite: Saves to 'favorites' collection
   └─ Counters updated in document metadata
```

---

## 📊 Database Schema (Firestore Collections)

### 1. **Documents Collection**
```typescript
documents/
├── {documentId} {
│   ├── title: string                    // "Java OOP Lecture Notes"
│   ├── description: string              // "Comprehensive notes on..."
│   ├── file_type: string                // "application/pdf"
│   ├── file_url: string                 // Cloudflare R2 public URL
│   ├── file_size: number                // In bytes
│   ├── category_id: number              // 1, 2, 3, etc.
│   ├── university: string               // "Royal University of Phnom Penh"
│   ├── user_id: string                  // Firebase UID of uploader
│   ├── user_email: string               // "student@example.com"
│   ├── status: string                   // "pending" | "approved" | "rejected"
│   ├── created_at: timestamp            // Auto-generated
│   ├── likes_count: number              // Cached for performance
│   ├── favorites_count: number          // Cached for performance
│   └── comments_count: number           // Cached for performance
│   }
```

### 2. **Likes Collection** (Social Engagement)
```typescript
likes/
├── {likeId} {
│   ├── document_id: string              // References documents/{id}
│   ├── user_id: string                  // Firebase UID of liker
│   └── created_at: timestamp
│   }
```

### 3. **Favorites Collection** (Bookmarks)
```typescript
favorites/
├── {favoriteId} {
│   ├── document_id: string              // References documents/{id}
│   ├── user_id: string                  // Only owner can see their favorites
│   └── created_at: timestamp
│   }
```

### 4. **Comments Collection** (Discussion)
```typescript
comments/
├── {commentId} {
│   ├── document_id: string              // References documents/{id}
│   ├── user_id: string                  // Firebase UID of commenter
│   ├── user_email: string               // Email of commenter
│   ├── user_name: string                // Display name
│   ├── content: string                  // Comment text (max 500 chars)
│   └── created_at: timestamp
│   }
```

### 5. **Categories Collection** (Resource Types)
```typescript
categories/
├── {catId} {
│   ├── id: number                       // 1, 2, 3, etc.
│   └── name: string                     // "Programming", "Business", etc.
│   }
```

### 6. **Profiles Collection** (User Info)
```typescript
profiles/
├── {userId} {
│   ├── email: string                    // Firebase email
│   ├── displayName: string              // User's chosen name
│   ├── role: string                     // "user" | "admin"
│   ├── university: string               // User's institution (optional)
│   ├── bio: string                      // User bio
│   └── avatar_url: string               // Profile picture URL
│   }
```

---

## 📱 Application Pages & Features

### 1. **Home Page** (`/`)
**Purpose:** Landing page showcasing the platform

**Features:**
- Hero section with call-to-action
- Featured categories section
- Testimonials from users
- Statistics (total documents, users, etc.)
- Navigation to other sections
- Responsive design with dark/light mode toggle

**Tech:** Next.js page, Tailwind CSS, Framer Motion animations

---

### 2. **Post Page** (`/post`) - UPLOAD & SHARE
**Purpose:** Facebook-like social feed for uploading documents

**Upload Form Inputs:**

| Field | Type | Required | Constraint |
|-------|------|----------|-----------|
| **Title** | Text | ✅ YES | Max 120 chars |
| **Description** | TextArea | ✅ YES | Max 500 chars |
| **File** | File Upload | ✅ YES | PDF, DOC, PPT, Images; Max 50MB |
| **Category** | Dropdown | ✅ YES | Programming, Business, Design, etc. |
| **Subject/Course** | Text | ✅ YES | "Data Structures", "Finance 101" |
| **University** | Text | ✅ YES | "Royal University of Phnom Penh" |
| **Difficulty Level** | Dropdown | ✅ YES | Beginner, Intermediate, Advanced |
| **Upload Type** | Radio | ✅ YES | Public (share with all) / Private |
| **Tags** | Text | ❌ NO | Keywords: "java, oop, coding" |

**Display Features:**
- **Feed Layout:** Facebook-style timeline sorted by newest first
- **Post Cards Show:**
  - Author name, avatar, university, timestamp
  - Document title and description
  - Category badge
  - File preview (for images & PDFs)
  - Like count, Comment count
- **Actions Available:**
  - ❤️ **Like** - Heart icon toggles like status
  - 💬 **Comment** - Expandable comments section
  - 📌 **Favorite** - Star icon to bookmark
  - 📥 **Download** - Get the file directly
- **Filters:**
  - Category filter (horizontal scrollable pills)
  - Resource type filter (Studies, Notes, Lectures, Practice, Exams)
  - Shows count per type

**Code Location:** [app/post/page.tsx](app/post/page.tsx)

---

### 3. **Explore Page** (`/documents` or `/explore`) - DISCOVER & FILTER
**Purpose:** Advanced search and filtering interface for discovering documents

**Search Features:**
- Keyword search by title
- Keyword search by subject
- Real-time filtering as you type

**Advanced Filters:**
```
┌─ Category Filter ─────────────────────┐
│  All | Programming | Business         │
│  Engineering | Design | Science | Arts│
└───────────────────────────────────────┘

┌─ Subject Filter ──────────────────────┐
│  All | Object-Oriented Programming    │
│  Data Structures | Database Design    │
│  Web Development | ... (50+ subjects) │
└───────────────────────────────────────┘

┌─ University Filter ──────────────────────┐
│  All | Royal University of Phnom Penh   │
│  Build Bright University | ... (20+)    │
└──────────────────────────────────────────┘

┌─ File Type Filter ────────────────────┐
│  All | PDF | DOCX | PPT | XLSX | PNG |
└───────────────────────────────────────┘
```

**Sorting Options:**
- 📅 **Newest** - Latest uploads first
- ❤️ **Most Liked** - Popular documents
- 📥 **Most Downloaded** - Useful resources

**View Modes:**
- **Grid View:** 3 columns (desktop), 2 (tablet), 1 (mobile)
- **List View:** Horizontal layout with detailed info

**Resource Cards Display:**
```
┌─────────────────────────────────┐
│ 📄 Java OOP Lecture             │  ← Title
│ Category: Programming | Level: ⭐⭐ │  ← Metadata
│                                 │
│ Subject: OOP                    │
│ Uploaded by: John Doe           │
│ From: Royal University          │
│                                 │
│ 👁️ 145 | ⬇️ 62 | ❤️ 28         │  ← Stats
│                                 │
│ [View] [Like] [Favorite]        │  ← Actions
└─────────────────────────────────┘
```

**Code Location:** [app/documents/page.tsx](app/documents/page.tsx)

---

### 4. **Authentication Pages**

#### Login (`/auth/login`)
- Email & password authentication
- Google OAuth integration
- Remember me option
- Forgot password (optional)
- Link to signup page
- Firebase Auth backend

#### Signup (`/auth/signup`)
- Email & password registration
- Password strength indicator
- Email verification
- Terms & conditions acceptance
- Automatic profile creation in Firestore
- Redirect to home after signup

**Tech:** Firebase Authentication with custom UI

---

### 5. **User Profile Page** (`/profile`)
**Features:**
- Display user information
- Upload history
- Saved favorites/bookmarks
- Comments history
- Edit profile option
- Settings menu

---

### 6. **Document Detail Page** (`/documents/[id]`)
**Features:**
- Full document preview (PDF viewer, Office Web Viewer)
- Document metadata
- Comments section
- Like & favorite options
- Download button
- Related documents suggestions
- Author information

---

### 7. **Admin Panel** (`/admin`)
**Admin-only features:**
- Pending documents list
- Approve/reject uploads
- Delete inappropriate content
- View statistics
- User management
- Category management

---

## 🔧 How File Upload Works (Step-by-Step)

### Upload Flow Architecture

```
USER ACTION: Click Upload on /post page
    ↓
1. USER SELECTS FILE & FILLS FORM
   ├─ Validates on frontend:
   │  ├─ File size ≤ 50MB ✓
   │  ├─ File type allowed ✓
   │  └─ All required fields filled ✓
   │
   └─ Shows file preview
    ↓
2. USER CLICKS "SUBMIT"
   └─ Creates FormData with:
      ├─ file: File object
      ├─ title: "Java Notes"
      ├─ category: "1"
      ├─ university: "Royal University"
      ├─ description: "..."
      └─ userId: Firebase UID
    ↓
3. SENT TO /api/upload ENDPOINT
   └─ POST request with:
      ├─ Headers: Content-Type: multipart/form-data
      ├─ CORS headers included
      └─ Credentials: Firebase token
    ↓
4. SERVER-SIDE VALIDATION (/api/upload/route.ts)
   ├─ Parse FormData
   ├─ Check required fields
   ├─ Validate file:
   │  ├─ Size check (50MB max)
   │  ├─ Type check (PDF, DOC, PPT, Images only)
   │  └─ Convert to Buffer
   │
   └─ All valid → Continue to upload
    ↓
5. UPLOAD TO CLOUDFLARE R2
   ├─ Generate unique key:
   │  └─ documents/{userId}/{timestamp}-{randomId}.{ext}
   │
   ├─ Create S3Client with R2 credentials:
   │  ├─ Endpoint: R2_S3_ENDPOINT
   │  ├─ Access Key: R2_S3_ACCESS_KEY_ID
   │  ├─ Secret: R2_S3_SECRET_ACCESS_KEY
   │  └─ Timeout: 120 seconds
   │
   └─ Execute PutObjectCommand:
      ├─ Bucket: "doculinks-documents"
      ├─ Key: document path
      ├─ Body: File buffer
      ├─ ContentType: file.type
      └─ Metadata: title, category, etc.
    ↓
6. GENERATE SIGNED URL
   ├─ Create GetObjectCommand with file key
   ├─ Generate signed URL using AWS SDK
   ├─ Expiry: 7 days (R2 maximum)
   └─ URL allows anyone to download
    ↓
7. SAVE METADATA TO FIRESTORE
   └─ Add document to collection:
      ├─ title, description, file_type
      ├─ category_id, university
      ├─ user_id, user_email
      ├─ file_url (signed URL from R2)
      ├─ file_size, status: "pending"
      ├─ likes_count: 0
      ├─ favorites_count: 0
      ├─ comments_count: 0
      └─ created_at: timestamp
    ↓
8. RETURN SUCCESS RESPONSE
   {
     success: true,
     fileName: "notes.pdf",
     fileSize: 2097152,
     fileType: "application/pdf",
     objectKey: "documents/user123/1705...-abc.pdf",
     publicUrl: "https://8089ae...r2.cloudflarestorage.com/...",
     documentId: "doc_xyz789",
     message: "File uploaded successfully"
   }
    ↓
9. FRONTEND UPDATES
   ├─ Close upload modal
   ├─ Show success toast notification
   ├─ Refresh feed
   └─ Document appears as "pending" (awaiting admin approval)
```

### Code Example: [app/api/upload/route.ts](app/api/upload/route.ts)

**Key Code Sections:**

```typescript
// 1. Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_S3_SECRET_ACCESS_KEY || "",
  },
  requestHandler: {
    requestTimeout: 120000, // 2 minutes
  },
  maxAttempts: 3, // Retry up to 3 times
});

// 2. Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 3. Handle file upload
export async function POST(request: NextRequest) {
  // Parse form data
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  // ... validation ...
  
  // Generate unique filename
  const key = `documents/${userId}/${timestamp}-${randomId}.${fileExtension}`;
  
  // Upload to R2
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    Metadata: { title, category, university }
  }));
  
  // Generate signed URL
  const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 604800 // 7 days
  });
  
  // Save to Firestore
  const docRef = await db.collection("documents").add({
    title, description, category_id,
    user_id, user_email,
    file_url: signedUrl,
    status: "pending",
    created_at: new Date()
  });
  
  return NextResponse.json({ success: true, documentId: docRef.id });
}
```

---

## 🔐 Security Features

### Authentication & Authorization

```
┌─ User Registration ────────┐
│                             │
│ Email + Password            │
│ ↓ (Firebase Auth)           │
│ UID generated               │
│ Profile created in Firestore
│ (role: "user")              │
└─────────────────────────────┘

┌─ Role-Based Access ────────┐
│                             │
│ Profiles.role:              │
│ • "user" → Regular access   │
│ • "admin" → Full control    │
│                             │
│ Admin privileges:           │
│ • Approve documents         │
│ • Delete content            │
│ • Manage categories         │
│ • View statistics           │
└─────────────────────────────┘
```

### File Security

```
✅ File Size Limit
   - Maximum 50MB per file
   - Prevents abuse & storage overflow

✅ File Type Whitelist
   - Allowed: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG
   - Blocks: .exe, .bat, .zip, .js, etc.

✅ Secure Storage Path
   - documents/{userId}/{timestamp}-{randomId}.{ext}
   - Prevents directory traversal attacks

✅ Signed URLs
   - Time-limited (7 days expiry)
   - Only authorized users can generate
   - File accessible via public but time-limited URL

✅ CORS Protection
   - Only specific origins can upload
   - Prevents unauthorized cross-origin requests

✅ Firestore Rules
   - Documents readable if status="approved"
   - Only owner can edit/delete own documents
   - Admins can override permissions
```

### API Security

```
✅ Environment Variables
   - Credentials never exposed in code
   - Server-side only (Firebase Admin SDK)
   - Frontend only gets public config

✅ Request Validation
   - Required fields checked
   - File size validated before upload
   - User authentication required

✅ Error Handling
   - Generic error messages to users
   - Detailed logs on server
   - No sensitive data leaked
```

---

## 🚀 Key Features Explained

### 1. **Multi-Language Support** 🌐
- **Supported Languages:** English, Khmer (Cambodian)
- **Implementation:** Context API + translation JSON
- **Components:** LanguageSwitcher, LanguageContext
- **Usage:** `const { t } = useLanguage()` → `t('key')`

```typescript
// Example translations
{
  "en": { "home": "Home", "explore": "Explore", "post": "Post" },
  "kh": { "home": "ទំព័រដើម", "explore": "រកមើល", "post": "ផ្សាយ" }
}
```

### 2. **Dark Mode Support** 🌙
- **Implementation:** next-themes library
- **Storage:** localStorage (persists choice)
- **Components:** ThemeToggle, ThemeProvider
- **Tailwind Integration:** Uses `dark:` prefix for dark styles

```tsx
<button className="bg-white dark:bg-slate-900">
  // White in light mode, dark gray in dark mode
</button>
```

### 3. **Real-Time Search & Filtering** 🔍
- **Search by:** Title, Subject, Keywords
- **Filters:** Category, University, File Type, Difficulty Level
- **Implementation:** useState + useEffect for real-time updates
- **Performance:** Debounced search queries

```tsx
const [searchTerm, setSearchTerm] = useState('');
const filtered = documents.filter(doc =>
  doc.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 4. **Social Features** 👥

#### Likes System
```typescript
// User likes a document
const like = {
  document_id: "doc123",
  user_id: "user456",
  created_at: timestamp
}
// Added to 'likes' collection
// likes_count incremented in documents
```

#### Comments System
```typescript
// User comments on a document
const comment = {
  document_id: "doc123",
  user_id: "user456",
  user_email: "user@example.com",
  content: "Great notes!",
  created_at: timestamp
}
// Added to 'comments' collection
```

#### Favorites/Bookmarks
```typescript
// User saves document
const favorite = {
  document_id: "doc123",
  user_id: "user456",
  created_at: timestamp
}
// Private to user, used for "My Favorites" section
```

### 5. **Responsive Design** 📱

```
Desktop (1024px+):     Tablet (768px-1023px):   Mobile (<768px):
┌────────────────┐     ┌──────────────┐         ┌────────┐
│  Logo  Nav Btn │     │Logo  Nav     │         │Logo    │
├────────────────┤     ├──────────────┤         ├────────┤
│  3-column grid │     │ 2-col grid   │         │1 col   │
│  sidebar       │     │  compact     │         │stack   │
├────────────────┤     ├──────────────┤         ├────────┤
│ Filters        │     │ Filters      │         │Filters │
└────────────────┘     └──────────────┘         └────────┘
```

### 6. **Admin Approval System** ✅

```
WORKFLOW:
User uploads document
        ↓
Status set to "pending"
        ↓
Document hidden from public (only author sees)
        ↓
Admin reviews in /admin panel
        ↓
├─ APPROVE → Status="approved" → Visible to all
├─ REJECT  → Status="rejected" → Hidden + notification
└─ DELETE  → Removed from database + R2
```

---

## 📊 Performance Optimizations

### 1. **Image Optimization**
- Next.js Image component (lazy loading)
- Automatic format conversion (WebP)
- Responsive image sizes

### 2. **Code Splitting**
- Dynamic imports for heavy components
- Route-based code splitting (automatic in Next.js)
- Reduced initial bundle size

### 3. **Caching Strategy**
- Document counts cached in Firestore
- User data cached in browser localStorage
- Categories fetched once and cached

### 4. **Database Optimization**
- Firestore indexes on frequently queried fields
- Denormalized data (likes_count in documents)
- Subcollections for related data

---

## 🎨 UI/UX Design Highlights

### Color Scheme
```
Primary: Indigo (#4F46E5) - Main CTA, active states
Secondary: Purple (#A855F7) - Accents, gradients
Success: Green (#10B981) - Approvals, positive actions
Error: Red (#EF4444) - Rejections, warnings
Neutral: Slate (#64748B) - Text, backgrounds
```

### Typography
- **Display Font:** Battambang (Khmer support)
- **Body Font:** Hanuman (Khmer support)
- **Fallback:** System sans-serif

### Animation Patterns
- Framer Motion for smooth transitions
- Hover effects on interactive elements
- Fade-in animations for modals
- Loading skeletons during data fetch

---

## 📈 Current Status & Deployment

### ✅ Completed Features
- [x] User authentication (Firebase Auth)
- [x] Document upload to Cloudflare R2
- [x] Metadata storage in Firestore
- [x] Post page (Facebook-like feed)
- [x] Explore page (advanced filtering)
- [x] Like, Comment, Favorite features
- [x] Admin approval system
- [x] Dark mode support
- [x] Multi-language support (EN, KH)
- [x] Responsive design
- [x] CORS protection

### 🚀 Deployment
- **Frontend:** Deployed via Cloudflare Pages/Vercel
- **Database:** Firebase Firestore (hosted)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Functions:** Next.js API routes (serverless)

---

## 💡 How to Demo This Project

### Demo Script (5-7 minutes)

**1. Show Homepage (30 seconds)**
- Highlight hero section with CTA
- Show dark mode toggle (top-right)
- Show language switcher (EN ↔ KH)
- Navigation menu overview

**2. User Authentication (1 minute)**
- Click "Sign Up"
- Create account with email/password
- Show automated profile creation
- Log in with same credentials
- Show navbar changes (user menu appears)

**3. Document Upload (1 minute)**
- Go to "Post" page
- Click "Upload" button
- Fill form:
  - Title: "Java OOP Lecture Notes"
  - Category: Programming
  - University: "Royal University of Phnom Penh"
  - Description: "Comprehensive notes..."
  - Select PDF file
- Click Submit
- Show success toast message
- Show document appearing in feed as "pending"

**4. Admin Approval (1 minute)**
- Go to Admin panel (/admin)
- Show pending documents list
- Click "Approve" on the uploaded document
- Show status change to "approved"
- Return to /explore → Document now visible to public

**5. Document Discovery (2 minutes)**
- Go to "Explore" page
- Show search bar (search by title)
- Apply filters:
  - Filter by Category: "Programming"
  - Filter by University: "Royal University"
  - Filter by File Type: "PDF"
- Show filtered results
- Switch between Grid and List view
- Click on a document to see details

**6. Social Features (1 minute)**
- Like a document → Show heart animation
- Add a comment → Show comment in list
- Star a document to bookmark → Show favorite list
- Show statistics updating (like count, comment count)

**7. Dark Mode (30 seconds)**
- Toggle dark mode using moon icon
- Show interface theme changes
- Show it persists on page refresh

---

## 🔄 Technologies in Action

### Complete Request-Response Cycle

```
CLIENT:
┌────────────────────────────────┐
│ React Component (post/page.tsx)│
│                                 │
│ User: fills form & clicks POST │
└─────────┬──────────────────────┘
          │ FormData object
          ↓
NETWORK:
┌────────────────────────────────┐
│ HTTP POST /api/upload           │
│ multipart/form-data             │
│ (file + metadata)               │
└─────────┬──────────────────────┘
          │
SERVER:
┌────────────────────────────────┐
│ Next.js API Route               │
│ (/app/api/upload/route.ts)      │
│                                 │
│ 1. Parse FormData               │
│ 2. Validate file & inputs       │
│ 3. Upload to R2 via AWS SDK     │
│ 4. Get signed URL               │
│ 5. Save to Firestore            │
└─────────┬──────────────────────┘
          │
CLOUD STORAGE:
┌────────────────────────────────┐
│ Cloudflare R2                   │
│ └─ documents/{id}/file.pdf      │
│                                 │
│ Firestore                       │
│ └─ documents/{id} {metadata}    │
└────────────────────────────────┘

RESPONSE BACK:
┌────────────────────────────────┐
│ {                               │
│   success: true,                │
│   documentId: "abc123",          │
│   publicUrl: "https://..."      │
│ }                               │
└─────────┬──────────────────────┘
          │
CLIENT UPDATES:
┌────────────────────────────────┐
│ Close modal                     │
│ Show success toast              │
│ Refresh feed                    │
│ Document visible in feed        │
└────────────────────────────────┘
```

---

## 🎓 Learning Outcomes

### What This Project Demonstrates

1. **Full-Stack Development**
   - Frontend (React, Next.js, TypeScript)
   - Backend (Firebase, API Routes)
   - Database design (Firestore collections)

2. **Cloud Services Integration**
   - Firebase Authentication
   - Firestore NoSQL database
   - Cloudflare R2 object storage
   - AWS SDK for S3-compatible storage

3. **Modern Web Technologies**
   - Server-side rendering (SSR)
   - API route handlers
   - Real-time data fetching
   - File upload handling

4. **Software Engineering Practices**
   - Secure credential management
   - Input validation
   - Error handling
   - CORS security
   - Database design patterns

5. **User Experience Design**
   - Responsive design
   - Dark mode support
   - Internationalization
   - Accessible UI components

---

## 📚 Project Structure Reference

```
DocuLinks-PP/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout with providers
│   ├── post/page.tsx            # Upload & social feed
│   ├── explore/page.tsx         # Search & filter interface
│   ├── documents/
│   │   ├── page.tsx            # Documents list
│   │   └── [id]/page.tsx       # Document detail
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── profile/page.tsx
│   ├── admin/page.tsx
│   └── api/upload/route.ts      # 🔑 FILE UPLOAD ENDPOINT
│
├── components/                   # Reusable React components
│   ├── Navbar.tsx              # Navigation header
│   ├── DocumentCard.tsx         # Reusable doc card
│   ├── LikeButton.tsx          # Like interaction
│   ├── FavoriteButton.tsx      # Bookmark feature
│   ├── CommentList.tsx         # Comments display
│   └── sections/               # Homepage sections
│       ├── HeroSection.tsx
│       ├── CategoriesSection.tsx
│       └── ...
│
├── lib/                         # Utility functions & configs
│   ├── firebaseConfig.ts       # Firebase setup
│   ├── firebaseAdmin.ts        # Admin SDK
│   ├── cloudflareUpload.ts     # R2 upload helper
│   └── helpers.ts              # Utility functions
│
├── contexts/                    # React Context providers
│   ├── LanguageContext.tsx     # i18n
│   ├── ThemeContext.tsx        # Dark mode
│   ├── UserRoleContext.tsx     # Role management
│   └── ToastContext.tsx        # Notifications
│
├── styles/                      # CSS
│   └── globals.css             # Tailwind styles
│
├── public/                      # Static assets
│   └── images/
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    ├── firebase.json
    └── .env.local               # Secrets (not in git)
```

---

## ✨ Key Takeaways for Lecturer

### Complexity Level: **ADVANCED** ⭐⭐⭐⭐⭐

This project demonstrates:
- ✅ Full-stack development with modern frameworks
- ✅ Cloud services integration (3 different platforms)
- ✅ Database design and security
- ✅ Real-time data synchronization
- ✅ File handling and storage
- ✅ Authentication & authorization
- ✅ API design and implementation
- ✅ Responsive & accessible UI
- ✅ Scalable architecture

### Production-Ready Features:
- ✅ Security measures (CORS, validation, signed URLs)
- ✅ Error handling
- ✅ Performance optimization
- ✅ User feedback (toasts, loading states)
- ✅ Admin controls
- ✅ Internationalization
- ✅ Dark mode
- ✅ Mobile responsive

---

## 🎯 Quick Demo Checklist

- [ ] Show homepage with dark/light mode toggle
- [ ] Sign up new account → auto profile creation
- [ ] Upload a PDF document with all metadata
- [ ] View document in pending state
- [ ] Approve document as admin
- [ ] View in Explore with filters
- [ ] Like, comment, favorite a document
- [ ] Search by keywords
- [ ] Filter by university & category
- [ ] Switch between grid/list view
- [ ] Show dark mode persistence
- [ ] Toggle language (EN ↔ KH)

---

**Ready to impress your lecturer!** 🚀
