"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, db, storage } from "@/lib/firebase";
import { sendVendorConsentOtp, verifyVendorConsent, type VendorConsent } from "@/lib/vendorConsentAuth";
import { getFirebaseAuthErrorCode } from "@/lib/firebaseAuthError";
import type { ConfirmationResult } from "firebase/auth";
import ProgressStepper from "@/components/vendor/ProgressStepper";
import { INDIA_STATES } from "@/data/indiaLocations";
import IndiaPhoneInput, { isValidIndianMobile, toIndianPhoneE164 } from "@/components/forms/IndiaPhoneInput";

const steps = ["Business", "Services", "Pricing", "Social", "Uploads"];
const VENDOR_OTP_SESSION_MAX_AGE_MS = 4 * 60 * 1000;
const VENDOR_OTP_RESEND_COOLDOWN_SECONDS = 30;
// Must stay under the 30-minute expiresAt window vendorConsentAuth.ts writes to
// the vendorConsents doc, and what firestore.rules checks at submit time.
// Kept slightly shorter so the client catches this before Firestore does.
const VENDOR_CONSENT_MAX_AGE_MS = 29 * 60 * 1000;

const trustPoints = [
  "Free onboarding during launch phase",
  "Verification before marketplace listing",
  "GST/FSSAI assistance available",
  "Direct support from BookMyHalwai team",
];

const providerCategories = [
  { value: "halwai_caterer", label: "Halwai / Caterer" },
  { value: "decorator", label: "Decorator" },
  { value: "tent_house", label: "Tent House" },
  { value: "dj", label: "DJ" },
  { value: "photographer", label: "Photography / Videography" },
  { value: "venue_banquet", label: "Venue / Banquet Hall" },
  { value: "makeup_artist", label: "Makeup Artist" },
  { value: "pandit", label: "Pandit" },
  { value: "mehendi_artist", label: "Mehendi Artist" },
  { value: "return_gifts", label: "Return Gifts" },
  { value: "choreographer", label: "Choreographer" },
] as const;

type ProviderCategory = (typeof providerCategories)[number]["value"];

const initialState = {
  providerCategory: "" as ProviderCategory | "",
  businessName: "",
  ownerName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  state: "",
  city: "",
  areasServed: "",
  address: "",
  googleMapsLink: "",
  yearsExperience: "",
  birthDate: "",
  anniversaryApplicable: "" as "" | "yes" | "no",
  anniversaryDate: "",
  servicesDescription: "",
  venueType: "",
  venueSetting: "",
  parkingAvailable: "",
  roomsAvailable: "",
  services: {
    veg: false,
    nonVeg: false,
    jain: false,
    liveCounter: false,
    outdoorCatering: false,
    birthday: false,
    wedding: false,
    corporate: false,
    houseParty: false,
  },
  minGuests: "",
  maxGuests: "",
  pricing: {
    startingPrice: "",
    silverPackage: "",
    goldPackage: "",
    royalPackage: "",
    travelCharges: "",
    advancePercentage: "",
  },
  social: {
    instagram: "",
    facebook: "",
    website: "",
    googleBusinessProfile: "",
    googleReviewLink: "",
  },
  uploads: {
    logo: null as File | null,
    kitchenPhotos: [] as File[],
    foodPhotos: [] as File[],
    staffPhotos: [] as File[],
    menuPdf: null as File | null,
    fssai: null as File | null,
    gst: null as File | null,
  },
};

type RegistrationForm = typeof initialState;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VENDOR_COUNTER_COLLECTION = "systemCounters";
const VENDOR_COUNTER_DOCUMENT = "vendorRegistration";
const VENDOR_REGISTRATION_PREFIX = "BMH";

const VENDOR_CATEGORY_CODES: Record<ProviderCategory, string> = {
  halwai_caterer: "HC",
  decorator: "DEC",
  tent_house: "TNT",
  dj: "DJ",
  photographer: "PHO",
  venue_banquet: "VEN",
  makeup_artist: "MUA",
  pandit: "PAN",
  mehendi_artist: "MEH",
  return_gifts: "GFT",
  choreographer: "CHO",
};

type VendorCategoryCounter = {
  currentYear?: unknown;
  lastSequence?: unknown;
};

type VendorRegistrationCounterData = {
  categoryCounters?: Partial<Record<ProviderCategory, VendorCategoryCounter>>;
};

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      console.error("NETWORK_TIMEOUT", { operation, timeoutMs });
      reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

function toNumber(value: string) {
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? 0 : numericValue;
}

async function getNextVendorRegistrationNumber(providerCategory: ProviderCategory | "") {
  if (!db) {
    throw new Error("Firestore is not configured yet.");
  }

  if (!providerCategory) {
    throw new Error("Provider category is required to create a registration number.");
  }

  const categoryCode = VENDOR_CATEGORY_CODES[providerCategory];
  const currentYear = new Date().getFullYear();
  const counterRef = doc(db, VENDOR_COUNTER_COLLECTION, VENDOR_COUNTER_DOCUMENT);

  return runTransaction(db, async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);
    const counterData = counterSnapshot.data() as VendorRegistrationCounterData | undefined;
    const categoryCounters = counterData?.categoryCounters ?? {};
    const storedCounter = categoryCounters[providerCategory];

    const storedYear = typeof storedCounter?.currentYear === "number" ? storedCounter.currentYear : null;
    const storedSequence = typeof storedCounter?.lastSequence === "number" ? storedCounter.lastSequence : 0;
    const nextSequence = storedYear === currentYear ? storedSequence + 1 : 1;

    transaction.set(
      counterRef,
      {
        categoryCounters: {
          ...categoryCounters,
          [providerCategory]: {
            currentYear,
            lastSequence: nextSequence,
          },
        },
        lastCategory: providerCategory,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return `${VENDOR_REGISTRATION_PREFIX}-${categoryCode}-${currentYear}-${String(nextSequence).padStart(6, "0")}`;
  });
}

