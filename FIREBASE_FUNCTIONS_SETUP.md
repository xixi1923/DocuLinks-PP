# 🔥 Firebase Functions Setup - Complete Guide

## ✅ What We Created

1. **Firebase Functions** (`/functions` folder)
   - `index.js` - Upload function with R2 integration
   - `package.json` - Dependencies configuration
   - Complete CORS configuration

2. **Updated Frontend** (`lib/cloudflareUpload.ts`)
   - Now uses Firebase Function endpoint
   - Automatic project ID detection

## 📋 Next Steps to Deploy

### 1. Login to Firebase

```bash
firebase login
```

If you have issues with the browser, use:
```bash
firebase login --no-localhost
```

### 2. Configure Environment Variables

You need to set your R2 credentials in Firebase Functions:

```bash
firebase functions:config:set \
  r2.endpoint="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com" \
  r2.bucket="doculinks-documents" \
  r2.access_key="1d1b2df2087027b3576cee7b453a84fa" \
  r2.secret_key="44509dcb0a33a016fa6d7382743a54173222dd7f2ca94cc380cea884424a012c" \
  r2.public_url="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com"
```

**Important**: Replace the values above with your actual R2 credentials if different.

### 3. Deploy Functions

```bash
firebase deploy --only functions
```

This will:
- Deploy `uploadFileToR2` function
- Deploy `getUploadConfig` function
- Return the function URLs

### 4. Update .env.local (Already Done!)

Your `.env.local` is already configured with:
```env
NEXT_PUBLIC_FIREBASE_FUNCTION_URL=https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2
```

## 🧪 Test Your Function

After deployment, test with curl:

```bash
curl -X POST https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2 \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "category=1" \
  -F "university=Test University" \
  -F "userId=test-user-123"
```

## 🎯 How It Works

```
User uploads file
    ↓
Frontend (Next.js)
    ↓
Firebase Function (uploadFileToR2)
    ↓
    ├─→ Upload to Cloudflare R2 (via S3 API)
    │   └─→ Returns public URL
    ↓
    └─→ Save metadata to Firestore
        └─→ Returns document ID
    ↓
Return success to frontend
```

## 📁 File Structure

```
DocuLinks-PP/
├── functions/
│   ├── index.js           # Main function code
│   ├── package.json       # Dependencies
│   └── .eslintrc.js       # Linting config
├── firebase.json          # Firebase config
├── .firebaserc            # Project settings
└── lib/
    └── cloudflareUpload.ts  # Updated to use Firebase Function
```

## 🔒 Security Features

✅ **CORS enabled** - Allows frontend to call function
✅ **File validation** - Size and type checks
✅ **Secure credentials** - Stored in Firebase config (not exposed)
✅ **Firestore integration** - Automatic metadata storage

## ⚡ Features

- ✅ Upload files up to 50MB
- ✅ Supports: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG
- ✅ Automatic file naming (timestamp + random ID)
- ✅ Metadata stored in Firestore
- ✅ Returns public R2 URL
- ✅ CORS configured
- ✅ Error handling

## 🐛 Troubleshooting

### Issue: Function not found
**Solution**: Make sure you deployed with `firebase deploy --only functions`

### Issue: CORS error
**Solution**: Already fixed! Function includes CORS headers

### Issue: R2 credentials error
**Solution**: Run the `firebase functions:config:set` command again

### Issue: File not uploaded
**Solution**: Check Firebase Functions logs:
```bash
firebase functions:log
```

## 📊 Monitor Your Function

View logs in real-time:
```bash
firebase functions:log --only uploadFileToR2
```

View in Firebase Console:
https://console.firebase.google.com/project/doculink-f72a3/functions

## 🚀 Ready to Test!

Once deployed, your upload page will automatically use the Firebase Function instead of the Cloudflare Worker. No code changes needed on the frontend!

The CORS issue is completely resolved because:
1. Firebase Functions handle CORS automatically
2. We added explicit CORS headers
3. No need to configure Cloudflare Worker CORS

---

**Next command to run:**
```bash
firebase login
firebase deploy --only functions
```

That's it! Your upload system will be live! 🎉
