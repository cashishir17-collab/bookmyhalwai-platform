import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BookMyHalwai",
  description: "This Privacy Policy explains how BookMyHalwai collects, uses, shares and protects personal information across its website and partner application.",
};

const sections = [
  {
    "heading": "1. Information collected",
    "body": "We may collect names, phone numbers, email addresses, location, event requirements, business profiles, identity or licence documents, uploaded media, login records, support messages and device or usage information."
  },
  {
    "heading": "2. How information is used",
    "body": "Information is used to create accounts, verify users, facilitate enquiries and quotations, manage bookings, provide support, prevent fraud, improve the platform, send operational notifications and meet legal obligations."
  },
  {
    "heading": "3. Sharing and processors",
    "body": "Information may be shared with customers or vendors as required for a requested transaction, and with service providers supporting hosting, authentication, communications, analytics, payments or legal compliance. We do not sell personal information."
  },
  {
    "heading": "4. Location, permissions and notifications",
    "body": "Location or device permissions are used only when requested for relevant features. Users may control optional permissions in browser or device settings, although disabling them may limit functionality."
  },
  {
    "heading": "5. Retention and security",
    "body": "Records are retained for as long as necessary for marketplace operation, disputes, fraud prevention and legal obligations. Reasonable technical and organisational safeguards are used, but no internet service can guarantee absolute security."
  },
  {
    "heading": "6. User choices and rights",
    "body": "Subject to applicable law, users may request access, correction, deletion or withdrawal of consent. Certain transaction, security or compliance records may need to be retained."
  },
  {
    "heading": "7. Children and third-party links",
    "body": "The marketplace is intended for adults capable of entering contracts. External services linked from the platform operate under their own privacy practices."
  },
  {
    "heading": "8. Updates and contact",
    "body": "This Policy may be updated when features, service providers or laws change. The effective date above identifies the current version. Privacy requests may be submitted through Contact or Support."
  }
];

export default function LegalPage() {
  return (
    <main className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="section-shell mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B7791F]">Legal</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#0B1830]">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: 16 July 2026</p>
        <p className="mt-6 text-base leading-8 text-slate-700">This Privacy Policy explains how BookMyHalwai collects, uses, shares and protects personal information across its website and partner application.</p>
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