function calculateProfileCompletion(form: RegistrationForm) {
  const commonChecks = [
    form.providerCategory,
    form.businessName.trim(),
    form.ownerName.trim(),
    form.mobile.trim(),
    form.whatsapp.trim(),
    form.email.trim(),
    form.state.trim(),
    form.city.trim(),
    form.areasServed.trim(),
    form.address.trim(),
    form.googleMapsLink.trim(),
    form.yearsExperience.trim(),
    form.pricing.startingPrice.trim(),
    form.pricing.travelCharges.trim(),
    form.pricing.advancePercentage.trim(),
    form.social.instagram.trim() || form.social.facebook.trim() || form.social.website.trim(),
    form.uploads.logo,
    form.uploads.kitchenPhotos.length + form.uploads.foodPhotos.length + form.uploads.staffPhotos.length > 0,
  ];
  const cateringChecks = form.providerCategory === "halwai_caterer" ? [
    Object.values(form.services).some(Boolean),
    form.minGuests.trim(),
    form.maxGuests.trim(),
    form.pricing.silverPackage.trim(),
    form.pricing.goldPackage.trim(),
    form.pricing.royalPackage.trim(),
    form.uploads.menuPdf,
  ] : [form.servicesDescription.trim()];
  const venueChecks = form.providerCategory === "venue_banquet" ? [
    form.venueType.trim(),
    form.venueSetting,
  ] : [];
  const checks = [...commonChecks, ...cateringChecks, ...venueChecks];

  const filledFields = checks.filter(Boolean).length;
  return Math.round((filledFields / checks.length) * 100);
}

type VendorRegistrationAlertPayload = {
  businessName: string;
  ownerName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  state: string;
  city: string;
  complianceStatus: string;
  source: string;
  campaign: string;
  createdAt: string;
};

