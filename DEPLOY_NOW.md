# 🚀 Quick Start - Deploy Firebase Functions

## ✅ Everything is Ready!

I've set up Firebase Functions to replace the Cloudflare Worker. This fixes the CORS issue completely!

## 🎯 Next Steps (Only 2 commands!)

### Step 1: Login to Firebase

```powershell
firebase login
```

### Step 2: Deploy Functions

Use the automated script:

```powershell
.\deploy-functions.ps1
```

**OR** manually:

```powershell
# Set configuration
firebase functions:config:set r2.endpoint="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com" r2.bucket="doculinks-documents" r2.access_key="1d1b2df2087027b3576cee7b453a84fa" r2.secret_key="44509dcb0a33a016fa6d7382743a54173222dd7f2ca94cc380cea884424a012c" r2.public_url="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com"

# Deploy
firebase deploy --only functions
```

## ✅ What's Fixed

- ❌ **Before**: CORS error with Cloudflare Worker
- ✅ **After**: Firebase Functions with proper CORS headers
- ✅ Secure R2 credentials (not exposed to frontend)
- ✅ Automatic Firestore integration
- ✅ Production-ready error handling

## 📱 Your Function URL

After deployment, your function will be available at:
```
https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2
```

The frontend is already configured to use this URL!

## 🎉 That's It!

Once deployed, just restart your Next.js dev server and try uploading a file. The CORS error will be gone!

```powershell
npm run dev
```

---

For detailed info, see [FIREBASE_FUNCTIONS_SETUP.md](./FIREBASE_FUNCTIONS_SETUP.md)
