import { GoogleAuthProvider, signInWithPopup, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase authentication is not configured.");
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser ?? null;
}
