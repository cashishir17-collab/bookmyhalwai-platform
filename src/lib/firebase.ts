import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => Boolean(value));

export const app = hasFirebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

console.log("Firebase App:", app);

export const auth: Auth | null = app ? getAuth(app) : null;
console.log("Firebase Auth:", auth);

// This project's Firestore database was created with the explicit name "default"
// rather than Firestore's special reserved "(default)" database id. Passing the
// name here connects to the database that actually exists in the Firebase console.
export const db: Firestore | null = app ? getFirestore(app, "default") : null;
console.log("Firebase DB:", db);

export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
console.log("hasFirebaseConfig:", hasFirebaseConfig);
