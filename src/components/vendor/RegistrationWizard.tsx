"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import ProgressStepper from "@/components/vendor/ProgressStepper";

const steps = [
  "Business Information",
  "Service Details",
  "Pricing",
  "Documents & Media",
  "Bank Details",
];

const serviceCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Jaipur",
];

const cuisineOptions = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Continental",
  "Street Food",
  "Desserts",
  "Gujarati",
  "Rajasthani",
  "Mughlai",
  "Mediterranean",
];

const initialState = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  gst: "",
  fssai: "",
  pan: "",
  cities: [] as string[],
  cuisines: [] as string[],
  experience: "",
  services: {
    veg: false,
    nonVeg: false,
    jainFood: false,
    liveCounters: false,
    outdoorCatering: false,
  },
  minGuests: "",
  maxGuests: "",
  pricing: {
    startingPrice: "",
    premiumPackage: "",
    luxuryPackage: "",
    travelCharges: "",
    advancePercentage: "",
  },
  documents: {
    kitchenPhotos: [] as File[],
    logo: null as File | null,
    fssaiCertificate: null as File | null,
    gstCertificate: null as File | null,
  },
  bankDetails: {
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  },
};

type RegistrationForm = typeof initialState;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function toNumber(value: string) {
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? 0 : numericValue;
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

  const updateNestedField = <T extends keyof RegistrationForm["pricing"]>(
    field: T,
    value: RegistrationForm["pricing"][T],
  ) => {
    setForm((current) => ({
      ...current,
      pricing: { ...current.pricing, [field]: value },
    }));
  };

  const updateServiceField = <T extends keyof RegistrationForm["services"]>(
    field: T,
    value: RegistrationForm["services"][T],
  ) => {
    setForm((current) => ({
      ...current,
      services: { ...current.services, [field]: value },
    }));
  };

  const updateBankField = <T extends keyof RegistrationForm["bankDetails"]>(
    field: T,
    value: RegistrationForm["bankDetails"][T],
  ) => {
    setForm((current) => ({
      ...current,
      bankDetails: { ...current.bankDetails, [field]: value },
    }));
  };

  const toggleMultiSelect = (field: "cities" | "cuisines", value: string) => {
    setForm((current) => {
      const selectedValues = current[field];
      return {
        ...current,
        [field]: selectedValues.includes(value)
          ? selectedValues.filter((item) => item !== value)
          : [...selectedValues, value],
      };
    });
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof RegistrationForm["documents"],
  ) => {
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
      documents: { ...current.documents, [field]: file },
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleMultipleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== files.length) {
      setErrors((current) => ({
        ...current,
        kitchenPhotos: "Each image must be less than 5MB.",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      documents: { ...current.documents, kitchenPhotos: validFiles },
    }));
    setErrors((current) => ({ ...current, kitchenPhotos: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.businessName.trim()) newErrors.businessName = "Business name is required.";
      if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required.";
      if (!form.phone.trim()) newErrors.phone = "Mobile number is required.";
      if (!form.email.trim()) newErrors.email = "Email is required.";
      if (!form.fssai.trim()) newErrors.fssai = "FSSAI number is required.";
      if (!form.pan.trim()) newErrors.pan = "PAN number is required.";
    }

    if (step === 2) {
      if (form.cities.length === 0) newErrors.cities = "Select at least one service city.";
      if (!form.experience.trim()) newErrors.experience = "Years of experience is required.";
      if (form.cuisines.length === 0) newErrors.cuisines = "Select at least one cuisine type.";
      if (!form.services.veg && !form.services.nonVeg && !form.services.jainFood) {
        newErrors.services = "Select at least one food service type.";
      }
      if (!form.minGuests.trim()) newErrors.minGuests = "Minimum guests is required.";
      if (!form.maxGuests.trim()) newErrors.maxGuests = "Maximum guests is required.";
      if (Number(form.maxGuests) < Number(form.minGuests)) {
        newErrors.maxGuests = "Maximum guests cannot be less than minimum guests.";
      }
    }

    if (step === 3) {
      if (!form.pricing.startingPrice.trim()) newErrors.startingPrice = "Starting price is required.";
      if (!form.pricing.premiumPackage.trim()) newErrors.premiumPackage = "Premium price is required.";
      if (!form.pricing.luxuryPackage.trim()) newErrors.luxuryPackage = "Luxury price is required.";
      if (!form.pricing.travelCharges.trim()) newErrors.travelCharges = "Travel charges are required.";
      if (!form.pricing.advancePercentage.trim()) newErrors.advancePercentage = "Advance percentage is required.";
    }

    if (step === 4) {
      if (form.documents.kitchenPhotos.length === 0) newErrors.kitchenPhotos = "Upload at least one kitchen photo.";
      if (!form.documents.logo) newErrors.logo = "Business logo is required.";
      if (!form.documents.fssaiCertificate) newErrors.fssaiCertificate = "FSSAI certificate is required.";
    }

    if (step === 5) {
      if (!form.bankDetails.accountHolder.trim()) newErrors.accountHolder = "Account holder is required.";
      if (!form.bankDetails.bankName.trim()) newErrors.bankName = "Bank name is required.";
      if (!form.bankDetails.accountNumber.trim()) newErrors.accountNumber = "Account number is required.";
      if (!form.bankDetails.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required.";
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

  const uploadFile = async (file: File, path: string) => {
    if (!storage) {
      throw new Error("Storage is not configured.");
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep()) {
      return;
    }

    if (!db || !storage || !user?.uid) {
      setSubmitMessage("Authentication or Firestore is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const uploadedDocuments = {
        kitchenPhotos: await Promise.all(
          form.documents.kitchenPhotos.map((file, index) =>
            uploadFile(file, `vendors/${user.uid}/kitchen-${index + 1}-${file.name}`),
          ),
        ),
        logo: await uploadFile(form.documents.logo!, `vendors/${user.uid}/logo-${form.documents.logo!.name}`),
        fssaiCertificate: await uploadFile(
          form.documents.fssaiCertificate!,
          `vendors/${user.uid}/fssai-${form.documents.fssaiCertificate!.name}`,
        ),
        gstCertificate: form.documents.gstCertificate
          ? await uploadFile(form.documents.gstCertificate, `vendors/${user.uid}/gst-${form.documents.gstCertificate.name}`)
          : null,
      };

      const vendorDoc = {
        vendorId: `vendor-${Date.now()}`,
        userId: user.uid,
        businessName: form.businessName.trim(),
        ownerName: form.ownerName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        gst: form.gst.trim(),
        fssai: form.fssai.trim(),
        pan: form.pan.trim(),
        cities: form.cities,
        cuisines: form.cuisines,
        experience: form.experience.trim(),
        services: {
          veg: form.services.veg,
          nonVeg: form.services.nonVeg,
          jainFood: form.services.jainFood,
          liveCounters: form.services.liveCounters,
          outdoorCatering: form.services.outdoorCatering,
        },
        pricing: {
          startingPrice: Number(form.pricing.startingPrice),
          premiumPackage: Number(form.pricing.premiumPackage),
          luxuryPackage: Number(form.pricing.luxuryPackage),
          travelCharges: Number(form.pricing.travelCharges),
          advancePercentage: Number(form.pricing.advancePercentage),
        },
        documents: uploadedDocuments,
        bankDetails: {
          accountHolder: form.bankDetails.accountHolder.trim(),
          bankName: form.bankDetails.bankName.trim(),
          accountNumber: form.bankDetails.accountNumber.trim(),
          ifscCode: form.bankDetails.ifscCode.trim(),
          upiId: form.bankDetails.upiId.trim(),
        },
        verificationStatus: "Pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "vendors"), vendorDoc);
      setSubmitMessage("Registration Submitted Successfully");
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error(error);
      setSubmitMessage(error instanceof Error ? error.message : "Unable to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Business Name
                <input
                  value={form.businessName}
                  onChange={(event) => updateField("businessName", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="The Royal Caterers"
                />
                {errors.businessName ? <p className="mt-1 text-sm text-red-600">{errors.businessName}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Owner Name
                <input
                  value={form.ownerName}
                  onChange={(event) => updateField("ownerName", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="Amit Sharma"
                />
                {errors.ownerName ? <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Mobile Number
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="+91 9876543210"
                />
                {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="vendor@example.com"
                />
                {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                GST Number (Optional)
                <input
                  value={form.gst}
                  onChange={(event) => updateField("gst", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="27ABCDE1234F1Z5"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                FSSAI Number
                <input
                  value={form.fssai}
                  onChange={(event) => updateField("fssai", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="12345678901234"
                />
                {errors.fssai ? <p className="mt-1 text-sm text-red-600">{errors.fssai}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                PAN Number
                <input
                  value={form.pan}
                  onChange={(event) => updateField("pan", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="ABCDE1234F"
                />
                {errors.pan ? <p className="mt-1 text-sm text-red-600">{errors.pan}</p> : null}
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Service Cities</p>
              <div className="flex flex-wrap gap-2">
                {serviceCities.map((city) => {
                  const active = form.cities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleMultiSelect("cities", city)}
                      className={`rounded-full px-3 py-2 text-sm ${
                        active
                          ? "bg-orange-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
              {errors.cities ? <p className="text-sm text-red-600">{errors.cities}</p> : null}
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Years of Experience
              <input
                value={form.experience}
                onChange={(event) => updateField("experience", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="10"
              />
              {errors.experience ? <p className="mt-1 text-sm text-red-600">{errors.experience}</p> : null}
            </label>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Cuisine Types</p>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map((cuisine) => {
                  const active = form.cuisines.includes(cuisine);
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleMultiSelect("cuisines", cuisine)}
                      className={`rounded-full px-3 py-2 text-sm ${
                        active
                          ? "bg-orange-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {cuisine}
                    </button>
                  );
                })}
              </div>
              {errors.cuisines ? <p className="text-sm text-red-600">{errors.cuisines}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.services.veg}
                  onChange={(event) => updateServiceField("veg", event.target.checked)}
                />
                Veg
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.services.nonVeg}
                  onChange={(event) => updateServiceField("nonVeg", event.target.checked)}
                />
                Non-Veg
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.services.jainFood}
                  onChange={(event) => updateServiceField("jainFood", event.target.checked)}
                />
                Jain Food
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.services.liveCounters}
                  onChange={(event) => updateServiceField("liveCounters", event.target.checked)}
                />
                Live Counters
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.services.outdoorCatering}
                  onChange={(event) => updateServiceField("outdoorCatering", event.target.checked)}
                />
                Outdoor Catering
              </label>
            </div>
            {errors.services ? <p className="text-sm text-red-600">{errors.services}</p> : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Minimum Guests
                <input
                  type="number"
                  value={form.minGuests}
                  onChange={(event) => updateField("minGuests", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="50"
                />
                {errors.minGuests ? <p className="mt-1 text-sm text-red-600">{errors.minGuests}</p> : null}
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Maximum Guests
                <input
                  type="number"
                  value={form.maxGuests}
                  onChange={(event) => updateField("maxGuests", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                  placeholder="1000"
                />
                {errors.maxGuests ? <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p> : null}
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Starting Price per Plate
              <input
                type="number"
                value={form.pricing.startingPrice}
                onChange={(event) => updateNestedField("startingPrice", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="250"
              />
              {errors.startingPrice ? <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Premium Package Price
              <input
                type="number"
                value={form.pricing.premiumPackage}
                onChange={(event) => updateNestedField("premiumPackage", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="450"
              />
              {errors.premiumPackage ? <p className="mt-1 text-sm text-red-600">{errors.premiumPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Luxury Package Price
              <input
                type="number"
                value={form.pricing.luxuryPackage}
                onChange={(event) => updateNestedField("luxuryPackage", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="700"
              />
              {errors.luxuryPackage ? <p className="mt-1 text-sm text-red-600">{errors.luxuryPackage}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Travel Charges
              <input
                type="number"
                value={form.pricing.travelCharges}
                onChange={(event) => updateNestedField("travelCharges", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="1000"
              />
              {errors.travelCharges ? <p className="mt-1 text-sm text-red-600">{errors.travelCharges}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Advance Percentage
              <input
                type="number"
                value={form.pricing.advancePercentage}
                onChange={(event) => updateNestedField("advancePercentage", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="30"
              />
              {errors.advancePercentage ? <p className="mt-1 text-sm text-red-600">{errors.advancePercentage}</p> : null}
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Kitchen Photos (multiple)
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleFileChange}
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
              {errors.kitchenPhotos ? <p className="mt-1 text-sm text-red-600">{errors.kitchenPhotos}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Business Logo
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event, "logo")}
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
              {errors.logo ? <p className="mt-1 text-sm text-red-600">{errors.logo}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              FSSAI Certificate
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => handleFileChange(event, "fssaiCertificate")}
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
              {errors.fssaiCertificate ? <p className="mt-1 text-sm text-red-600">{errors.fssaiCertificate}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              GST Certificate (Optional)
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => handleFileChange(event, "gstCertificate")}
                className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
              />
            </label>
          </div>
        );
      case 5:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Account Holder
              <input
                value={form.bankDetails.accountHolder}
                onChange={(event) => updateBankField("accountHolder", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="Amit Sharma"
              />
              {errors.accountHolder ? <p className="mt-1 text-sm text-red-600">{errors.accountHolder}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Bank Name
              <input
                value={form.bankDetails.bankName}
                onChange={(event) => updateBankField("bankName", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="HDFC Bank"
              />
              {errors.bankName ? <p className="mt-1 text-sm text-red-600">{errors.bankName}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Account Number
              <input
                value={form.bankDetails.accountNumber}
                onChange={(event) => updateBankField("accountNumber", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="123456789012"
              />
              {errors.accountNumber ? <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              IFSC Code
              <input
                value={form.bankDetails.ifscCode}
                onChange={(event) => updateBankField("ifscCode", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="HDFC0001234"
              />
              {errors.ifscCode ? <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p> : null}
            </label>
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              UPI ID (Optional)
              <input
                value={form.bankDetails.upiId}
                onChange={(event) => updateBankField("upiId", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                placeholder="vendor@upi"
              />
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">
              Vendor Onboarding
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Register as a Vendor
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Complete the steps below to start receiving catering bookings on BookMyHalwai.
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
            Step {progressLabel}
          </div>
        </div>

        <div className="mt-8">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderStep()}

          {submitMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {submitMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {step < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
