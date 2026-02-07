# Firebase Functions Deployment Script for Windows
Write-Host "🔥 Deploying Firebase Functions..." -ForegroundColor Cyan

# Step 1: Configure R2 credentials
Write-Host "📝 Setting up R2 configuration..." -ForegroundColor Yellow
firebase functions:config:set `
  r2.endpoint="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com" `
  r2.bucket="doculinks-documents" `
  r2.access_key="1d1b2df2087027b3576cee7b453a84fa" `
  r2.secret_key="44509dcb0a33a016fa6d7382743a54173222dd7f2ca94cc380cea884424a012c" `
  r2.public_url="https://8089ae920b1fa6c8c63b68a69b19d1fa.r2.cloudflarestorage.com"

# Step 2: Deploy functions
Write-Host "🚀 Deploying functions to Firebase..." -ForegroundColor Yellow
firebase deploy --only functions

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your function URL:" -ForegroundColor Cyan
Write-Host "https://us-central1-doculink-f72a3.cloudfunctions.net/uploadFileToR2" -ForegroundColor White
