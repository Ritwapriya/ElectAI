import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ElectAI Firebase configuration (Google Cloud Console integration)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase for production deployment
let app;
let analytics;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  // Analytics is only available in browser environments
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.log("Firebase initialization skipped: Environment variables not set for Google Cloud services");
}

export { app, auth, db, analytics };