export default function RegistrationWizard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegistrationForm>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [otpConfirmation, setOtpConfirmation] = useState<ConfirmationResult | null>(null);
  const [vendorOtp, setVendorOtp] = useState("");
  const [vendorConsent, setVendorConsent] = useState<VendorConsent | null>(null);
  const [vendorConsentSetAt, setVendorConsentSetAt] = useState<number | null>(null);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);
  const [otpResendSeconds, setOtpResendSeconds] = useState(0);
  const otpRequestId = useRef(0);
  const assistedBySales = user?.role === "sales_executive";
  const availableCities = useMemo(
    () => INDIA_STATES.find((item) => item.name === form.state)?.cities ?? [],
    [form.state],
  );

  const sendVendorRegistrationAlert = async (payload: VendorRegistrationAlertPayload) => {
    try {
      const response = await fetch("/api/vendor-registration-alert", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("VENDOR_ALERT_API_FAILED", {
          status: response.status,
          responseText,
          payload,
        });
        return;
      }

      const result = (await response.json()) as { success?: boolean; message?: string };
      console.log("VENDOR_ALERT_API_SUCCESS", {
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error("VENDOR_ALERT_API_ERROR", {
        payload,
        error,
      });
    }
  };

  const handleCopyRegistrationNumber = async () => {
    if (!registrationNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(registrationNumber);
      setCopyMessage("Registration number copied.");
    } catch {
      setCopyMessage("Copy failed. Please copy the number manually.");
    }
  };

  const progressLabel = useMemo(() => `${step} of ${steps.length}`, [step]);

  useEffect(() => {
    if (otpResendSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setOtpResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpResendSeconds]);

  const updateField = <T extends keyof RegistrationForm>(field: T, value: RegistrationForm[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "mobile") {
      otpRequestId.current += 1;
      setOtpConfirmation(null);
      setVendorConsent(null);
      setVendorConsentSetAt(null);
      setVendorOtp("");
      setOtpMessage("");
      setOtpSentAt(null);
      setOtpResendSeconds(0);
    }
  };

  const handleSendVendorOtp = async () => {
    if (!isValidIndianMobile(form.mobile)) {
      setOtpMessage("Enter the vendor's valid 10-digit mobile number first.");
      return;
    }
    if (otpResendSeconds > 0) {
      setOtpMessage(`Please wait ${otpResendSeconds} seconds before requesting another OTP.`);
      return;
    }

    const requestId = otpRequestId.current + 1;
    otpRequestId.current = requestId;
    setOtpBusy(true);
    setOtpConfirmation(null);
    setVendorConsent(null);
    setVendorOtp("");
    setOtpSentAt(null);
    setOtpMessage("Requesting a new OTP. Any earlier OTP is no longer valid.");
    try {
      const confirmation = await sendVendorConsentOtp(toIndianPhoneE164(form.mobile));
      if (otpRequestId.current !== requestId) return;
      setOtpConfirmation(confirmation);
      setOtpSentAt(Date.now());
      setOtpResendSeconds(VENDOR_OTP_RESEND_COOLDOWN_SECONDS);
      setOtpMessage("New OTP sent. Enter only the latest 6-digit OTP within 4 minutes.");
    } catch (error) {
      if (otpRequestId.current !== requestId) return;
      console.error("VENDOR_OTP_SEND_FAILED", error);
      const code = getFirebaseAuthErrorCode(error);
      setOtpMessage(code === "auth/too-many-requests"
        ? "Too many OTP requests. Please wait before trying again."
        : code === "auth/invalid-phone-number"
          ? "Enter a valid 10-digit mobile number for the vendor."
          : "Unable to send OTP right now. Please try again.");
    } finally {
      if (otpRequestId.current === requestId) setOtpBusy(false);
    }
  };

  const handleVerifyVendorOtp = async () => {
    if (!user?.uid || !otpConfirmation || vendorOtp.trim().length !== 6) {
      setOtpMessage("Enter the complete 6-digit OTP sent to the vendor.");
      return;
    }
    if (!otpSentAt || Date.now() - otpSentAt > VENDOR_OTP_SESSION_MAX_AGE_MS) {
      setOtpConfirmation(null);
      setVendorOtp("");
      setOtpSentAt(null);
      setOtpMessage("This OTP session expired. Tap Send new OTP and use only the newest code.");
      return;
    }
    if (!form.birthDate || !form.anniversaryApplicable || (form.anniversaryApplicable === "yes" && !form.anniversaryDate)) {
      setOtpMessage("Complete the vendor's birth date and anniversary details before OTP verification.");
      return;
    }
    setOtpBusy(true);
    setOtpMessage("");
    try {
      const consent = await verifyVendorConsent({
        confirmation: otpConfirmation,
        otp: vendorOtp.trim(),
        salesExecutiveId: user.uid,
        birthDate: form.birthDate,
        anniversaryApplicable: form.anniversaryApplicable,
        anniversaryDate: form.anniversaryDate,
      });
      setVendorConsent(consent);
      setVendorConsentSetAt(Date.now());
      setOtpConfirmation(null);
      setOtpSentAt(null);
      setVendorOtp("");
      setOtpMessage("Vendor mobile verified. Registration can now be submitted.");
    } catch (error) {
      console.error("VENDOR_OTP_VERIFY_FAILED", error);
      const code = getFirebaseAuthErrorCode(error);
      if (code === "auth/code-expired" || code === "auth/session-expired") {
        setOtpConfirmation(null);
        setOtpSentAt(null);
        setVendorOtp("");
        setOtpMessage("The OTP expired. Tap Send new OTP and enter only the newest code within 4 minutes.");
      } else if (code === "auth/invalid-verification-code") {
        setVendorOtp("");
        setOtpMessage("That OTP is incorrect. Re-enter the latest OTP from the vendor's newest SMS.");
      } else if (code === "auth/too-many-requests") {
        setOtpMessage("Too many verification attempts. Please wait before requesting another OTP.");
      } else {
        setOtpConfirmation(null);
        setOtpSentAt(null);
        setVendorOtp("");
        setOtpMessage("Unable to verify this OTP. Tap Send new OTP and try again.");
      }
    } finally {
      setOtpBusy(false);
    }
  };

  const updatePricingField = <T extends keyof RegistrationForm["pricing"]>(field: T, value: RegistrationForm["pricing"][T]) => {
    setForm((current) => ({
      ...current,
      pricing: { ...current.pricing, [field]: value },
    }));
  };

  const updateServiceField = <T extends keyof RegistrationForm["services"]>(field: T, value: RegistrationForm["services"][T]) => {
    setForm((current) => ({
      ...current,
      services: { ...current.services, [field]: value },
    }));
  };

  const updateSocialField = <T extends keyof RegistrationForm["social"]>(field: T, value: RegistrationForm["social"][T]) => {
    setForm((current) => ({
      ...current,
      social: { ...current.social, [field]: value },
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, field: keyof RegistrationForm["uploads"]) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((current) => ({
        ...current,
        [field]: "File size must be less than 5MB.",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      uploads: { ...current.uploads, [field]: file },
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleMultipleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: "kitchenPhotos" | "foodPhotos" | "staffPhotos",
  ) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== files.length) {
      setErrors((current) => ({
        ...current,
        [field]: "Each image must be less than 5MB.",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      uploads: { ...current.uploads, [field]: validFiles },
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.providerCategory) newErrors.providerCategory = "Provider category is required.";
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required.";
      if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required.";
      if (!isValidIndianMobile(form.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number.";
      if (!isValidIndianMobile(form.whatsapp)) newErrors.whatsapp = "Enter a valid 10-digit WhatsApp number.";
      if (!form.email.trim()) newErrors.email = "Email is required.";
      if (!form.state.trim()) newErrors.state = "State or union territory is required.";
      if (!form.city.trim()) newErrors.city = "City or town is required.";
      if (!form.areasServed.trim()) newErrors.areasServed = "Areas served is required.";
      if (!form.address.trim()) newErrors.address = "Address is required.";
      if (!form.googleMapsLink.trim()) newErrors.googleMapsLink = "Google Maps link is required.";
      if (!form.yearsExperience.trim()) newErrors.yearsExperience = "Years of experience is required.";
      if (!form.birthDate) newErrors.birthDate = "Birth date is required.";
      if (!form.anniversaryApplicable) newErrors.anniversaryApplicable = "Select whether an anniversary date applies.";
      if (form.anniversaryApplicable === "yes" && !form.anniversaryDate) newErrors.anniversaryDate = "Anniversary date is required when applicable.";
    }

    if (step === 2) {
      if (form.providerCategory === "halwai_caterer") {
        if (!form.services.veg && !form.services.nonVeg && !form.services.jain && !form.services.liveCounter && !form.services.outdoorCatering && !form.services.birthday && !form.services.wedding && !form.services.corporate && !form.services.houseParty) {
          newErrors.services = "Select at least one service or event type.";
        }
      } else if (!form.servicesDescription.trim()) {
        newErrors.servicesDescription = "Describe the services or packages you offer.";
      }
      if (form.providerCategory === "venue_banquet") {
        if (!form.venueType.trim()) newErrors.venueType = "Venue type is required.";
        if (!form.venueSetting) newErrors.venueSetting = "Venue setting is required.";
      }
      if (!form.minGuests.trim()) newErrors.minGuests = "Minimum event capacity is required.";
      if (!form.maxGuests.trim()) newErrors.maxGuests = "Maximum event capacity is required.";
      if (toNumber(form.maxGuests) < toNumber(form.minGuests)) {
        newErrors.maxGuests = "Maximum capacity cannot be less than minimum capacity.";
      }
    }

    if (step === 3) {
      if (!form.pricing.startingPrice.trim()) newErrors.startingPrice = "Starting price is required.";
      if (!form.pricing.silverPackage.trim()) newErrors.silverPackage = "Silver package pricing is required.";
      if (!form.pricing.goldPackage.trim()) newErrors.goldPackage = "Gold package pricing is required.";
      if (!form.pricing.royalPackage.trim()) newErrors.royalPackage = "Royal package pricing is required.";
      if (!form.pricing.travelCharges.trim()) newErrors.travelCharges = "Travel charges are required.";
      if (!form.pricing.advancePercentage.trim()) newErrors.advancePercentage = "Advance percentage is required.";
    }

    if (step === 4) {
      if (!form.social.instagram.trim() && !form.social.facebook.trim() && !form.social.website.trim()) {
        newErrors.social = "Add at least one social profile or website.";
      }
    }

    if (step === 5) {
      if (!form.uploads.logo) newErrors.logo = "Logo is required.";
      if (form.uploads.kitchenPhotos.length === 0) newErrors.kitchenPhotos = "Upload at least one portfolio photo.";
      if (form.providerCategory === "halwai_caterer") {
        if (form.uploads.foodPhotos.length === 0) newErrors.foodPhotos = "Upload at least one food photo.";
        if (form.uploads.staffPhotos.length === 0) newErrors.staffPhotos = "Upload at least one staff photo.";
        if (!form.uploads.menuPdf) newErrors.menuPdf = "Menu PDF is required.";
      }
      if (assistedBySales && !vendorConsent) newErrors.vendorConsent = "Verify the vendor's mobile number with OTP before submitting.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length));
  };

  const prevStep = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const uploadFile = async (
    file: File | null,
    path: string,
    label: string,
    field: keyof RegistrationForm["uploads"],
  ) => {
    if (!file) {
      console.log("UPLOAD_SKIP - No file provided", { field, path });
      return null;
    }

    if (!storage) {
      console.log("UPLOAD_ERROR - Storage is null or undefined", { field, path, fileName: file.name });
      return null;
    }

    try {
      console.log("UPLOAD_START", { field, path, fileName: file.name, fileSize: file.size });
      const storageRef = ref(storage, path);

      console.log("NETWORK STEP 1 - Before uploadBytes", { field, fileName: file.name, operation: `Upload ${label}` });
      await withTimeout(uploadBytes(storageRef, file), 25000, `Upload ${label}`);
      console.log("NETWORK STEP 1 - After uploadBytes", { field, fileName: file.name, operation: `Upload ${label}` });
      console.log("UPLOAD_BYTES_DONE", { field, path, fileName: file.name });

      console.log("NETWORK STEP 2 - Before getDownloadURL", {
        field,
        fileName: file.name,
        path,
        operation: `Get Download URL - ${label}`,
      });
      const downloadUrl = await withTimeout(getDownloadURL(storageRef), 25000, `Get Download URL - ${label}`);
      console.log("NETWORK STEP 2 - After getDownloadURL", {
        field,
        fileName: file.name,
        path,
        operation: `Get Download URL - ${label}`,
      });
      console.log("UPLOAD_SUCCESS", { field, path, fileName: file.name, url: downloadUrl });
      return downloadUrl;
    } catch (error) {
      console.error("UPLOAD_FAILURE", { field, path, fileName: file.name, error });
      if (error instanceof Error) {
        console.error("UPLOAD_ERROR_DETAILS", { field, fileName: file.name, message: error.message, stack: error.stack });
      }
      return null;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("STEP 1 - Submit clicked");

    if (isSubmitting) {
      return;
    }

    if (!validateStep()) {
      console.log("VALIDATION_FAILED - Form validation failed");
      return;
    }

    console.log("STEP 2 - Current user", user);
    console.log("STEP 3 - Firebase App", app);
    console.log("STEP 4 - Firestore", db);
    console.log("STEP 5 - Storage", storage);

    if (loading) {
      console.log("ERROR - Auth state is still loading");
      setSubmitMessage("Finishing sign in. Please wait a moment and submit again.");
      return;
    }

    if (!db) {
      console.log("ERROR - Firestore db is null or undefined");
      setSubmitMessage("Firestore is not configured yet. Please contact support.");
      return;
    }

    if (!user?.uid) {
      console.log("ERROR - User or user.uid is null or undefined");
      setSubmitMessage("Please sign in to continue before submitting registration.");
      return;
    }

    if (assistedBySales && vendorConsent && vendorConsentSetAt && Date.now() - vendorConsentSetAt > VENDOR_CONSENT_MAX_AGE_MS) {
      setVendorConsent(null);
      setVendorConsentSetAt(null);
      setSubmitMessage("The vendor's mobile verification has expired (valid for 30 minutes). Please verify the OTP again, then submit right away.");
      return;
    }

    if (assistedBySales && (!vendorConsent || vendorConsent.phoneE164 !== toIndianPhoneE164(form.mobile))) {
      setSubmitMessage("Please verify the vendor's current mobile number with OTP before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    let uploadWarning = false;
    let currentOperation = "uploading documents";

    try {
      console.log("STEP 6 - Starting uploads");

      const uploadedDocuments = {
        logo: await uploadFile(form.uploads.logo, `vendors/${user.uid}/logo-${form.uploads.logo?.name ?? "logo"}`, "Logo", "logo"),
        kitchenPhotos: await Promise.all(
          form.uploads.kitchenPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/kitchen-${index + 1}-${file.name}`, `Kitchen Photo ${index + 1}`, "kitchenPhotos")),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        foodPhotos: await Promise.all(
          form.uploads.foodPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/food-${index + 1}-${file.name}`, `Food Photo ${index + 1}`, "foodPhotos")),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        staffPhotos: await Promise.all(
          form.uploads.staffPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/staff-${index + 1}-${file.name}`, `Staff Photo ${index + 1}`, "staffPhotos")),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        menuPdf: await uploadFile(form.uploads.menuPdf, `vendors/${user.uid}/menu-${form.uploads.menuPdf?.name ?? "menu"}`, "Menu PDF", "menuPdf"),
        fssai: await uploadFile(form.uploads.fssai, `vendors/${user.uid}/fssai-${form.uploads.fssai?.name ?? "fssai"}`, "FSSAI Document", "fssai"),
        gst: await uploadFile(form.uploads.gst, `vendors/${user.uid}/gst-${form.uploads.gst?.name ?? "gst"}`, "GST Document", "gst"),
      };

      console.log("STEP 7 - Upload complete", uploadedDocuments);

      if (
        (form.uploads.logo && !uploadedDocuments.logo) ||
        (form.uploads.kitchenPhotos.length > 0 && uploadedDocuments.kitchenPhotos.length === 0) ||
        (form.uploads.foodPhotos.length > 0 && uploadedDocuments.foodPhotos.length === 0) ||
        (form.uploads.staffPhotos.length > 0 && uploadedDocuments.staffPhotos.length === 0) ||
        (form.uploads.menuPdf && !uploadedDocuments.menuPdf) ||
        (form.uploads.fssai && !uploadedDocuments.fssai) ||
        (form.uploads.gst && !uploadedDocuments.gst)
      ) {
        uploadWarning = true;
        console.log("UPLOAD_WARNING - Some files failed to upload but proceeding with Firestore save");
      }

      const profileCompletion = calculateProfileCompletion(form);
      currentOperation = "generating a registration number";
      const generatedRegistrationNumber = await getNextVendorRegistrationNumber(form.providerCategory);
      const vendorDoc = {
        vendorId: generatedRegistrationNumber,
        registrationNumber: generatedRegistrationNumber,
        userId: assistedBySales ? vendorConsent!.vendorUid : user.uid,
        ownerUid: assistedBySales ? vendorConsent!.vendorUid : user.uid,
        salesExecutiveId: assistedBySales ? user.uid : null,
        salesExecutiveName: assistedBySales ? (user.displayName || user.phoneNumber || "Sales executive") : null,
        assignedSalesExecutiveId: assistedBySales ? user.uid : null,
        assignedSalesExecutiveName: assistedBySales ? (user.displayName || user.phoneNumber || "Sales executive") : null,
        assignedTo: assistedBySales ? (user.displayName || user.phoneNumber || "Sales executive") : null,
        registrationSource: assistedBySales ? "sales_executive" : "vendor_self",
        ownershipStatus: assistedBySales ? "ownership_verified" : "self_registered",
        vendorConsentId: assistedBySales ? vendorConsent!.consentId : null,
        phoneE164: toIndianPhoneE164(form.mobile),
        providerCategory: form.providerCategory,
        providerCategoryLabel: providerCategories.find((category) => category.value === form.providerCategory)?.label ?? "Service Provider",
        businessName: form.businessName.trim(),
        ownerName: form.ownerName.trim(),
        mobile: toIndianPhoneE164(form.mobile),
        whatsapp: toIndianPhoneE164(form.whatsapp),
        email: form.email.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        areasServed: form.areasServed.trim(),
        address: form.address.trim(),
        googleMapsLink: form.googleMapsLink.trim(),
        yearsExperience: form.yearsExperience.trim(),
        servicesDescription: form.servicesDescription.trim(),
        categoryDetails: {
          venueType: form.providerCategory === "venue_banquet" ? form.venueType.trim() : "",
          venueSetting: form.providerCategory === "venue_banquet" ? form.venueSetting : "",
          parkingAvailable: form.providerCategory === "venue_banquet" ? form.parkingAvailable : "",
          roomsAvailable: form.providerCategory === "venue_banquet" ? form.roomsAvailable : "",
        },
        services: {
          veg: form.services.veg,
          nonVeg: form.services.nonVeg,
          jain: form.services.jain,
          liveCounter: form.services.liveCounter,
          outdoorCatering: form.services.outdoorCatering,
          birthday: form.services.birthday,
          wedding: form.services.wedding,
          corporate: form.services.corporate,
          houseParty: form.services.houseParty,
        },
        minGuests: Number(form.minGuests),
        maxGuests: Number(form.maxGuests),
        pricing: {
          startingPrice: Number(form.pricing.startingPrice),
          silverPackage: Number(form.pricing.silverPackage),
          goldPackage: Number(form.pricing.goldPackage),
          royalPackage: Number(form.pricing.royalPackage),
          travelCharges: Number(form.pricing.travelCharges),
          advancePercentage: Number(form.pricing.advancePercentage),
        },
        socialLinks: {
          instagram: form.social.instagram.trim(),
          facebook: form.social.facebook.trim(),
          website: form.social.website.trim(),
          googleBusinessProfile: form.social.googleBusinessProfile.trim(),
          googleReviewLink: form.social.googleReviewLink.trim(),
        },
        uploadedFiles: {
          logo: uploadedDocuments.logo,
          kitchenPhotos: uploadedDocuments.kitchenPhotos,
          foodPhotos: uploadedDocuments.foodPhotos,
          staffPhotos: uploadedDocuments.staffPhotos,
          menuPdf: uploadedDocuments.menuPdf,
          fssai: uploadedDocuments.fssai,
          gst: uploadedDocuments.gst,
        },
        leadStage: "Registered",
        profileCompletion,
        verificationStatus: "Pending",
        source: assistedBySales ? "Sales Executive Assisted Registration" : "Vendor Acquisition Campaign",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("STEP 8 - Vendor object", vendorDoc);
      console.log("STEP 9 - Writing Firestore", { collection: "vendors", db: Boolean(db), registrationNumber: generatedRegistrationNumber });

      console.log("NETWORK STEP 3 - Before setDoc", { operation: "Firestore setDoc", registrationNumber: generatedRegistrationNumber });
      currentOperation = "saving the vendor profile";
      await withTimeout(
        setDoc(doc(db, "vendors", generatedRegistrationNumber), vendorDoc),
        25000,
        "Firestore setDoc",
      );
      console.log("NETWORK STEP 3 - After setDoc", { operation: "Firestore setDoc", registrationNumber: generatedRegistrationNumber });

      console.log("STEP 10 - Firestore write success", { docId: generatedRegistrationNumber, vendorId: vendorDoc.vendorId });

      if (assistedBySales) {
        currentOperation = "saving the partner onboarding record";
        await setDoc(doc(db, "partnerOnboarding", generatedRegistrationNumber), {
          vendorId: generatedRegistrationNumber,
          businessName: vendorDoc.businessName,
          ownerName: vendorDoc.ownerName,
          phoneE164: vendorDoc.phoneE164,
          city: vendorDoc.city,
          category: vendorDoc.providerCategoryLabel,
          address: vendorDoc.address,
          salesExecutiveId: user.uid,
          salesExecutiveName: vendorDoc.salesExecutiveName,
          ownerUid: vendorConsent!.vendorUid,
          vendorConsentId: vendorConsent!.consentId,
          status: "ownership_verified",
          registrationSource: "sales_executive",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        currentOperation = "updating your account role";
        await setDoc(doc(db, "users", user.uid), {
          role: "vendor",
          birthDate: form.birthDate,
          anniversaryApplicable: form.anniversaryApplicable === "yes",
          anniversaryDate: form.anniversaryApplicable === "yes" ? form.anniversaryDate : null,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      currentOperation = "sending the registration alert";
      await sendVendorRegistrationAlert({
        businessName: vendorDoc.businessName,
        ownerName: vendorDoc.ownerName,
        mobile: vendorDoc.mobile,
        whatsapp: vendorDoc.whatsapp,
        email: vendorDoc.email,
        state: vendorDoc.state,
        city: vendorDoc.city,
        complianceStatus: vendorDoc.verificationStatus,
        source: vendorDoc.source,
        campaign: "Vendor Registration Wizard",
        createdAt: new Date().toISOString(),
      });

      if (uploadWarning) {
        setSubmitMessage("Registration submitted, but some document uploads failed. You can update uploads later from your dashboard.");
      } else {
        setSubmitMessage(assistedBySales ? "Registration submitted with vendor OTP consent. It is now awaiting admin approval." : "Registration submitted successfully. Our team will verify your profile shortly.");
      }
      setRegistrationNumber(generatedRegistrationNumber);
      setCopyMessage("");

      console.log("STEP 11 - Registration complete and confirmation panel shown");
    } catch (error) {
      console.error("FIRESTORE_WRITE_FAILED - Error details:", { failedDuring: currentOperation });
      if (error instanceof Error) {
        console.error("error.name:", error.name);
        console.error("error.message:", error.message);
        console.error("error.stack:", error.stack);
        if ("code" in error) {
          console.error("error.code:", (error as { code?: string }).code);
        }
      } else if (typeof error === "object" && error !== null) {
        console.error("error object:", error);
        console.error("error.code:", (error as { code?: string }).code);
        console.error("error.message:", (error as { message?: string }).message);
      } else {
        console.error("error (non-Error):", error);
      }

      setSubmitMessage(
        error instanceof Error
          ? `Unable to submit registration while ${currentOperation}. ${error.message}`
          : `Unable to submit registration while ${currentOperation}. Please try again later.`,
      );
    } finally {
      console.log("FINALLY_BLOCK - Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Provider Category
              <select value={form.providerCategory} onChange={(event) => updateField("providerCategory", event.target.value as ProviderCategory)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]">
                <option value="">Select your category</option>
                {providerCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
              {errors.providerCategory ? <p className="mt-1 text-sm text-red-600">{errors.providerCategory}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Business Name
              <input value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="The Royal Caterers" />
              {errors.businessName ? <p className="mt-1 text-sm text-red-600">{errors.businessName}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Owner Name
              <input value={form.ownerName} onChange={(event) => updateField("ownerName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="Amit Sharma" />
              {errors.ownerName ? <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mobile
              <IndiaPhoneInput value={form.mobile} onChange={(value) => updateField("mobile", value)} required className="mt-2" />
              {errors.mobile ? <p className="mt-1 text-sm text-red-600">{errors.mobile}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp
              <IndiaPhoneInput value={form.whatsapp} onChange={(value) => updateField("whatsapp", value)} required className="mt-2" />
              {errors.whatsapp ? <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="vendor@example.com" />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              State / Union Territory
              <select
                value={form.state}
                onChange={(event) => {
                  updateField("state", event.target.value);
                  updateField("city", "");
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]"
              >
                <option value="">Select state or union territory</option>
                {INDIA_STATES.map((item) => (
                  <option key={item.code} value={item.name}>{item.name}</option>
                ))}
              </select>
              {errors.state ? <p className="mt-1 text-sm text-red-600">{errors.state}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              City / Town
              <select
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                disabled={!form.state}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">{form.state ? "Select city or town" : "Select a state first"}</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city ? <p className="mt-1 text-sm text-red-600">{errors.city}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Areas Served
              <input value={form.areasServed} onChange={(event) => updateField("areasServed", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="Noida, Gurgaon, Faridabad" />
              {errors.areasServed ? <p className="mt-1 text-sm text-red-600">{errors.areasServed}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Address
              <input value={form.address} onChange={(event) => updateField("address", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="Sector 18, Noida" />
              {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Google Maps Link
              <input value={form.googleMapsLink} onChange={(event) => updateField("googleMapsLink", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://maps.google.com/.." />
              {errors.googleMapsLink ? <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Years Experience
              <input value={form.yearsExperience} onChange={(event) => updateField("yearsExperience", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="12" />
              {errors.yearsExperience ? <p className="mt-1 text-sm text-red-600">{errors.yearsExperience}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Date of Birth
              <input type="date" max={new Date().toISOString().slice(0, 10)} value={form.birthDate} onChange={(event) => updateField("birthDate", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" />
              {errors.birthDate ? <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Anniversary
              <select value={form.anniversaryApplicable} onChange={(event) => {
                updateField("anniversaryApplicable", event.target.value as "" | "yes" | "no");
                if (event.target.value === "no") updateField("anniversaryDate", "");
              }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]">
                <option value="">Select</option>
                <option value="yes">Applicable (Married)</option>
                <option value="no">N/A (Not married)</option>
              </select>
              {errors.anniversaryApplicable ? <p className="mt-1 text-sm text-red-600">{errors.anniversaryApplicable}</p> : null}
            </label>
            {form.anniversaryApplicable === "yes" ? (
              <label className="block text-sm font-medium text-slate-700">
                Anniversary Date
                <input type="date" max={new Date().toISOString().slice(0, 10)} value={form.anniversaryDate} onChange={(event) => updateField("anniversaryDate", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" />
                {errors.anniversaryDate ? <p className="mt-1 text-sm text-red-600">{errors.anniversaryDate}</p> : null}
              </label>
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {form.providerCategory === "halwai_caterer" ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Service Categories</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { key: "veg", label: "Veg" }, { key: "nonVeg", label: "Non Veg" },
                    { key: "jain", label: "Jain" }, { key: "liveCounter", label: "Live Counter" },
                    { key: "outdoorCatering", label: "Outdoor Catering" }, { key: "birthday", label: "Birthday" },
                    { key: "wedding", label: "Wedding" }, { key: "corporate", label: "Corporate" },
                    { key: "houseParty", label: "House Party" },
                  ].map((service) => (
                    <label key={service.key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <span>{service.label}</span>
                      <input type="checkbox" checked={form.services[service.key as keyof typeof form.services]} onChange={(event) => updateServiceField(service.key as keyof typeof form.services, event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#6D28D9] focus:ring-[#0F172A]" />
                    </label>
                  ))}
                </div>
                {errors.services ? <p className="mt-2 text-sm text-red-600">{errors.services}</p> : null}
              </div>
            ) : (
              <label className="block text-sm font-medium text-slate-700">
                Services / Packages Offered
                <textarea value={form.servicesDescription} onChange={(event) => updateField("servicesDescription", event.target.value)} className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="Describe your services, packages, equipment, style and event types." />
                {errors.servicesDescription ? <p className="mt-1 text-sm text-red-600">{errors.servicesDescription}</p> : null}
              </label>
            )}

            {form.providerCategory === "venue_banquet" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Venue Type
                  <input value={form.venueType} onChange={(event) => updateField("venueType", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="Banquet hall, lawn, farmhouse, resort..." />
                  {errors.venueType ? <p className="mt-1 text-sm text-red-600">{errors.venueType}</p> : null}
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Venue Setting
                  <select value={form.venueSetting} onChange={(event) => updateField("venueSetting", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]">
                    <option value="">Select setting</option><option value="indoor">Indoor</option><option value="outdoor">Outdoor</option><option value="both">Indoor & Outdoor</option>
                  </select>
                  {errors.venueSetting ? <p className="mt-1 text-sm text-red-600">{errors.venueSetting}</p> : null}
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Parking Available
                  <select value={form.parkingAvailable} onChange={(event) => updateField("parkingAvailable", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Rooms Available
                  <select value={form.roomsAvailable} onChange={(event) => updateField("roomsAvailable", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><option value="">Select</option><option value="yes">Yes</option><option value="no">No</option></select>
                </label>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Minimum Event Capacity
                <input type="number" value={form.minGuests} onChange={(event) => updateField("minGuests", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" />
                {errors.minGuests ? <p className="mt-1 text-sm text-red-600">{errors.minGuests}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Maximum Event Capacity
                <input type="number" value={form.maxGuests} onChange={(event) => updateField("maxGuests", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" />
                {errors.maxGuests ? <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p> : null}
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Starting Price
              <input type="number" value={form.pricing.startingPrice} onChange={(event) => updatePricingField("startingPrice", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="450" />
              {errors.startingPrice ? <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Silver Package
              <input type="number" value={form.pricing.silverPackage} onChange={(event) => updatePricingField("silverPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="9000" />
              {errors.silverPackage ? <p className="mt-1 text-sm text-red-600">{errors.silverPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Gold Package
              <input type="number" value={form.pricing.goldPackage} onChange={(event) => updatePricingField("goldPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="18000" />
              {errors.goldPackage ? <p className="mt-1 text-sm text-red-600">{errors.goldPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Royal Package
              <input type="number" value={form.pricing.royalPackage} onChange={(event) => updatePricingField("royalPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="30000" />
              {errors.royalPackage ? <p className="mt-1 text-sm text-red-600">{errors.royalPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Travel Charges
              <input type="number" value={form.pricing.travelCharges} onChange={(event) => updatePricingField("travelCharges", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="1500" />
              {errors.travelCharges ? <p className="mt-1 text-sm text-red-600">{errors.travelCharges}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Advance %
              <input type="number" value={form.pricing.advancePercentage} onChange={(event) => updatePricingField("advancePercentage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="50" />
              {errors.advancePercentage ? <p className="mt-1 text-sm text-red-600">{errors.advancePercentage}</p> : null}
            </label>
          </div>
        );
      case 4:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Instagram
              <input value={form.social.instagram} onChange={(event) => updateSocialField("instagram", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://instagram.com/yourbrand" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Facebook
              <input value={form.social.facebook} onChange={(event) => updateSocialField("facebook", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://facebook.com/yourbrand" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Website
              <input value={form.social.website} onChange={(event) => updateSocialField("website", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://yourbrand.com" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Google Business Profile
              <input value={form.social.googleBusinessProfile} onChange={(event) => updateSocialField("googleBusinessProfile", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://maps.google.com/..." />
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Google Review Link
              <input value={form.social.googleReviewLink} onChange={(event) => updateSocialField("googleReviewLink", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F172A]" placeholder="https://g.page/r/your-review" />
            </label>
            {errors.social ? <p className="md:col-span-2 text-sm text-red-600">{errors.social}</p> : null}
          </div>
        );
      case 5:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Logo
              <input type="file" accept="image/*" onChange={(event) => handleFileChange(event, "logo")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.logo ? <p className="mt-1 text-sm text-red-600">{errors.logo}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "Kitchen Photos" : "Portfolio Photos"}
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "kitchenPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.kitchenPhotos ? <p className="mt-1 text-sm text-red-600">{errors.kitchenPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "Food Photos" : "Additional Portfolio Photos (Optional)"}
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "foodPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.foodPhotos ? <p className="mt-1 text-sm text-red-600">{errors.foodPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "Staff Photos" : "Team / Setup Photos (Optional)"}
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "staffPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.staffPhotos ? <p className="mt-1 text-sm text-red-600">{errors.staffPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "Menu PDF" : "Service Brochure (Optional)"}
              <input type="file" accept="application/pdf" onChange={(event) => handleFileChange(event, "menuPdf")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.menuPdf ? <p className="mt-1 text-sm text-red-600">{errors.menuPdf}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "FSSAI (Optional)" : "Business Licence (Optional)"}
              <input type="file" accept="application/pdf,image/*" onChange={(event) => handleFileChange(event, "fssai")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.fssai ? <p className="mt-1 text-sm text-red-600">{errors.fssai}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {form.providerCategory === "halwai_caterer" ? "GST (Optional)" : "GST (Optional)"}
              <input type="file" accept="application/pdf,image/*" onChange={(event) => handleFileChange(event, "gst")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.gst ? <p className="mt-1 text-sm text-red-600">{errors.gst}</p> : null}
            </label>
            {assistedBySales ? (
              <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Vendor consent verification</p>
                <p className="mt-2 text-sm leading-6 text-amber-900">Send an OTP to <strong>{toIndianPhoneE164(form.mobile)}</strong>. Ask the vendor to read the OTP to you, then verify it here.</p>
                <div id="vendor-consent-recaptcha" />
                {!vendorConsent ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto]">
                    <button type="button" onClick={() => void handleSendVendorOtp()} disabled={otpBusy || otpResendSeconds > 0} className="rounded-full border border-amber-400 bg-white px-5 py-3 text-sm font-semibold text-amber-900 disabled:opacity-60">{otpBusy ? "Please wait..." : otpResendSeconds > 0 ? `New OTP in ${otpResendSeconds}s` : otpConfirmation ? "Send new OTP" : "Send OTP"}</button>
                    <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} disabled={!otpConfirmation || otpBusy} value={vendorOtp} onChange={(event) => setVendorOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter latest 6-digit OTP" className="rounded-2xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-600 disabled:bg-amber-100 disabled:opacity-70" />
                    <button type="button" onClick={() => void handleVerifyVendorOtp()} disabled={otpBusy || !otpConfirmation || vendorOtp.length !== 6} className="rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Verify OTP</button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <p className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">✓ Vendor mobile verified</p>
                    <p className="text-xs font-medium text-amber-700">This verification is valid for 30 minutes. Please finish and submit the registration now — if it expires, you&apos;ll need to verify the vendor&apos;s OTP again.</p>
                  </div>
                )}
                {otpMessage ? <p className="mt-3 text-sm font-medium text-amber-900">{otpMessage}</p> : null}
                {errors.vendorConsent ? <p className="mt-2 text-sm text-red-600">{errors.vendorConsent}</p> : null}
              </section>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-5xl rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F172A]">Vendor Onboarding</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Become a BookMyHalwai Partner</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Vendor onboarding is now live. Customer booking will launch after verified partners are onboarded.</p>
          </div>
          <div className="rounded-2xl border border-[#C4B5FD] bg-[#F5F3FF] px-4 py-3 text-sm font-medium text-[#0F172A]">Step {progressLabel}</div>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> LIVE Onboarding
            </p>
            <p className="mt-3 text-sm leading-7 text-emerald-900">
              Vendor onboarding is now live. Customer booking will launch after verified partners are onboarded.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-emerald-900">
            {trustPoints.map((item) => (
              <li key={item} className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

        {registrationNumber ? (
          <div className="mt-8 rounded-3xl border border-emerald-300 bg-emerald-50 px-6 py-8 text-center sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Registration Successful</p>
            <h2 className="mt-3 text-3xl font-semibold text-emerald-950">Your BookMyHalwai Vendor Registration Number is:</h2>
            <p className="mt-5 rounded-2xl border border-emerald-300 bg-white px-4 py-4 text-2xl font-bold tracking-wide text-emerald-800">{registrationNumber}</p>
            <p className="mt-4 text-sm text-emerald-900">Please save this number for future communication and verification.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCopyRegistrationNumber}
                className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
              >
                Copy Registration Number
              </button>
              <button
                type="button"
                onClick={() => router.push("/vendor/dashboard")}
                className="w-full rounded-full border border-emerald-400 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 sm:w-auto"
              >
                Go to Dashboard
              </button>
            </div>

            {copyMessage ? <p className="mt-3 text-sm font-medium text-emerald-700">{copyMessage}</p> : null}
            {submitMessage ? <p className="mt-2 text-sm text-emerald-700">{submitMessage}</p> : null}
          </div>
        ) : (
          <form className="vendor-form mt-8 space-y-6" onSubmit={handleSubmit}>
            {renderStep()}

            {submitMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{submitMessage}</div> : null}

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
              <button type="button" onClick={prevStep} disabled={step === 1} className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">Back</button>

              {step < steps.length ? (
                <button type="button" onClick={nextStep} className="w-full rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B] sm:w-auto">Continue</button>
              ) : (
                <button type="submit" disabled={isSubmitting || (assistedBySales && !vendorConsent)} className="w-full rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">{isSubmitting ? "Submitting..." : "Submit Registration"}</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
