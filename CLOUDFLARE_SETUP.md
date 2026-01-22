# 🚀 Cloudflare R2 + Workers Setup Guide

## DocuLinks Auto-Upload Implementation

This guide explains how to set up automatic file uploads using Cloudflare Workers + R2 storage.

---

## 📋 Prerequisites

- Cloudflare account (free or paid)
- Wrangler CLI installed (`npm install -g wrangler`)
- Existing R2 bucket
- Supabase project (already configured)

---

## ✅ Step 1: Create R2 Bucket

### In Cloudflare Dashboard:

1. Go to **R2** section
2. Click **Create Bucket**
3. Name: `doculinks-documents`
4. Click **Create Bucket**

### Get R2 Credentials:

1. Go to **Account Settings** → **API Tokens**
2. Click **Create Token**
3. Select **Edit Cloudflare R2** template
4. Create token with permissions:
   - `r2:read:bucket`
   - `r2:write:object`
   - `r2:delete:object`

### Copy credentials:
```
ACCOUNT_ID=xxxxx
AUTH_TOKEN=xxxxx
BUCKET_NAME=doculinks-documents
```

---

## ✅ Step 2: Configure Wrangler

### Update `wrangler.toml`:

```toml
name = "doculinks-upload"
main = "src/index.ts"
compatibility_date = "2024-01-15"

[env.production]
route = "https://yourdomain.com/api/*"
zone_id = "YOUR_ZONE_ID"

[[r2_buckets]]
binding = "DOCUMENTS_BUCKET"
bucket_name = "doculinks-documents"
```

### Set Environment Variables:

```bash
wrangler secret put R2_ACCOUNT_ID
# Paste your Account ID

wrangler secret put R2_AUTH_TOKEN
# Paste your Auth Token

wrangler secret put R2_PUBLIC_URL
# https://files.yourdomain.com (your R2 public URL)
```

---

## ✅ Step 3: Deploy Worker

### Install dependencies:

```bash
npm install itty-router
```

### Deploy:

```bash
# Development (with hot reload)
wrangler dev

# Production
wrangler deploy
```

### Your Worker endpoint:
```
https://doculinks-upload.YOUR_ACCOUNT.workers.dev/api/upload
```

---

## ✅ Step 4: Configure R2 Public Access

### In Cloudflare R2 Settings:

1. Go to your bucket
2. Click **Settings**
3. Under **CORS configuration**, add:

```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

4. Under **Public access**, set a custom domain:
   - Option A: Use `files.yourdomain.com`
   - Option B: Create subdomain in Cloudflare

---

## ✅ Step 5: Setup Environment Variables

### Create `.env.local`:

```bash
NEXT_PUBLIC_UPLOAD_ENDPOINT=https://doculinks-upload.YOUR_ACCOUNT.workers.dev/api/upload
NEXT_PUBLIC_R2_DOMAIN=https://files.yourdomain.com
NEXT_PUBLIC_ADMIN_TOKEN=your_secret_token
```

---

## ✅ Step 6: Update Post Page Code

Already done in `app/post/page.tsx`:

```typescript
import { uploadToCloudflare } from '@/lib/cloudflareUpload'

// In handleCreatePost function:
const uploadResult = await uploadToCloudflare(file, {
  title,
  category: selectedCategory,
  university: 'DocuLink User',
  userId: user.id
})

if (!uploadResult.success) {
  setMsg(uploadResult.error)
  return
}

// Save to Supabase with R2 URL
await supabase.from('documents').insert({
  user_id: user.id,
  title,
  description,
  category_id: categoryId,
  file_path: uploadResult.publicUrl,
  file_type: file.type,
  status: 'pending'
})
```

---

## 🔄 Data Flow

```
User Upload
    ↓
Post Page collects data
    ↓
uploadToCloudflare() function
    ↓
FormData sent to Worker
    ↓
Worker validates file
    ↓
Worker uploads to R2 bucket
    ↓
R2 generates public URL
    ↓
Worker returns URL
    ↓
Frontend saves metadata + URL to Supabase
    ↓
Explore Page fetches & displays
    ↓
Users download from R2
```

---

## 🧪 Testing

### Test File Upload:

```bash
curl -X POST https://doculinks-upload.YOUR_ACCOUNT.workers.dev/api/upload \
  -F "file=@test.pdf" \
  -F "title=Test Document" \
  -F "category=Programming" \
  -F "university=Test University" \
  -F "userId=user123"
```

### Expected Response:

```json
{
  "success": true,
  "fileName": "test.pdf",
  "publicUrl": "https://files.yourdomain.com/documents/user123/1234567890-abc123.pdf",
  "objectKey": "documents/user123/1234567890-abc123.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000
}
```

---

## ✅ Verification Checklist

- [ ] R2 bucket created
- [ ] R2 credentials obtained
- [ ] Wrangler configured
- [ ] Worker deployed
- [ ] CORS configured
- [ ] Public URL accessible
- [ ] Environment variables set
- [ ] Post page updated
- [ ] Test upload successful
- [ ] File visible in Explore page

---

## 🔒 Security Best Practices

1. **Use private tokens** - Don't expose in client
2. **Validate files** - Check size, type, content
3. **Add authentication** - Require user login
4. **Set expiration** - Delete old files automatically
5. **Use HTTPS** - All URLs must be HTTPS
6. **Monitor costs** - Track R2 usage

---

## 📊 Pricing (as of Jan 2026)

- **R2 Storage**: $0.015/GB/month
- **API Calls**: $0.36/million
- **Workers**: Free (first 100k requests/day)

For small projects, cost is **nearly free**!

---

## 🐛 Troubleshooting

### Upload fails with 403
→ Check CORS configuration and R2 credentials

### File not accessible via URL
→ Verify public domain is configured correctly

### Large files timeout
→ Increase timeout in `cloudflareUpload.ts`

### Wrangler can't connect
→ Check Account ID and Auth Token

---

## 🚀 Next Steps

1. Deploy this setup
2. Test with small files first
3. Monitor R2 usage
4. Set up automatic cleanup policies
5. Add file preview functionality
6. Implement file analytics

---

## 📞 Support

For issues:
1. Check Cloudflare dashboard logs
2. Review Worker error messages
3. Verify R2 bucket permissions
4. Check environment variables

---

**Status**: ✅ Ready for deployment
