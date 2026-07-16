import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | BookMyHalwai",
  description: "These Terms govern access to and use of the BookMyHalwai marketplace by customers, vendors, sales executives and other authorised users.",
};

const sections = [
  {
    "heading": "1. Marketplace role",
    "body": "BookMyHalwai provides a technology marketplace that helps users discover and communicate with independent event-service providers. Unless expressly stated, BookMyHalwai is not the provider of catering, venue, decoration, entertainment or other listed services."
  },
  {
    "heading": "2. Accounts and eligibility",
    "body": "Users must provide accurate information, safeguard their login credentials and use the platform only for lawful purposes. Vendor and sales-executive access may require identity, ownership, role or administrator verification."
  },
  {
    "heading": "3. Vendor listings and quotations",
    "body": "Vendors are responsible for the accuracy of their profiles, licences, service descriptions, pricing, availability, taxes and quotations. Customers should review inclusions, exclusions, cancellation terms and event requirements before accepting an offer."
  },
  {
    "heading": "4. Bookings, payments and cancellations",
    "body": "A booking becomes confirmed only when the platform shows the applicable confirmation status and any required payment is completed. Payment, refund and cancellation conditions shown with a quotation or booking form part of that transaction."
  },
  {
    "heading": "5. Prohibited conduct",
    "body": "Users may not submit false registrations, misuse another person's account, bypass platform safeguards, upload unlawful content, harass other users, manipulate reviews or interfere with platform operation."
  },
  {
    "heading": "6. Reviews and content",
    "body": "Reviews must reflect genuine experiences. Users retain ownership of content they submit but grant BookMyHalwai permission to display and process it for marketplace operation, moderation and promotion, subject to applicable law."
  },
  {
    "heading": "7. Suspension and liability",
    "body": "Access may be restricted for fraud, misuse, non-compliance or safety concerns. To the extent permitted by law, BookMyHalwai is not responsible for independent vendors' acts or for indirect losses arising from marketplace use."
  },
  {
    "heading": "8. Changes and governing law",
    "body": "These Terms may be updated when services or legal requirements change. Continued use after an update constitutes acceptance. Indian law applies, subject to mandatory consumer rights and the jurisdiction stated in the relevant transaction or legal notice."
  }
];

export default function LegalPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="section-shell mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B7791F]">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#0B1830]">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: 16 July 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-700">These Terms govern access to and use of the BookMyHalwai marketplace by customers, vendors, sales executives and other authorised users.</p>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-[#0B1830]">{section.heading}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 rounded-2xl border border-[#D9C8A7] bg-[#FFF9ED] p-4 text-sm leading-6 text-slate-700">Questions or legal notices may be submitted through the BookMyHalwai Contact or Support page.</p>
      </article>
    </main>
  );
}
