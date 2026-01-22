// Script to fix negative counts in Firestore documents
// Run this once to clean up existing data

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need your service account key)
// For now, this is a template - you can run it manually or integrate it

async function fixNegativeCounts() {
  try {
    console.log('Fetching all documents...');
    const db = admin.firestore();
    const snapshot = await db.collection('documents').get();
    
    let fixed = 0;
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      let needsUpdate = false;
      const updates = {};
      
      if ((data.likes_count ?? 0) < 0) {
        updates.likes_count = 0;
        needsUpdate = true;
      }
      
      if ((data.favorites_count ?? 0) < 0) {
        updates.favorites_count = 0;
        needsUpdate = true;
      }
      
      if ((data.comments_count ?? 0) < 0) {
        updates.comments_count = 0;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Fixing document ${doc.id}:`, updates);
        batch.update(doc.ref, updates);
        fixed++;
      }
    });
    
    if (fixed > 0) {
      await batch.commit();
      console.log(`✅ Fixed ${fixed} documents with negative counts`);
    } else {
      console.log('✅ No documents needed fixing');
    }
  } catch (error) {
    console.error('Error fixing counts:', error);
  }
}

// Uncomment to run:
// fixNegativeCounts();

module.exports = { fixNegativeCounts };
