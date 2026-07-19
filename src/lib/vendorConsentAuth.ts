import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  inMemoryPersistence,
  RecaptchaVerifier,
  setPersistence,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import { collection, doc, getFirestore, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { firebaseConfig } from "@/lib/firebase";

const SECONDARY_APP_NAME = "vendor-consent";
const DATABASE_ID = "default";
let activeRecaptchaVerifier: RecaptchaVerifier | null = null;

function secondaryServices() {
  const secondaryApp = getApps().some((candidate) => candidate.name === SECONDARY_APP_NAME)
    ? getApp(SECONDARY_APP_NAME)
    : initializeApp(firebaseConfig, SECONDARY_APP_NAME);

  return {
    auth: getAuth(secondaryApp),
    db: getFirestore(secondaryApp, DATABASE_ID),
  };
}

export async function sendVendorConsentOtp(phoneE164: string) {
  const { auth } = secondaryServices();
  await setPersistence(auth, inMemoryPersistence);

  const container = document.getElementById("vendor-consent-recaptcha");
  if (!container) throw new Error("OTP verification could not start. Refresh the page and try again.");

  activeRecaptchaVerifier?.clear();
  activeRecaptchaVerifier = null;
  container.replaceChildren();

  const verifier = new RecaptchaVerifier(auth, "vendor-consent-recaptcha", {
    size: "invisible",
    callback: () => undefined,
  });
  activeRecaptchaVerifier = verifier;
  await verifier.render();

  try {
    return await signInWithPhoneNumber(auth, phoneE164, verifier);
  } catch (error) {
    verifier.clear();
    if (activeRecaptchaVerifier === verifier) activeRecaptchaVerifier = null;
    throw error;
  }
}

export type VendorConsent = {
  consentId: string;
  vendorUid: string;
  phoneE164: string;
};

export async function verifyVendorConsent(params: {
  confirmation: ConfirmationResult;
  otp: string;
  salesExecutiveId: string;
  birthDate: string;
  anniversaryApplicable: "yes" | "no";
  anniversaryDate: string;
}): Promise<VendorConsent> {
  const { auth, db } = secondaryServices();
  const credential = await params.confirmation.confirm(params.otp);
  const phoneE164 = credential.user.phoneNumber;
  if (!phoneE164) throw new Error("Firebase did not return the verified vendor phone number.");

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    phoneNumber: phoneE164,
    role: "vendor",
    birthDate: params.birthDate,
    anniversaryApplicable: params.anniversaryApplicable === "yes",
    anniversaryDate: params.anniversaryApplicable === "yes" ? params.anniversaryDate : null,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  const consentRef = doc(collection(db, "vendorConsents"));
  await setDoc(consentRef, {
    vendorUid: credential.user.uid,
    phoneE164,
    salesExecutiveId: params.salesExecutiveId,
    status: "verified",
    verifiedAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + 30 * 60 * 1000),
  });

  await signOut(auth);
  return { consentId: consentRef.id, vendorUid: credential.user.uid, phoneE164 };
}
