import type { Metadata } from "next";
import RegistrationWizard from "@/components/vendor/RegistrationWizard";

export const metadata: Metadata = {
  title: "Become a BookMyHalwai Partner | Vendor Registration",
  description: "Register as a BookMyHalwai vendor and start onboarding for India’s trusted catering marketplace.",
};

export default function VendorRegisterPage() {
  return <RegistrationWizard />;
}
