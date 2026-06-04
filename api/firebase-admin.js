import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Local dev: Load from root of project
    const jsonPath = path.join(process.cwd(), 'hojyokin-navi-firebase-adminsdk-fbsvc-4f29752026.json');
    try {
      serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.warn("Local service account file not found. Firebase Admin might not function correctly unless VITE_FIREBASE_API_KEY is unset or emulators are used.");
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export default admin;
