# Fix R2 Public Access - 400 Bad Request Error

## Problem
Files uploaded to Cloudflare R2 return "400 Bad Request" because the bucket isn't publicly accessible.

## Solution: Enable R2 Public Access

### Option 1: Use R2 Public Buckets (Recommended)

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Go to R2 → Your Bucket (`doculinks-documents`)

2. **Enable Public Access**
   - Click on "Settings" tab
   - Scroll to "Public Access"
   - Click "Allow Access"
   - Confirm the action

3. **Get Public Bucket URL**
   - After enabling, you'll get a public URL like:
   - `https://pub-xxxxxx.r2.dev/doculinks-documents`
   - Copy this URL

4. **Update .env.local**
   ```env
   # Replace the R2_ENDPOINT with your public bucket URL
   R2_ENDPOINT=https://pub-xxxxxx.r2.dev/doculinks-documents
   NEXT_PUBLIC_R2_DOMAIN=https://pub-xxxxxx.r2.dev/doculinks-documents
   ```

5. **Restart dev server**
   ```bash
   npm run dev
   ```

### Option 2: Use Custom Domain (Better for Production)

1. **In Cloudflare Dashboard → R2 → Your Bucket**
   - Go to "Settings"
   - Click "Connect Domain"
   - Add a custom domain (e.g., `files.yourdomain.com`)

2. **Update .env.local**
   ```env
   R2_ENDPOINT=https://files.yourdomain.com
   NEXT_PUBLIC_R2_DOMAIN=https://files.yourdomain.com
   ```

### Option 3: Quick Fix - Use Signed URLs (Temporary)

If you can't enable public access right now, I can implement signed URLs that expire after a certain time.

## Current Issue
Your bucket URL: `https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com`
- This is the S3-compatible API endpoint (for uploads only)
- It's NOT publicly accessible
- You need a separate public URL

## After Fixing
Files will be accessible at: `https://pub-xxxxxx.r2.dev/doculinks-documents/documents/...`

---

**Choose Option 1 for quickest fix!**
