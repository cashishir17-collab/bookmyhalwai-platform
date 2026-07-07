"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { app, db, storage } from "@/lib/firebase";
import ProgressStepper from "@/components/vendor/ProgressStepper";

const steps = ["Business", "Services", "Pricing", "Social", "Uploads", "Bank Details"];

const initialState = {
  businessName: "",
  ownerName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  city: "",
  areasServed: "",
  address: "",
  googleMapsLink: "",
  yearsExperience: "",
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
  bank: {
    accountHolder: "",
    bank: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
  },
};

type RegistrationForm = typeof initialState;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

function calculateProfileCompletion(form: RegistrationForm) {
  const checks = [
    form.businessName.trim(),
    form.ownerName.trim(),
    form.mobile.trim(),
    form.whatsapp.trim(),
    form.email.trim(),
    form.city.trim(),
    form.areasServed.trim(),
    form.address.trim(),
    form.googleMapsLink.trim(),
    form.yearsExperience.trim(),
    form.minGuests.trim(),
    form.maxGuests.trim(),
    form.pricing.startingPrice.trim(),
    form.pricing.silverPackage.trim(),
    form.pricing.goldPackage.trim(),
    form.pricing.royalPackage.trim(),
    form.pricing.travelCharges.trim(),
    form.pricing.advancePercentage.trim(),
    form.social.instagram.trim() || form.social.facebook.trim() || form.social.website.trim(),
    form.social.googleBusinessProfile.trim(),
    form.social.googleReviewLink.trim(),
    form.uploads.logo,
    form.uploads.kitchenPhotos.length > 0,
    form.uploads.foodPhotos.length > 0,
    form.uploads.staffPhotos.length > 0,
    form.uploads.menuPdf,
    form.uploads.fssai,
    form.uploads.gst,
    form.bank.accountHolder.trim(),
    form.bank.bank.trim(),
    form.bank.accountNumber.trim(),
    form.bank.ifsc.trim(),
    form.bank.upi.trim(),
  ];

  const filledFields = checks.filter(Boolean).length;
  return Math.round((filledFields / checks.length) * 100);
}

