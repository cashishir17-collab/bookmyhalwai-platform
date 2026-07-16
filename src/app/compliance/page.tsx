import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Compliance | BookMyHalwai",
  description: "BookMyHalwai is designed to support responsible marketplace operations, vendor verification and transparent customer–vendor transactions across India.",
};

const sections = [
  {
    "heading": "1. Vendor responsibility",
    "body": "Each vendor is responsible for maintaining registrations, licences, permits, tax records, food-safety approvals and local permissions applicable to its category and location. Approval or a verified badge does not replace a government licence."
  },
  {
    "heading": "2. Food and event compliance",
    "body": "Food-service providers must comply with applicable food-safety, hygiene and FSSAI requirements. Venues and event-service providers must follow applicable fire, occupancy, noise, labour, public-safety and local authority requirements."
  },
  {
    "heading": "3. Consumer transparency",
    "body": "Profiles and quotations should clearly state pricing, taxes, inclusions, exclusions, capacity, availability, advance requirements, cancellation conditions and material limitations. Misleading claims may result in restriction or removal."
  },
  {
    "heading": "4. Data protection and security",
    "body": "Personal data is processed for defined marketplace purposes with role-based access and security controls. Users should report suspected account misuse or data-security issues promptly through Support."
  },
  {
    "heading": "5. Grievances and support",
    "body": "Customers, vendors and sales executives may raise service, account, privacy or transaction concerns through the platform's Support process. Records may be retained to investigate and resolve complaints."
  },
  {
    "heading": "6. Prohibited and reportable activity",
    "body": "Fraud, impersonation, bribery, unlawful discrimination, unsafe services, counterfeit documents, review manipulation and illegal goods or services are prohibited and may be reported to appropriate authorities where required."
  },
  {
    "heading": "7. Platform monitoring",
    "body": "BookMyHalwai may review registrations, listings, communications and support records when reasonably necessary for verification, dispute resolution, safety, fraud prevention or compliance, subject to applicable law."
  },
  {
    "heading": "8. Policy status",
    "body": "This page provides the platform's operational compliance framework and is not legal advice to vendors. Vendors should obtain professional advice for obligations specific to their service, state, city and event."
  }
];

export default function LegalPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="section-shell mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B7791F]">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#0B1830]">Legal & Compliance</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: 16 July 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-700">BookMyHalwai is designed to support responsible marketplace operations, vendor verification and transparent customer–vendor transactions across India.</p>
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
