# Deploy Firestore Security Rules to Firebase

Write-Host "🔒 Deploying Firestore Security Rules..." -ForegroundColor Cyan

# Check if Firebase CLI is installed
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Deploy only Firestore rules
firebase deploy --only firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Firestore security rules deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy Firestore rules" -ForegroundColor Red
    exit 1
}