export default function RegistrationWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegistrationForm>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const progressLabel = useMemo(() => `${step} of ${steps.length}`, [step]);

  const updateField = <T extends keyof RegistrationForm>(field: T, value: RegistrationForm[T]) => {
    setForm((current) => ({ ...current, [field]: value }));
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

  const updateBankField = <T extends keyof RegistrationForm["bank"]>(field: T, value: RegistrationForm["bank"][T]) => {
    setForm((current) => ({
      ...current,
      bank: { ...current.bank, [field]: value },
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
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required.";
      if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required.";
      if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required.";
      if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required.";
      if (!form.email.trim()) newErrors.email = "Email is required.";
      if (!form.city.trim()) newErrors.city = "City is required.";
      if (!form.areasServed.trim()) newErrors.areasServed = "Areas served is required.";
      if (!form.address.trim()) newErrors.address = "Address is required.";
      if (!form.googleMapsLink.trim()) newErrors.googleMapsLink = "Google Maps link is required.";
      if (!form.yearsExperience.trim()) newErrors.yearsExperience = "Years of experience is required.";
    }

    if (step === 2) {
      if (!form.services.veg && !form.services.nonVeg && !form.services.jain && !form.services.liveCounter && !form.services.outdoorCatering && !form.services.birthday && !form.services.wedding && !form.services.corporate && !form.services.houseParty) {
        newErrors.services = "Select at least one service or event type.";
      }
      if (!form.minGuests.trim()) newErrors.minGuests = "Minimum guests is required.";
      if (!form.maxGuests.trim()) newErrors.maxGuests = "Maximum guests is required.";
      if (toNumber(form.maxGuests) < toNumber(form.minGuests)) {
        newErrors.maxGuests = "Maximum guests cannot be less than minimum guests.";
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
      if (form.uploads.kitchenPhotos.length === 0) newErrors.kitchenPhotos = "Upload at least one kitchen photo.";
      if (form.uploads.foodPhotos.length === 0) newErrors.foodPhotos = "Upload at least one food photo.";
      if (form.uploads.staffPhotos.length === 0) newErrors.staffPhotos = "Upload at least one staff photo.";
      if (!form.uploads.menuPdf) newErrors.menuPdf = "Menu PDF is required.";
      if (!form.uploads.fssai) newErrors.fssai = "FSSAI document is required.";
      if (!form.uploads.gst) newErrors.gst = "GST document is required.";
    }

    if (step === 6) {
      if (!form.bank.accountHolder.trim()) newErrors.accountHolder = "Account holder is required.";
      if (!form.bank.bank.trim()) newErrors.bank = "Bank name is required.";
      if (!form.bank.accountNumber.trim()) newErrors.accountNumber = "Account number is required.";
      if (!form.bank.ifsc.trim()) newErrors.ifsc = "IFSC code is required.";
      if (!form.bank.upi.trim()) newErrors.upi = "UPI is required.";
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

  const uploadFile = async (file: File | null, path: string, label: string) => {
    if (!file) {
      console.log("UPLOAD_SKIP - No file provided", { path });
      return null;
    }

    if (!storage) {
      console.log("UPLOAD_ERROR - Storage is null or undefined", { path, fileName: file.name });
      return null;
    }

    try {
      console.log("UPLOAD_START", { path, fileName: file.name, fileSize: file.size });
      const storageRef = ref(storage, path);

      console.log("NETWORK STEP 1 - Before uploadBytes", { operation: `Upload ${label}` });
      await withTimeout(uploadBytes(storageRef, file), 25000, `Upload ${label}`);
      console.log("NETWORK STEP 1 - After uploadBytes", { operation: `Upload ${label}` });
      console.log("UPLOAD_BYTES_DONE", { path, fileName: file.name });

      console.log("NETWORK STEP 2 - Before getDownloadURL", { operation: `Get Download URL - ${label}` });
      const downloadUrl = await withTimeout(getDownloadURL(storageRef), 25000, `Get Download URL - ${label}`);
      console.log("NETWORK STEP 2 - After getDownloadURL", { operation: `Get Download URL - ${label}` });
      console.log("UPLOAD_SUCCESS", { path, fileName: file.name, url: downloadUrl });
      return downloadUrl;
    } catch (error) {
      console.error("UPLOAD_FAILURE", { path, fileName: file.name, error });
      if (error instanceof Error) {
        console.error("UPLOAD_ERROR_DETAILS", { message: error.message, stack: error.stack });
      }
      return null;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("STEP 1 - Submit clicked");

    if (!validateStep()) {
      console.log("VALIDATION_FAILED - Form validation failed");
      return;
    }

    console.log("STEP 2 - Current user", user);
    console.log("STEP 3 - Firebase App", app);
    console.log("STEP 4 - Firestore", db);
    console.log("STEP 5 - Storage", storage);

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

    setIsSubmitting(true);
    setSubmitMessage("");

    let uploadWarning = false;

    try {
      console.log("STEP 6 - Starting uploads");

      const uploadedDocuments = {
        logo: await uploadFile(form.uploads.logo, `vendors/${user.uid}/logo-${form.uploads.logo?.name ?? "logo"}`, "Logo"),
        kitchenPhotos: await Promise.all(
          form.uploads.kitchenPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/kitchen-${index + 1}-${file.name}`, `Kitchen Photo ${index + 1}`)),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        foodPhotos: await Promise.all(
          form.uploads.foodPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/food-${index + 1}-${file.name}`, `Food Photo ${index + 1}`)),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        staffPhotos: await Promise.all(
          form.uploads.staffPhotos.map((file, index) => uploadFile(file, `vendors/${user.uid}/staff-${index + 1}-${file.name}`, `Staff Photo ${index + 1}`)),
        ).then((urls) => urls.filter((url): url is string => Boolean(url))),
        menuPdf: await uploadFile(form.uploads.menuPdf, `vendors/${user.uid}/menu-${form.uploads.menuPdf?.name ?? "menu"}`, "Menu PDF"),
        fssai: await uploadFile(form.uploads.fssai, `vendors/${user.uid}/fssai-${form.uploads.fssai?.name ?? "fssai"}`, "FSSAI Document"),
        gst: await uploadFile(form.uploads.gst, `vendors/${user.uid}/gst-${form.uploads.gst?.name ?? "gst"}`, "GST Document"),
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
      const vendorDoc = {
        vendorId: `vendor-${Date.now()}`,
        userId: user.uid,
        businessName: form.businessName.trim(),
        ownerName: form.ownerName.trim(),
        mobile: form.mobile.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        areasServed: form.areasServed.trim(),
        address: form.address.trim(),
        googleMapsLink: form.googleMapsLink.trim(),
        yearsExperience: form.yearsExperience.trim(),
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
        bankDetails: {
          accountHolder: form.bank.accountHolder.trim(),
          bank: form.bank.bank.trim(),
          accountNumber: form.bank.accountNumber.trim(),
          ifsc: form.bank.ifsc.trim(),
          upi: form.bank.upi.trim(),
        },
        leadStage: "Registered",
        profileCompletion,
        verificationStatus: "Pending",
        source: "Vendor Acquisition Campaign",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("STEP 8 - Vendor object", vendorDoc);
      console.log("STEP 9 - Writing Firestore", { collection: "vendors", db: Boolean(db) });

      console.log("NETWORK STEP 3 - Before addDoc", { operation: "Firestore addDoc" });
      const docRef = await withTimeout(
        addDoc(collection(db, "vendors"), vendorDoc),
        25000,
        "Firestore addDoc",
      );
      console.log("NETWORK STEP 3 - After addDoc", { operation: "Firestore addDoc" });

      console.log("STEP 10 - Firestore write success", { docId: docRef.id, vendorId: vendorDoc.vendorId });

      if (uploadWarning) {
        setSubmitMessage("Registration submitted, but some document uploads failed. You can update uploads later from your dashboard.");
      } else {
        setSubmitMessage("Registration Submitted Successfully");
      }

      console.log("STEP 11 - Redirecting to /vendor/dashboard");
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("FIRESTORE_WRITE_FAILED - Error details:");
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
          ? `Unable to submit registration. ${error.message}`
          : "Unable to submit registration. Please try again later.",
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
            <label className="block text-sm font-medium text-slate-700">
              Business Name
              <input value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="The Royal Caterers" />
              {errors.businessName ? <p className="mt-1 text-sm text-red-600">{errors.businessName}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Owner Name
              <input value={form.ownerName} onChange={(event) => updateField("ownerName", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="Amit Sharma" />
              {errors.ownerName ? <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mobile
              <input value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="+91 9876543210" />
              {errors.mobile ? <p className="mt-1 text-sm text-red-600">{errors.mobile}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp
              <input value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="+91 9876543210" />
              {errors.whatsapp ? <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="vendor@example.com" />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              City
              <input value={form.city} onChange={(event) => updateField("city", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="Delhi NCR" />
              {errors.city ? <p className="mt-1 text-sm text-red-600">{errors.city}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Areas Served
              <input value={form.areasServed} onChange={(event) => updateField("areasServed", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="Noida, Gurgaon, Faridabad" />
              {errors.areasServed ? <p className="mt-1 text-sm text-red-600">{errors.areasServed}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Address
              <input value={form.address} onChange={(event) => updateField("address", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="Sector 18, Noida" />
              {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Google Maps Link
              <input value={form.googleMapsLink} onChange={(event) => updateField("googleMapsLink", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://maps.google.com/.." />
              {errors.googleMapsLink ? <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Years Experience
              <input value={form.yearsExperience} onChange={(event) => updateField("yearsExperience", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="12" />
              {errors.yearsExperience ? <p className="mt-1 text-sm text-red-600">{errors.yearsExperience}</p> : null}
            </label>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Service Categories</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { key: "veg", label: "Veg" },
                  { key: "nonVeg", label: "Non Veg" },
                  { key: "jain", label: "Jain" },
                  { key: "liveCounter", label: "Live Counter" },
                  { key: "outdoorCatering", label: "Outdoor Catering" },
                  { key: "birthday", label: "Birthday" },
                  { key: "wedding", label: "Wedding" },
                  { key: "corporate", label: "Corporate" },
                  { key: "houseParty", label: "House Party" },
                ].map((service) => (
                  <label key={service.key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    <span>{service.label}</span>
                    <input type="checkbox" checked={form.services[service.key as keyof typeof form.services]} onChange={(event) => updateServiceField(service.key as keyof typeof form.services, event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                  </label>
                ))}
              </div>
              {errors.services ? <p className="mt-2 text-sm text-red-600">{errors.services}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Minimum Guests
                <input type="number" value={form.minGuests} onChange={(event) => updateField("minGuests", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="50" />
                {errors.minGuests ? <p className="mt-1 text-sm text-red-600">{errors.minGuests}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Maximum Guests
                <input type="number" value={form.maxGuests} onChange={(event) => updateField("maxGuests", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="500" />
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
              <input type="number" value={form.pricing.startingPrice} onChange={(event) => updatePricingField("startingPrice", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="450" />
              {errors.startingPrice ? <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Silver Package
              <input type="number" value={form.pricing.silverPackage} onChange={(event) => updatePricingField("silverPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="9000" />
              {errors.silverPackage ? <p className="mt-1 text-sm text-red-600">{errors.silverPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Gold Package
              <input type="number" value={form.pricing.goldPackage} onChange={(event) => updatePricingField("goldPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="18000" />
              {errors.goldPackage ? <p className="mt-1 text-sm text-red-600">{errors.goldPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Royal Package
              <input type="number" value={form.pricing.royalPackage} onChange={(event) => updatePricingField("royalPackage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="30000" />
              {errors.royalPackage ? <p className="mt-1 text-sm text-red-600">{errors.royalPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Travel Charges
              <input type="number" value={form.pricing.travelCharges} onChange={(event) => updatePricingField("travelCharges", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="1500" />
              {errors.travelCharges ? <p className="mt-1 text-sm text-red-600">{errors.travelCharges}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Advance %
              <input type="number" value={form.pricing.advancePercentage} onChange={(event) => updatePricingField("advancePercentage", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="50" />
              {errors.advancePercentage ? <p className="mt-1 text-sm text-red-600">{errors.advancePercentage}</p> : null}
            </label>
          </div>
        );
      case 4:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Instagram
              <input value={form.social.instagram} onChange={(event) => updateSocialField("instagram", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://instagram.com/yourbrand" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Facebook
              <input value={form.social.facebook} onChange={(event) => updateSocialField("facebook", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://facebook.com/yourbrand" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Website
              <input value={form.social.website} onChange={(event) => updateSocialField("website", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://yourbrand.com" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Google Business Profile
              <input value={form.social.googleBusinessProfile} onChange={(event) => updateSocialField("googleBusinessProfile", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://maps.google.com/..." />
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Google Review Link
              <input value={form.social.googleReviewLink} onChange={(event) => updateSocialField("googleReviewLink", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="https://g.page/r/your-review" />
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
              Kitchen Photos
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "kitchenPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.kitchenPhotos ? <p className="mt-1 text-sm text-red-600">{errors.kitchenPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Food Photos
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "foodPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.foodPhotos ? <p className="mt-1 text-sm text-red-600">{errors.foodPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Staff Photos
              <input type="file" accept="image/*" multiple onChange={(event) => handleMultipleFileChange(event, "staffPhotos")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.staffPhotos ? <p className="mt-1 text-sm text-red-600">{errors.staffPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Menu PDF
              <input type="file" accept="application/pdf" onChange={(event) => handleFileChange(event, "menuPdf")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.menuPdf ? <p className="mt-1 text-sm text-red-600">{errors.menuPdf}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              FSSAI
              <input type="file" accept="application/pdf,image/*" onChange={(event) => handleFileChange(event, "fssai")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.fssai ? <p className="mt-1 text-sm text-red-600">{errors.fssai}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              GST
              <input type="file" accept="application/pdf,image/*" onChange={(event) => handleFileChange(event, "gst")} className="mt-2 block w-full text-sm text-slate-500" />
              {errors.gst ? <p className="mt-1 text-sm text-red-600">{errors.gst}</p> : null}
            </label>
          </div>
        );
      case 6:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Account Holder
              <input value={form.bank.accountHolder} onChange={(event) => updateBankField("accountHolder", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="Amit Sharma" />
              {errors.accountHolder ? <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Bank
              <input value={form.bank.bank} onChange={(event) => updateBankField("bank", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="HDFC Bank" />
              {errors.bank ? <p className="mt-1 text-sm text-red-600">{errors.bank}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Account Number
              <input value={form.bank.accountNumber} onChange={(event) => updateBankField("accountNumber", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="1234567890" />
              {errors.accountNumber ? <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              IFSC
              <input value={form.bank.ifsc} onChange={(event) => updateBankField("ifsc", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="HDFC0001234" />
              {errors.ifsc ? <p className="mt-1 text-sm text-red-600">{errors.ifsc}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              UPI
              <input value={form.bank.upi} onChange={(event) => updateBankField("upi", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400" placeholder="amitsharma@upi" />
              {errors.upi ? <p className="mt-1 text-sm text-red-600">{errors.upi}</p> : null}
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Vendor Onboarding</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Register as a Vendor</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Complete the steps below to start receiving catering bookings on BookMyHalwai.</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">Step {progressLabel}</div>
        </div>

        <div className="mt-8">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderStep()}

          {submitMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{submitMessage}</div> : null}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            <button type="button" onClick={prevStep} disabled={step === 1} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50">Back</button>

            {step < steps.length ? (
              <button type="button" onClick={nextStep} className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700">Continue</button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? "Submitting..." : "Submit Registration"}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
