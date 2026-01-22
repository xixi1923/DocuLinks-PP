/**
 * Make a Firebase Auth user an admin (role: 'admin').
 *
 * Usage:
 *   node scripts/make-admin.js <serviceAccount.json> --uid=<UID>
 *   node scripts/make-admin.js <serviceAccount.json> --email=<EMAIL>
 *
 * Notes:
 * - Do NOT commit your service account JSON to source control.
 * - You can also set GOOGLE_APPLICATION_CREDENTIALS env var instead of passing the file path.
 */

const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

async function main() {
  const [, , credPathArg, ...rest] = process.argv;
  let credPath = credPathArg;
  let uid = null;
  let email = null;

  for (const arg of rest) {
    if (arg.startsWith('--uid=')) uid = arg.replace('--uid=', '');
    if (arg.startsWith('--email=')) email = arg.replace('--email=', '');
  }

  if (!credPath && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('ERROR: Missing service account credential path or GOOGLE_APPLICATION_CREDENTIALS');
    process.exit(1);
  }

  if (!uid && !email) {
    console.error('ERROR: Provide --uid or --email');
    process.exit(1);
  }

  // Initialize Admin SDK
  if (!admin.apps.length) {
    if (credPath) {
      const absolute = path.isAbsolute(credPath) ? credPath : path.join(process.cwd(), credPath);
      const serviceAccount = JSON.parse(fs.readFileSync(absolute, 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      admin.initializeApp();
    }
  }

  try {
    if (!uid && email) {
      const user = await admin.auth().getUserByEmail(email);
      uid = user.uid;
    }

    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log(`✅ Set admin role for UID: ${uid}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to set admin role:', err.message || err);
    process.exit(1);
  }
}

main();
