# Fix Negative Counts in Firestore

## Problem
Some documents show "-1" for favorites/likes/comments counts.

## Root Cause
The `increment(-1)` operation in Firestore can make counts go negative if they're already 0.

## Solution Implemented

### 1. Prevention (Code Changes)
- ✅ `getApprovedDocuments()` now uses `Math.max(0, ...)` to ensure counts are never negative when loading
- ✅ `removeLike()`, `removeFavorite()`, `deleteComment()` now check current count before decrementing
- ✅ Only decrement if count > 0

### 2. Fix Existing Data

#### Option A: Manual Fix in Firebase Console
1. Go to Firebase Console → Firestore Database
2. Find documents with negative counts
3. Manually set `likes_count`, `favorites_count`, `comments_count` to `0`

#### Option B: Run Fix Script
```bash
# In your Firebase Functions or admin environment
node scripts/fix-negative-counts.js
```

#### Option C: Simple Client-Side Fix
Add this to your app temporarily to auto-fix on load:

```typescript
// In lib/firestoreHelpers.ts - add to getApprovedDocuments
// Already implemented! Just refresh the page.
```

## Testing
1. Refresh the Explore page
2. Check that all counts show 0 or positive numbers
3. Test like/favorite/comment toggle - counts should never go below 0

## Prevention Going Forward
The code now prevents:
- ❌ Decrementing below 0
- ❌ Loading negative values from Firestore
- ✅ All counts are clamped to minimum 0
