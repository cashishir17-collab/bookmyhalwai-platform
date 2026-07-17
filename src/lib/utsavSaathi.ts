export interface UtsavVendorContext {
  verified: true;
  businessName: string;
  ownerName: string;
  category: string;
  status: string;
}

export const UTSAV_SAATHI_KNOWLEDGE = `
BookMyHalwai is an Indian event-services marketplace currently focused on vendor onboarding before customer booking opens.

VENDOR ONBOARDING
- Vendors can register themselves at /vendor/register or receive help from an authorised sales executive.
- Supported categories are Halwai/Caterer, Decorator, Tent House, DJ, Photographer, Venue/Banquet Hall, Makeup Artist, Pandit, Mehendi Artist, Return Gifts, and Choreographer.
- State and city/town coverage is available across India.
- New vendor registration numbers include a category code, year, and sequence, for example BMH-DEC-2026-000001.
- Bank details are not collected during initial registration.
- GST and FSSAI documents are optional during initial registration. Vendors should provide them later when applicable to their business and legal obligations.
- Vendors should upload accurate business, service, portfolio, and identity information. A vendor profile is not publicly listed until admin approval.

LOGIN, OWNERSHIP, AND APPROVAL
- Vendor and sales-executive access uses Indian mobile OTP with +91 selected automatically and a 10-digit mobile number.
- A sales executive may prepare a registration, but the vendor must verify ownership using OTP sent to the registered vendor mobile number.
- Assisted registrations remain pending until ownership verification and admin approval are complete.
- Admin approval cannot be guaranteed by the chatbot. The admin may approve, reject, or request corrections after reviewing the information.
- Approved vendors can use the vendor dashboard to manage available platform features.

SUPPORT
- For OTP, login, document, registration, or approval problems, the vendor should first confirm that the same registered mobile number is being used.
- Registered users can raise a support ticket at /vendor/support or /support.
- Never ask a vendor to share an OTP, password, bank PIN, card number, or other secret in chat.

CUSTOMER AVAILABILITY
- Customer booking is coming soon. Do not promise a booking date or recommend an unapproved vendor.

PAYMENTS AND ENQUIRIES
- Do not claim that a payment was received, a booking was confirmed, or a vendor was approved unless the platform explicitly shows that status.
- Real payment collection must never be simulated.
`;

const fallbackAnswers: Array<{ patterns: RegExp; answer: string }> = [
  {
    patterns: /gst|fssai|food licen[cs]e/i,
    answer:
      "GST and FSSAI documents are optional during initial registration. Please upload them when they apply to your business. Their absence will not block the initial form submission.",
  },
  {
    patterns: /bank|account|ifsc|cancelled cheque/i,
    answer:
      "Bank details are not collected during initial vendor registration. BookMyHalwai will request payment details later only through a secure, clearly identified process when payment services are introduced.",
  },
  {
    patterns: /otp|one.?time|code|login|sign.?in/i,
    answer:
      "Use the same mobile number entered during registration. India (+91) is selected automatically, so enter only the 10-digit number. Never share your OTP with a sales executive or anyone in chat.",
  },
  {
    patterns: /approv|pending|reject|status|listed|live|publish/i,
    answer:
      "Your profile becomes public only after ownership verification and admin approval. Utsav Saathi cannot approve a profile. If it remains pending, please check that OTP ownership is complete and raise a support ticket for review.",
  },
  {
    patterns: /sales|executive|assisted|agent/i,
    answer:
      "An authorised sales executive can prepare a vendor registration, but the vendor must verify ownership using the OTP sent to the registered mobile number. Final approval remains with the BookMyHalwai admin.",
  },
  {
    patterns: /document|photo|pdf|upload|image/i,
    answer:
      "Upload clear, genuine files in the requested sections. GST and FSSAI are optional initially. If an upload fails, use a smaller file, check your connection, and try again before raising a support ticket.",
  },
  {
    patterns: /categor|halwai|cater|decorator|tent|dj|photo|venue|banquet|makeup|pandit|mehendi|gift|choreograph/i,
    answer:
      "BookMyHalwai currently supports Halwai/Caterer, Decorator, Tent House, DJ, Photographer, Venue/Banquet Hall, Makeup Artist, Pandit, Mehendi Artist, Return Gifts, and Choreographer registrations.",
  },
  {
    patterns: /city|town|state|location|india/i,
    answer:
      "Vendor registration supports states, cities, and towns across India. Select your state first, then choose the appropriate city or town from the dependent list.",
  },
  {
    patterns: /support|help|problem|error|unable|failed/i,
    answer:
      "Please note the exact error message and raise a ticket at /vendor/support or /support. Do not share OTPs, passwords, bank PINs, or card details in the ticket or chat.",
  },
];

export function getUtsavFallbackAnswer(question: string) {
  const match = fallbackAnswers.find((item) => item.patterns.test(question));
  return (
    match?.answer ||
    "I could not answer that confidently from the approved BookMyHalwai guidance. Please raise a support ticket at /vendor/support so the team can review your exact issue."
  );
}

export function buildUtsavSystemInstruction(vendor: UtsavVendorContext) {
  return `You are Utsav Saathi, the official BookMyHalwai vendor-support assistant.

The visitor has already passed the website's approved-vendor name and mobile verification. Address them politely and use simple Indian English. You may understand and respond in Hindi or Hinglish when the vendor writes that way.

Verified vendor context:
- Business: ${vendor.businessName}
- Owner: ${vendor.ownerName}
- Category: ${vendor.category}
- Marketplace status: ${vendor.status}

Rules:
1. Answer only from the approved knowledge below and the verified context. Do not invent policies, prices, approval decisions, bookings, payment status, timelines, or contact details.
2. Keep answers concise, practical, and step-by-step when the question is procedural.
3. Never ask for or repeat an OTP, password, bank PIN, card number, or government ID number.
4. Do not reveal other vendors' or customers' information.
5. If the answer is uncertain or requires account investigation, direct the vendor to /vendor/support.
6. Do not perform approvals or claim that an admin action has occurred.
7. Customer booking is coming soon.

Approved BookMyHalwai knowledge:
${UTSAV_SAATHI_KNOWLEDGE}`;
}
