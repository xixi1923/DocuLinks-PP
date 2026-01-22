# ✅ Deployment Checklist

## 📋 Pre-Deployment (Already Done!)

- [x] Firebase Functions created (`/functions` folder)
- [x] Upload function with CORS support
- [x] R2 integration configured
- [x] Firestore integration configured
- [x] Frontend updated to use Firebase Function
- [x] Environment variables configured
- [x] Package dependencies installed

## 🚀 Deployment Steps

### Step 1: Login to Firebase
```powershell
firebase login
```

**Expected Output:**
```
✔ Success! Logged in as your-email@gmail.com
```

**Troubleshooting:**
- If browser doesn't open, use: `firebase login --no-localhost`
- Copy the code and paste it in the browser
- Sign in with your Google account

---

### Step 2: Deploy Functions

**Option A: Use Deploy Script (Recommended)**
```powershell
.\deploy-functions.ps1
```

**Option B: Manual Deployment**
```powershell
# Set R2 configuration
firebase functions:config:set r2.endpoint="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com" r2.bucket="doculinks-documents" r2.access_key="1d1b2df2087027b3576cee7b453a84fa" r2.secret_key="44509dcb0a33a016fa6d7382743a54173222dd7f2ca94cc380cea884424a012c" r2.public_url="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com"

# Deploy
firebase deploy --only functions
```

**Expected Output:**
```
✔  functions: Finished running predeploy script.
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing functions directory for uploading...
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 18 function uploadFileToR2...
✔  functions[uploadFileToR2]: Successful create operation.
Function URL: https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2

✔  Deploy complete!
```

---

### Step 3: Verify Deployment

```powershell
firebase functions:list
```

**Expected Output:**
```
┌───────────────────┬────────────────────────────────┐
│ Function          │ URL                            │
├───────────────────┼────────────────────────────────┤
│ uploadFileToR2    │ https://us-central1-...        │
│ getUploadConfig   │ https://us-central1-...        │
└───────────────────┴────────────────────────────────┘
```

---

### Step 4: Test Function

**Test with curl:**
```powershell
# Create a test file first
echo "Test content" > test.txt

# Upload it
curl -X POST https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2 `
  -F "file=@test.txt" `
  -F "title=Test Document" `
  -F "category=1" `
  -F "university=Test University" `
  -F "userId=test-user-123"
```

**Expected Response:**
```json
{
  "success": true,
  "fileName": "test.txt",
  "fileSize": 123,
  "fileType": "text/plain",
  "objectKey": "documents/test-user-123/1234567890-xyz.txt",
  "publicUrl": "https://...r2.cloudflarestorage.com/documents/...",
  "documentId": "abc123",
  "message": "File uploaded successfully"
}
```

---

### Step 5: Restart Dev Server

```powershell
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

**Expected Output:**
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

---

### Step 6: Test in Browser

1. Open: http://localhost:3000/post
2. Fill in document details
3. Select a file (PDF, DOC, etc.)
4. Click "Upload" button
5. **✅ Should see success message (no CORS error!)**

---

## 🎯 Success Indicators

After completing all steps, you should see:

- ✅ No CORS errors in browser console
- ✅ File appears in Cloudflare R2 dashboard
- ✅ Document appears in Firestore "documents" collection
- ✅ Success message shown to user
- ✅ Document listed on explore page (after admin approval)

---

## 🐛 Troubleshooting

### Issue: Firebase login fails
```powershell
firebase login --reauth
```

### Issue: Function deployment fails
```powershell
# Check Firebase project
firebase projects:list

# Make sure you're using the right project
firebase use doculink-f72a3

# Try deploying with debug
firebase deploy --only functions --debug
```

### Issue: CORS error still appears
1. Check function URL in `.env.local`
2. Verify function is deployed: `firebase functions:list`
3. Check browser network tab for actual endpoint being called
4. Restart dev server

### Issue: "Function not found" error
```powershell
# Make sure function is deployed
firebase functions:list

# Check function logs
firebase functions:log --only uploadFileToR2
```

### Issue: R2 upload fails
1. Verify R2 credentials are correct
2. Check function configuration:
   ```powershell
   firebase functions:config:get
   ```
3. Redeploy with correct config

---

## 📊 Monitoring

### View Function Logs (Real-time)
```powershell
firebase functions:log --follow
```

### View Specific Function Logs
```powershell
firebase functions:log --only uploadFileToR2
```

### Firebase Console
Visit: https://console.firebase.google.com/project/doculink-f72a3/functions

---

## 🎉 You're Done When...

- [ ] Firebase login successful
- [ ] Functions deployed successfully
- [ ] Test upload with curl works
- [ ] Dev server restarted
- [ ] Browser test upload works
- [ ] No CORS errors in console
- [ ] File visible in R2 bucket
- [ ] Document saved in Firestore

---

## 📞 Need Help?

Check these files for more info:
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - Quick start
- [FIREBASE_FUNCTIONS_SETUP.md](./FIREBASE_FUNCTIONS_SETUP.md) - Detailed guide
- [CORS_FIX_COMPLETE.md](./CORS_FIX_COMPLETE.md) - Solution explanation
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) - System architecture

---

**Ready to deploy? Start with Step 1!** 🚀
