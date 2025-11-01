import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Use Vite-style env vars. Ensure these are defined in your .env (prefixed with VITE_).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // ...add other optional keys if configured (messagingSenderId, storageBucket, etc.)...
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Persist login across reloads. Ignore failures silently.
setPersistence(auth, browserLocalPersistence).catch(() => {});

export { app, auth };
