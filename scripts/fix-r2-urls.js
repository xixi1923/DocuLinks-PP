/**
 * Fix R2 URLs - Regenerate Signed URLs for Existing Documents
 * This script updates all documents in Firestore with new signed URLs
 */

const admin = require('firebase-admin');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Initialize S3 Client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'doculinks-documents';
const OLD_ENDPOINT = process.env.R2_ENDPOINT;

async function generateSignedUrl(objectKey) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    ResponseContentDisposition: 'inline', // Add inline disposition BEFORE signing
  });
  
  // Generate signed URL valid for 7 days (R2 maximum)
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 604800, // 7 days in seconds (R2 maximum for presigned URLs)
  });
  
  return signedUrl;
}

async function fixDocumentUrls() {
  console.log('🔧 Starting R2 URL fix...\n');
  
  try {
    // Get all documents
    const documentsSnapshot = await db.collection('documents').get();
    
    if (documentsSnapshot.empty) {
      console.log('❌ No documents found in Firestore');
      return;
    }
    
    console.log(`📄 Found ${documentsSnapshot.size} documents\n`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const doc of documentsSnapshot.docs) {
      const data = doc.data();
      const fileUrl = data.file_url;
      
      // Check if URL needs fixing (contains old endpoint or needs inline parameter)
      if (!fileUrl) {
        console.log(`⏭️  Skipping ${doc.id} - No file_url`);
        skippedCount++;
        continue;
      }
      
      // Extract object key from URL
      let objectKey;
      if (fileUrl.includes(OLD_ENDPOINT)) {
        // Old format URL
        const urlParts = fileUrl.split(OLD_ENDPOINT + '/');
        if (urlParts.length < 2) {
          console.log(`❌ Could not parse URL for ${doc.id}`);
          errorCount++;
          continue;
        }
        objectKey = urlParts[1].split('?')[0]; // Remove query params
      } else if (fileUrl.includes('r2.cloudflarestorage.com')) {
        // Signed URL format - extract key from path
        const match = fileUrl.match(/documents\/[^?]+\/\d+-[^?]+/);
        if (!match) {
          console.log(`⏭️  Skipping ${doc.id} - Could not extract key from signed URL`);
          skippedCount++;
          continue;
        }
        objectKey = match[0];
      } else {
        console.log(`⏭️  Skipping ${doc.id} - Unknown URL format`);
        skippedCount++;
        continue;
      }
      
      try {
        console.log(`🔄 Fixing ${doc.id}...`);
        console.log(`   Old Key: ${objectKey}`);
        
        // Generate new signed URL
        const newSignedUrl = await generateSignedUrl(objectKey);
        
        // Update Firestore document
        await db.collection('documents').doc(doc.id).update({
          file_url: newSignedUrl,
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`✅ Fixed ${doc.id} - ${data.title}`);
        console.log(`   New URL: ${newSignedUrl.substring(0, 100)}...\n`);
        fixedCount++;
        
      } catch (error) {
        console.error(`❌ Error fixing ${doc.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Fixed: ${fixedCount} documents`);
    console.log(`   ⏭️  Skipped: ${skippedCount} documents`);
    console.log(`   ❌ Errors: ${errorCount} documents`);
    console.log('='.repeat(60));
    
    if (fixedCount > 0) {
      console.log('\n🎉 Successfully regenerated signed URLs!');
      console.log('   All files should now be accessible.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the fix
fixDocumentUrls()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
