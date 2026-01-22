# 📘 DocuLink - Complete Feature & Process Documentation

## 🎯 Project Overview

DocuLink is a **document-sharing web application** built with Next.js, TypeScript, Tailwind CSS, and Supabase. It allows students and educators to share, discover, and collaborate on learning resources with advanced search, filtering, and community features.

---

## 📑 Table of Contents

1. [Core Architecture](#core-architecture)
2. [Post Page - Share & Discuss](#post-page---share--discuss)
3. [Explore Page - Discover & Download](#explore-page---discover--download)
4. [Data Structure](#data-structure)
5. [Key Features](#key-features)
6. [User Workflows](#user-workflows)
7. [Technical Implementation](#technical-implementation)

---

## 🏗️ Core Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion animations
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **State Management**: React Hooks (useState, useEffect)
- **Theme**: Next-Themes (Dark/Light mode)

### Project Structure
```
app/
├── post/
│   └── page.tsx          # Share & discuss resources (Facebook-like)
├── explore/
│   └── page.tsx          # Discover & filter resources (Grid/List view)
├── documents/
│   ├── page.tsx          # Document list view
│   └── [id]/
│       └── page.tsx      # Individual document detail
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
└── profile/
    └── page.tsx

components/
├── Navbar.tsx
├── Filters.tsx
├── DocumentCard.tsx
├── LikeButton.tsx
├── FavoriteButton.tsx
└── CommentList.tsx

lib/
├── supabaseClient.ts
├── firebaseConfig.ts
└── helpers.ts
```

---

## 📤 POST PAGE - Share & Discuss Resources

### Purpose
Upload and share learning resources with the community. **Focus: Contribution & Discussion**

### Access Point
`/app/post`

### Required Inputs (Mandatory Fields)

When uploading a resource, users must provide:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Title** | Text (max 120 chars) | Resource name | "Java OOP Lecture Notes" |
| **Description** | TextArea (max 500 chars) | What the resource contains | "Comprehensive lecture notes covering..." |
| **File** | File Upload | PDF, PPT, DOC, Images | student_notes.pdf |
| **Category** | Dropdown | Resource type from database | Programming, Business, Design |
| **Subject/Course** | Text | Specific subject name | "Object-Oriented Programming" |
| **University Name** | Text | ✅ **Key requirement** | "Royal University of Phnom Penh" |
| **Difficulty Level** | Dropdown | Beginner/Intermediate/Advanced | Intermediate |
| **Upload Type** | Checkbox | Public/Private visibility | Public |
| **Tags** | Comma-separated text | Keywords for search | "java, oop, programming" |

### Optional Fields
- **Tags/Keywords** - For better searchability
- **Upload Type** - Defaults to Public

### Auto-Generated Fields
- **Upload Date** - Current timestamp
- **Uploader Info** - Current user info
- **Status** - Pending (awaiting admin approval)

### Feature Implementation

#### 1. **Create Post Modal**
```
Location: Full-screen modal overlay
Components:
  - File input with drag-drop preview
  - Form sections (organized by category)
  - Character counters
  - Success/Error messages
  - Submit & Reset buttons
```

#### 2. **Feed-Style Layout**
```
- Timeline-like display (similar to Facebook)
- Posts sorted by NEWEST FIRST
- Horizontal scroll for resource types
- Grouped by resource type when filtered
```

#### 3. **Post Card Display**
Each post shows:
- **Header**: Author avatar, name, category badge, university, timestamp
- **Content**: Description text with "View More" option
- **Attachments**: File previews (PDF, Images, Links)
- **Stats**: Like count, comment count
- **Actions**: Like, Comment, Favorite/Bookmark

#### 4. **Interactions**
Users can:
- ❤️ **Like** posts (toggles like status)
- 💬 **Comment** - View/add comments (comments section expandable)
- 📌 **Bookmark/Favorite** - Save for later
- 📥 **Download** - Get the file directly

### Categories Filter
- All
- Programming
- Business
- Engineering
- Design
- Science
- Arts

### Resource Type Filter
Organized by:
- 📚 **All** - View all resources
- 📄 **Study Documents** - Course materials
- 📝 **Notes** - Lecture/study notes
- 🎓 **Lectures** - Video lectures or presentations
- ✏️ **Practice** - Exercises and practice problems
- 📋 **Exams** - Past exams and test papers

### Data Structure

```typescript
interface Post {
  id: string
  title: string
  description: string
  category: string              // From database
  subject: string               // Course name
  university: string            // ✅ KEY FIELD
  fileType: string              // PDF, DOCX, PPT, etc.
  fileUrl: string               // Storage path
  fileName: string              // Original filename
  uploadType: 'public' | 'private'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]                // Comma-separated keywords
  
  uploader: {
    id: string                  // User ID
    name: string                // Username
    avatar?: string             // Profile picture
  }
  
  uploadDate: string            // ISO timestamp
  status: 'pending' | 'approved' | 'rejected'
  
  likes: number
  comments: Comment[]
  isLiked: boolean
  isFavorited: boolean
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  timestamp: string
}
```

---

## 🔍 EXPLORE PAGE - Discover & Filter Resources

### Purpose
Find and download learning resources efficiently. **Focus: Discovery & Usage**

### Access Point
`/app/explore`

### Display Information (Read-Only)

Resources shown here come from **Post page uploads**, but displayed differently for search/discovery purposes.

Each resource card shows:
- **Title** - Resource name
- **Category** - Subject type
- **Subject** - Specific course/topic
- **University Name** ✅ - Which institution it's from
- **File Type** - PDF, DOCX, PPT, etc.
- **Likes Count** - How many people liked it
- **Downloads Count** - How many times downloaded
- **Views Count** - How many times viewed

### Advanced Search & Filter Requirements

Users can filter by:

#### 1. **Keyword Search**
- Search by title or subject
- Real-time search as you type

#### 2. **Category Filter**
Dropdown with options:
- All
- Programming
- Business
- Engineering
- Design
- Science
- Arts

#### 3. **Subject Filter**
Dropdown with all available subjects:
- Object-Oriented Programming
- Data Science
- Management
- Web Development
- Marketing
- Materials Engineering
- User Interface Design
- Databases
- Finance
- Structural Engineering
- Graphic Design
- Artificial Intelligence
- etc.

#### 4. **University Name Filter** ✅
**This is a key requirement** - Filter by institution:
- All
- Royal University of Phnom Penh
- Institute of Technology
- Commerce University
- Tech Academy
- Engineering Institute
- Creative School
- etc.

#### 5. **File Type Filter**
- All
- PDF
- DOCX
- PPT
- XLSX
- PNG
- JPG

#### 6. **Sort Options**
- **Newest** - Recently uploaded first
- **Most Liked** - Popular resources first
- **Most Downloaded** - Most useful/downloaded first

### View Modes

#### 1. **Grid View** (Default)
```
- Card layout (3 columns on desktop)
- Large preview area
- Stats displayed prominently
- Action buttons below stats
```

#### 2. **List View**
```
- Horizontal layout
- File icon on left
- Info on right with metadata
- Compact action buttons
```

### Interactions in Explore

Users can:
- ❤️ **Like** - Mark resource as liked
- 📥 **Download** - Get file directly
- 📌 **Save to Favorites** - Bookmark for later
- 👁️ **View/Preview** - See document in viewer

### Advanced Filter UI

```
Collapsible filter panel with:
- Category dropdown (4 columns grid)
- Subject dropdown
- University dropdown
- File Type dropdown
- "Clear Filters" button to reset all

Displays:
- "Found X resources" counter
- Real-time results update
- "No results found" message if empty
```

### Data Structure (Same as Post)

```typescript
interface Resource {
  id: string
  title: string
  category: string
  subject: string
  university: string           // ✅ KEY FOR FILTERING
  fileType: string
  likes: number
  downloads: number
  views: number
  uploadDate: string
  fileName: string
  isLiked: boolean
  isFavorited: boolean
}
```

---

## 📊 Data Structure

### Complete Resource Schema

```typescript
interface DocumentResource {
  id: string                   // Unique identifier
  
  // Basic Info
  title: string               // Max 120 characters
  description: string         // Max 500 characters
  category_id: number         // Foreign key to categories table
  category_name: string       // Display name
  
  // Classification
  subject: string             // E.g., "Object-Oriented Programming"
  university: string          // E.g., "Royal University of Phnom Penh"
  level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]              // Comma-separated keywords
  
  // File Info
  file_path: string           // Supabase storage path
  file_type: string           // Mime type
  file_name: string           // Original filename
  
  // Upload Info
  user_id: string             // Uploader user ID
  uploaded_by: string         // Uploader name
  upload_date: string         // ISO timestamp
  status: 'pending' | 'approved' | 'rejected'
  is_public: boolean          // Public/Private
  
  // Engagement
  likes: number               // Like count
  downloads: number           // Download count
  views: number               // View count
  comments: Comment[]         // Array of comments
  
  // Flags
  is_liked: boolean           // Current user like status
  is_favorited: boolean       // Current user favorite status
}
```

---

## 🎯 Key Features

### 1. **Authentication & User Management**
- ✅ Sign up / Login (Email & Password)
- ✅ Google OAuth (optional)
- ✅ Role-based access (Admin, User)
- ✅ Profile management

### 2. **File Upload & Storage**
- ✅ Supports: PDF, PPT, DOC/DOCX, Images (PNG, JPG)
- ✅ File validation before upload
- ✅ Cloud storage via Supabase
- ✅ Storage path: `documents/{userId}/{uuid}.{extension}`

### 3. **Search & Discovery**
- ✅ Full-text search across titles and subjects
- ✅ Advanced multi-level filtering
- ✅ Multiple sort options
- ✅ Real-time result updates

### 4. **Community Features**
- ✅ Like/Unlike resources
- ✅ Save to Favorites/Bookmarks
- ✅ Comment on resources
- ✅ View engagement stats (likes, downloads, views)

### 5. **Admin Panel** (In progress)
- ✅ Approve/Reject uploads
- ✅ Delete inappropriate content
- ✅ View analytics
- ✅ Manage categories

### 6. **UI/UX Features**
- ✅ Dark/Light theme toggle
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Smooth animations (Framer Motion)
- ✅ Loading states
- ✅ Error handling & user feedback
- ✅ Khmer language support

### 7. **Data & Analytics**
- ✅ Track views per resource
- ✅ Count downloads
- ✅ Engagement metrics (likes, comments)
- ✅ User activity tracking

---

## 👥 User Workflows

### Workflow 1: Uploading a Resource (Post Page)

```
1. User clicks "+ Create" button
2. Modal opens with upload form
3. User fills in required fields:
   - Title (auto-suggested from file?)
   - Description
   - Select Category
   - Enter Subject/Course
   - Enter University Name ✅
   - Select Difficulty Level
   - Upload file (drag-drop or click)
   - Add Tags
   - Choose Public/Private
4. Click "Share" button
5. File uploads to Supabase Storage
6. Database record created with "pending" status
7. User gets success message
8. Post appears in their history
9. Admin reviews and approves
10. Post becomes visible in Post & Explore pages
```

### Workflow 2: Discovering Resources (Explore Page)

```
1. User opens Explore page
2. See grid/list of all approved resources
3. Optional: Click filter button to expand filters
4. Select filters:
   - Search by keyword
   - Select Category
   - Select Subject
   - Select University (KEY)
   - Select File Type
   - Choose sort option
5. Results update in real-time
6. Click on resource card
7. See full details & stats
8. Can Like, Download, or Bookmark
9. Download triggers file retrieval
```

### Workflow 3: Browsing Feed (Post Page)

```
1. User opens Post page
2. See recent uploads in timeline
3. Optionally filter by:
   - Category
   - Resource Type
4. See posts organized by type
5. Can Like, Comment, or Bookmark
6. Expand comment section to add comments
7. Click on attachments to preview/download
```

### Workflow 4: Admin Review (Admin Panel)

```
1. Admin logs in
2. Go to Admin Panel
3. See pending uploads
4. Review each document:
   - Check metadata
   - Check file is appropriate
5. Click Approve/Reject
6. If rejected: Send reason to uploader
7. If approved: Post appears in public feeds
```

---

## 🔧 Technical Implementation

### Frontend Components

#### 1. **Post Page (`/app/post/page.tsx`)**
```
Key Components:
- CreatePostCard: Upload trigger
- CategoryFilter: Filter by category
- ResourceTypeFilter: Filter by resource type
- PostCard: Individual post display
- CommentSection: Comments UI
- CreatePostModal: Form for upload

State Management:
- posts: Post[]
- selectedCategory: string
- selectedResourceType: string
- showCreateModal: boolean
- formData: (title, description, file, etc.)

Functions:
- handleCreatePost(): Upload handler
- handleLike(): Like toggle
- handleFavorite(): Bookmark toggle
- resetForm(): Clear form
```

#### 2. **Explore Page (`/app/explore/page.tsx`)**
```
Key Components:
- SearchBar: Keyword search
- AdvancedFilters: Multi-level filtering
- ViewToggle: Grid/List switch
- ResourceCard: Display resource
- SortDropdown: Sort options

State Management:
- resources: Resource[]
- filters: {
    searchTerm, category, university, 
    subject, fileType, sortBy
  }
- viewMode: 'grid' | 'list'
- showFilters: boolean

Functions:
- filteredAndSortedResources: useMemo()
- handleLike(): Like toggle
- handleFavorite(): Bookmark toggle
- handleDownload(): Download file
```

### Supabase Tables

#### `documents` Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title VARCHAR(120) NOT NULL,
  description TEXT(500),
  category_id INTEGER REFERENCES categories,
  subject VARCHAR(100),
  university VARCHAR(150),
  level VARCHAR(20),           -- beginner, intermediate, advanced
  file_path VARCHAR NOT NULL,  -- Supabase storage path
  file_type VARCHAR,           -- MIME type
  status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected
  is_public BOOLEAN DEFAULT true,
  tags TEXT,                   -- Comma-separated
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories` Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `comments` Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents,
  user_id UUID REFERENCES auth.users,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints (Supabase)

#### Upload Document
```javascript
POST /documents
Body: {
  title, description, category_id, 
  subject, university, level, 
  file_path, file_type, tags
}
Response: { id, status: "pending" }
```

#### Get Resources (Search & Filter)
```javascript
GET /documents?
  &category_id=X
  &subject=X
  &university=X
  &file_type=X
  &sort=newest|mostLiked|mostDownloaded
Response: { data: Resource[], count }
```

#### Like Resource
```javascript
POST /documents/{id}/like
Response: { likes_count }
```

#### Download File
```javascript
GET /storage/v1/object/public/documents/{path}
Response: File binary
```

### Authentication Flow

```
1. User signs up → Supabase Auth
2. Auth token stored in browser
3. All API calls include token in header
4. Supabase RLS policies enforce user access
5. Admin check: `SELECT role FROM profiles WHERE user_id = X`
6. Document status affects visibility
```

### File Upload Flow

```
1. File selected in form
2. Validation: File type & size
3. Generate unique path: documents/{userId}/{uuid}.{ext}
4. Upload to Supabase Storage
5. On success: Insert document record
6. On error: Show error message
7. Return document ID for frontend
```

---

## 🔑 Key Design Decisions

### 1. **University Name Field ✅**
**Why important?**
- Helps students find resources from their own institution
- Improves search accuracy
- Adds academic credibility
- Easy filtering by university

### 2. **Post vs Explore Distinction**
- **Post**: Community-focused, discussion-oriented, feed-like
- **Explore**: Discovery-focused, search/filter-heavy, catalog-like
- Same data, different presentation

### 3. **Status-Based Visibility**
- Pending: Only visible to uploader
- Approved: Visible in all public pages
- Rejected: Archived, not visible

### 4. **Resource Types Categorization**
- Helps organize resources by use case
- Enables quick browsing of specific types
- Improves discoverability

### 5. **Multi-Level Filtering**
- Allows power users to narrow results
- Improves UX for large datasets
- Enables precise resource discovery

---

## 📱 Responsive Design

### Desktop (1024px+)
- 3-column grid for resources
- Full filter panel visible
- Sidebar navigation
- Large preview areas

### Tablet (768px - 1023px)
- 2-column grid
- Stacked filter sections
- Compact navigation
- Medium previews

### Mobile (< 768px)
- 1-column layout
- Collapsible filters
- Bottom navigation
- Full-width cards
- Touch-optimized buttons

---

## 🎨 Theme Support

### Dark Mode (`theme === 'dark'`)
- Slate-900 background
- Slate-800 cards
- Slate-700 borders
- Light text colors

### Light Mode (`theme === 'light'`)
- Slate-100 background
- White cards
- Slate-200 borders
- Dark text colors

---

## 📈 Future Enhancements

1. **Advanced Analytics Dashboard**
   - Resource popularity trends
   - User engagement metrics
   - Category statistics

2. **Recommendation Engine**
   - "Similar resources" suggestions
   - Personalized feed based on interests
   - Trending resources

3. **Social Features**
   - Follow users
   - User profiles with portfolios
   - Resource collections/playlists

4. **Collaboration Features**
   - Edit resources together
   - Version control for documents
   - Shared workspaces

5. **Content Review System**
   - Peer review/rating
   - Quality badges
   - Accuracy verification

6. **Advanced Search**
   - Full-text search within documents
   - OCR for scanned documents
   - AI-powered recommendations

---

## 🚀 Deployment

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
```

### Build & Deploy
```bash
npm run build      # Build for production
npm run start      # Start production server
npm run dev        # Development server
```

---

## 📝 Summary

**DocuLink** provides a complete document-sharing ecosystem where:

- **Post Page** = Share & discuss (Facebook-like community)
- **Explore Page** = Discover & filter (Catalog with advanced search)
- **Same Data** = Different contexts & presentations
- **University Focus** = Key identifying field for all resources
- **Community-Driven** = Like, comment, and bookmark features
- **Admin-Moderated** = Quality control via approval workflow

This design enables students and educators to efficiently share knowledge while maintaining quality and discoverability.

---

## 📞 Support & Contribution

For questions or contributions:
1. Check existing documentation
2. Review code comments
3. Follow the coding standards
4. Submit PRs with clear descriptions

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
**Status**: In Development
