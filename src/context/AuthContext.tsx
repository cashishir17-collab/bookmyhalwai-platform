"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AppUser, UserRole } from "@/types/user";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOtp: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapFirebaseUser(firebaseUser: FirebaseUser | null): AppUser | null {
  if (!firebaseUser) {
    return null;
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    role: "customer",
  };
}

async function ensureUserDocument(firebaseUser: FirebaseUser): Promise<AppUser> {
  if (!db) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      role: "customer",
    };
  }

  const userRef = doc(db, "users", firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const profile: AppUser & { createdAt: unknown; updatedAt: unknown } = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      role: "customer",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, profile, { merge: true });
    return profile;
  }

  const data = snapshot.data() as Partial<AppUser> & {
    role?: UserRole;
  };

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    role: data.role ?? "customer",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await ensureUserDocument(firebaseUser);
        setUser(profile);
      } catch (error) {
        console.error("Failed to sync user profile", error);
        setUser(mapFirebaseUser(firebaseUser));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not configured.");
    }

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithPhone = async (phoneNumber: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not configured.");
    }
    if (typeof window === "undefined") {
      throw new Error("Phone authentication is only available in the browser.");
    }

    const recaptchaContainerId = "phone-recaptcha";
    const existing = document.getElementById(recaptchaContainerId);

    if (existing) {
      existing.innerHTML = "";
    }

    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
      callback: () => undefined,
    });

    await verifier.render();
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
    await confirmationResult.confirm(otp);
  };

  const logout = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginWithGoogle,
      loginWithPhone,
      verifyOtp,
      logout,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
