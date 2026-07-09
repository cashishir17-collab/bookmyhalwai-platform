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
  const [loading, setLoading] = useState(() => (auth ? true : false));

  useEffect(() => {
    if (!auth) {
      const timeoutId = window.setTimeout(() => {
        setUser(null);
        setLoading(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) {
        return;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await ensureUserDocument(firebaseUser);
        if (isMounted) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Failed to sync user profile", error);
        if (isMounted) {
          setUser(mapFirebaseUser(firebaseUser));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not configured.");
    }

    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithPhone = async (phoneNumber: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not configured.");
    }
    if (typeof window === "undefined") {
      throw new Error("Phone authentication is only available in the browser.");
    }

    console.log("LOGIN STEP 1 - Recaptcha created");

    const recaptchaContainerId = "phone-recaptcha";

    // Clear existing verifier if it exists
    if ((window as unknown as { recaptchaVerifier?: unknown }).recaptchaVerifier) {
      try {
        const existingVerifier = (window as unknown as { recaptchaVerifier?: { clear: () => void } }).recaptchaVerifier;
        if (existingVerifier && typeof existingVerifier === "object" && "clear" in existingVerifier) {
          existingVerifier.clear();
        }
      } catch (error) {
        console.log("Failed to clear existing recaptcha verifier:", error);
      }
      (window as unknown as { recaptchaVerifier?: unknown }).recaptchaVerifier = null;
    }

    // Clear recaptcha container
    const existing = document.getElementById(recaptchaContainerId);
    if (existing) {
      existing.innerHTML = "";
    }

    // Create new verifier
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
      callback: () => undefined,
    });

    // Store it globally for reuse
    (window as unknown as { recaptchaVerifier?: unknown }).recaptchaVerifier = verifier;

    await verifier.render();

    console.log("LOGIN STEP 2 - OTP requested");
    const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    console.log("LOGIN STEP 3 - OTP sent");

    return result;
  };

  const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
    console.log("LOGIN STEP 5 - Verify clicked");
    setLoading(true);

    try {
      await confirmationResult.confirm(otp);
      console.log("LOGIN STEP 6 - Login success");
    } catch (error) {
      setLoading(false);

      // Provide better error message for OTP verification
      if (error instanceof Error && error.message.includes("invalid-code")) {
        throw new Error("Invalid OTP. Please try again.");
      }
      throw error;
    }
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
