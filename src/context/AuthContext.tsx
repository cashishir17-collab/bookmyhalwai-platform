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
import { getFriendlyAuthErrorMessage } from "@/lib/firebaseAuthError";
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

// Single source of truth for the admin identity. Deliberately not exported
// as a NEXT_PUBLIC_ env var: that would still ship it to the client bundle
// exactly like this literal does today. Do not duplicate this value
// elsewhere — import ADMIN_PHONE from this module instead.
export const ADMIN_PHONE = "+917291852535";

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
    role: firebaseUser.phoneNumber === ADMIN_PHONE ? "admin" : "customer",
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
      role: firebaseUser.phoneNumber === ADMIN_PHONE ? "admin" : "customer",
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
    return { ...profile, role: firebaseUser.phoneNumber === ADMIN_PHONE ? "admin" : "customer" };
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
    role: firebaseUser.phoneNumber === ADMIN_PHONE ? "admin" : data.role === "admin" ? "customer" : data.role ?? "customer",
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
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      console.log("LOGIN STEP 3 - OTP sent");
      return result;
    } catch (error) {
      console.error("LOGIN STEP 2 FAILED - OTP send error", error);
      throw new Error(getFriendlyAuthErrorMessage(error, "Unable to send OTP. Please try again."));
    }
  };

  const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string) => {
    console.log("LOGIN STEP 5 - Verify clicked");
    setLoading(true);

    try {
      await confirmationResult.confirm(otp);
      console.log("LOGIN STEP 6 - Login success");
    } catch (error) {
      setLoading(false);
      console.error("LOGIN STEP 5 FAILED - OTP verify error", error);
      throw new Error(getFriendlyAuthErrorMessage(error, "Invalid OTP. Please try again."));
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
