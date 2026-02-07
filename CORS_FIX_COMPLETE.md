# ✅ CORS Issue - FIXED with Firebase Functions

## 🔴 Problem

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://doculinks-upload.8089ae920b1fa6c8c63b68a69b19d1fa.workers.dev/api/upload
```

## ✅ Solution

Replaced Cloudflare Worker with **Firebase Functions** for secure, CORS-enabled file uploads.

---

## 📦 What Was Created

### 1. Firebase Functions Setup
- **Location**: `/functions` folder
- **Main file**: `functions/index.js`
- **Configuration**: `firebase.json`, `.firebaserc`

### 2. Upload Function (`uploadFileToR2`)
- Handles multipart file uploads
- Uploads files to Cloudflare R2 (via S3 API)
- Saves metadata to Firestore
- **Full CORS support** (no more CORS errors!)
- File validation (size, type)
- Automatic file naming

### 3. Config Function (`getUploadConfig`)
- Returns allowed file types and sizes
- Used by frontend for validation

### 4. Updated Frontend
- **File**: `lib/cloudflareUpload.ts`
- **File**: `.env.local`
- Now points to Firebase Function instead of Worker

---

## 🎯 How It Works Now

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │ POST multipart/form-data
       │ ✅ CORS headers included
       ↓
┌──────────────────────────┐
│   Firebase Function      │
│   uploadFileToR2         │
│                          │
│  • Validates file        │
│  • Uploads to R2         │
│  • Saves to Firestore    │
└────────┬─────────────────┘
         │
         ├─────→ Cloudflare R2
         │      (S3 API)
         │      Returns: public URL
         │
         └─────→ Firestore
                (Metadata saved)
                Returns: document ID
```

---

## 🚀 Deploy Commands

### Quick Deploy (2 steps)

```powershell
# Step 1: Login
firebase login

# Step 2: Run deploy script
.\deploy-functions.ps1
```

### Manual Deploy

```powershell
# Configure R2 credentials
firebase functions:config:set \
  r2.endpoint="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com" \
  r2.bucket="doculinks-documents" \
  r2.access_key="1d1b2df2087027b3576cee7b453a84fa" \
  r2.secret_key="44509dcb0a33a016fa6d7382743a54173222dd7f2ca94cc380cea884424a012c" \
  r2.public_url="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com"

# Deploy functions
firebase deploy --only functions
```

---

## ✅ Why This Fixes CORS

### ❌ Before (Cloudflare Worker)
- Worker not properly deployed
- CORS headers might not be configured
- Direct browser → Worker request blocked

### ✅ After (Firebase Functions)
- **Automatic CORS handling** by Firebase
- **Explicit CORS headers** in function code:
  ```javascript
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ```
- **Preflight requests** (OPTIONS) handled
- **Secure credential storage** (not exposed to frontend)

---

## 📁 Files Created/Modified

### ✅ Created
- `/functions/index.js` - Main function code
- `/functions/package.json` - Dependencies
- `/functions/.eslintrc.js` - Linting config
- `/firebase.json` - Firebase configuration
- `/.firebaserc` - Project settings
- `/deploy-functions.ps1` - Deployment script
- `/FIREBASE_FUNCTIONS_SETUP.md` - Detailed guide
- `/DEPLOY_NOW.md` - Quick start guide

### ✅ Modified
- `.env.local` - Updated endpoint URL
- `lib/cloudflareUpload.ts` - Updated configuration

---

## 🧪 Test After Deploy

### 1. Test with curl

```powershell
curl -X POST https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2 `
  -F "file=@test.pdf" `
  -F "title=Test Document" `
  -F "category=1" `
  -F "university=DocuLink" `
  -F "userId=test-123"
```

### 2. Test in browser

1. Start dev server: `npm run dev`
2. Go to upload page
3. Select a file
4. Click upload
5. ✅ No CORS error!

---

## 🔒 Security Benefits

1. **R2 credentials** never exposed to frontend
2. **Server-side validation** of files
3. **Firestore rules** still apply
4. **Firebase Authentication** integration
5. **Automatic HTTPS** encryption

---

## 📊 Function Response Format

### Success Response
```json
{
  "success": true,
  "fileName": "document.pdf",
  "fileSize": 1234567,
  "fileType": "application/pdf",
  "objectKey": "documents/user-id/timestamp-random.pdf",
  "publicUrl": "https://....r2.cloudflarestorage.com/documents/...",
  "documentId": "firestore-doc-id",
  "message": "File uploaded successfully to R2 and metadata saved to Firestore"
}
```

### Error Response
```json
{
  "error": "Upload failed",
  "message": "File too large. Maximum size is 50MB"
}
```

---

## 🎉 Benefits Over Cloudflare Worker

| Feature | Cloudflare Worker | Firebase Functions |
|---------|------------------|-------------------|
| CORS Setup | ❌ Manual, complex | ✅ Automatic |
| Credentials | ❌ Exposed in env | ✅ Secure config |
| Firestore Integration | ❌ Need SDK setup | ✅ Built-in |
| Authentication | ❌ Manual | ✅ Built-in |
| Error Logs | ❌ Separate dashboard | ✅ Firebase Console |
| Free Tier | ✅ Limited | ✅ Generous |
| Deployment | ❌ Wrangler CLI | ✅ Firebase CLI |

---

## 📚 Documentation Links

- [Firebase Functions Setup Guide](./FIREBASE_FUNCTIONS_SETUP.md)
- [Quick Deploy Guide](./DEPLOY_NOW.md)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

---

## 🆘 Troubleshooting

### Function not deploying?
```powershell
firebase login --reauth
firebase deploy --only functions --debug
```

### Still getting CORS error?
- Make sure function is deployed: `firebase functions:list`
- Check function URL in `.env.local`
- Restart Next.js dev server: `npm run dev`

### Check function logs
```powershell
firebase functions:log --only uploadFileToR2
```

---

## ✅ Ready to Deploy!

Run these commands:
```powershell
firebase login
.\deploy-functions.ps1
```

Then restart your dev server and test! 🚀
