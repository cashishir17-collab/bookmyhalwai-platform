"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react";
import IndiaPhoneInput, {
  isValidIndianMobile,
  toIndianMobileDigits,
} from "@/components/forms/IndiaPhoneInput";
import { db } from "@/lib/firebase";
import type { UtsavVendorContext } from "@/lib/utsavSaathi";

type ChatStep = "role" | "vendor_name" | "vendor_mobile" | "verified" | "customer";
type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

interface VendorRow {
  businessName?: string;
  ownerName?: string;
  providerCategoryLabel?: string;
  category?: string;
  verificationStatus?: string;
  phoneE164?: string;
  mobile?: string;
  phone?: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Namaste! I’m Utsav Saathi. Are you a vendor or a customer?",
};

const QUICK_QUESTIONS = [
  "How does vendor approval work?",
  "Are GST and FSSAI mandatory?",
  "I have an OTP or login problem",
  "How can I contact support?",
];

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeName(value: string | undefined) {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/g, " ")
    .trim();
}

function nameMatches(providedName: string, row: VendorRow) {
  const provided = normalizeName(providedName);
  if (provided.length < 2) return false;

  return [row.businessName, row.ownerName]
    .map(normalizeName)
    .filter(Boolean)
    .some((candidate) => candidate === provided || candidate.includes(provided) || provided.includes(candidate));
}

function phoneMatches(providedMobile: string, row: VendorRow) {
  const provided = toIndianMobileDigits(providedMobile);
  return [row.phoneE164, row.mobile, row.phone].some(
    (candidate) => toIndianMobileDigits(candidate) === provided,
  );
}

export default function UtsavSaathi() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("role");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [vendorName, setVendorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [question, setQuestion] = useState("");
  const [vendor, setVendor] = useState<UtsavVendorContext | null>(null);
  const [busy, setBusy] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, busy]);

  const addMessage = (role: MessageRole, content: string) => {
    setMessages((current) => [...current, { id: messageId(), role, content }]);
  };

  const reset = () => {
    setStep("role");
    setMessages([INITIAL_MESSAGE]);
    setVendorName("");
    setMobile("");
    setQuestion("");
    setVendor(null);
    setBusy(false);
    setVerificationError("");
  };

  const chooseRole = (role: "vendor" | "customer") => {
    addMessage("user", role === "vendor" ? "I am a vendor." : "I am a customer.");
    if (role === "customer") {
      setStep("customer");
      addMessage(
        "assistant",
        "Customer booking is coming soon. We’ll be delighted to help you plan your celebration shortly.",
      );
      return;
    }

    setStep("vendor_name");
    addMessage("assistant", "Please enter the vendor owner name or registered business name.");
  };

  const submitName = (event: FormEvent) => {
    event.preventDefault();
    const name = vendorName.trim();
    if (name.length < 2) return;
    addMessage("user", name);
    setStep("vendor_mobile");
    addMessage("assistant", "Now enter the 10-digit mobile number registered with BookMyHalwai.");
  };

  const verifyVendor = async (event: FormEvent) => {
    event.preventDefault();
    setVerificationError("");
    if (!isValidIndianMobile(mobile)) {
      setVerificationError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!db) {
      setVerificationError("Vendor verification is temporarily unavailable. Please try again later.");
      return;
    }

    setBusy(true);
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "vendors"),
          where("verificationStatus", "in", ["Approved", "Published", "Verified"]),
        ),
      );
      const match = snapshot.docs
        .map((item) => item.data() as VendorRow)
        .find((row) => phoneMatches(mobile, row) && nameMatches(vendorName, row));

      if (!match) {
        setVerificationError(
          "We could not match an approved vendor with those details. Check the registered name and mobile number, or use vendor login/support if approval is pending.",
        );
        return;
      }

      const verifiedVendor: UtsavVendorContext = {
        verified: true,
        businessName: match.businessName || vendorName.trim(),
        ownerName: match.ownerName || vendorName.trim(),
        category: match.providerCategoryLabel || match.category || "Event service provider",
        status: match.verificationStatus || "Approved",
      };
      setVendor(verifiedVendor);
      setStep("verified");
      addMessage("user", "+91 ••••••" + toIndianMobileDigits(mobile).slice(-4));
      addMessage(
        "assistant",
        `Welcome, ${verifiedVendor.businessName}. Your approved vendor profile is verified. How may I help you today?`,
      );
    } catch (error) {
      console.error("Utsav Saathi vendor verification failed", error);
      setVerificationError("We could not verify the details right now. Please try again or open vendor support.");
    } finally {
      setBusy(false);
    }
  };

  const askQuestion = async (text: string) => {
    const cleanQuestion = text.trim();
    if (!cleanQuestion || !vendor || busy) return;

    const priorMessages = messages
      .filter((item) => item.id !== "welcome")
      .slice(-8)
      .map((item) => ({ role: item.role, content: item.content }));
    addMessage("user", cleanQuestion);
    setQuestion("");
    setBusy(true);

    try {
      const response = await fetch("/api/utsav-saathi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanQuestion, history: priorMessages, vendor }),
      });
      const payload = (await response.json()) as { answer?: string };
      addMessage(
        "assistant",
        payload.answer || "I could not answer that right now. Please use vendor support for assistance.",
      );
    } catch {
      addMessage(
        "assistant",
        "I’m temporarily unable to connect. Please try again or open /vendor/support for assistance.",
      );
    } finally {
      setBusy(false);
    }
  };

  const submitQuestion = (event: FormEvent) => {
    event.preventDefault();
    void askQuestion(question);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      {open ? (
        <section
          aria-label="Utsav Saathi support chat"
          className="flex h-[min(42rem,calc(100dvh-2rem))] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem] border border-[#D5C19B] bg-[#FFFDF8] shadow-[0_24px_70px_rgba(11,24,48,0.28)]"
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-[#0B1830] to-[#163457] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#C7A667] text-[#0B1830]">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-sans text-base font-bold text-white">Utsav Saathi</h2>
                <p className="text-xs text-slate-200">BookMyHalwai Vendor Help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                className="rounded-full p-2 text-slate-200 hover:bg-white/10 hover:text-white"
                aria-label="Restart conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-200 hover:bg-white/10 hover:text-white"
                aria-label="Close Utsav Saathi"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "rounded-bl-md border border-[#E5D8C1] bg-[#FFF7E8] text-[#263B52]"
                    : "ml-auto rounded-br-md bg-[#0F6456] text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {step === "role" ? (
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => chooseRole("vendor")} className="btn btn-primary btn-md text-sm">
                  I’m a Vendor
                </button>
                <button type="button" onClick={() => chooseRole("customer")} className="btn btn-outline btn-md text-sm">
                  I’m a Customer
                </button>
              </div>
            ) : null}

            {step === "verified" && messages.length <= 5 ? (
              <div className="space-y-2 pt-1">
                {QUICK_QUESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void askQuestion(item)}
                    className="block w-full rounded-xl border border-[#DCCDB2] bg-white px-3 py-2 text-left text-xs font-semibold text-[#1C3350] hover:bg-[#FFF7E8]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}

            {busy ? (
              <div className="flex max-w-[70%] items-center gap-2 rounded-2xl rounded-bl-md border border-[#E5D8C1] bg-[#FFF7E8] px-4 py-3 text-sm text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#0F6456]" />
                Utsav Saathi is checking…
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <footer className="border-t border-[#E5D8C1] bg-white p-4">
            {step === "vendor_name" ? (
              <form onSubmit={submitName} className="flex gap-2">
                <input
                  value={vendorName}
                  onChange={(event) => setVendorName(event.target.value.slice(0, 80))}
                  placeholder="Owner or business name"
                  autoComplete="organization"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  autoFocus
                />
                <button type="submit" disabled={vendorName.trim().length < 2} className="btn btn-primary px-4" aria-label="Continue">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : null}

            {step === "vendor_mobile" ? (
              <form onSubmit={verifyVendor} className="space-y-2">
                <IndiaPhoneInput value={mobile} onChange={setMobile} disabled={busy} required />
                {verificationError ? <p className="text-xs leading-5 text-red-700">{verificationError}</p> : null}
                {verificationError ? (
                  <div className="flex flex-wrap gap-3 text-xs font-semibold">
                    <Link href="/vendor/login" className="text-[#0F6456] underline">Vendor login</Link>
                    <Link href="/support" className="text-[#0F6456] underline">Open support</Link>
                  </div>
                ) : null}
                <button type="submit" disabled={busy || !isValidIndianMobile(mobile)} className="btn btn-primary btn-md w-full text-sm">
                  {busy ? "Verifying…" : "Verify Vendor"}
                </button>
              </form>
            ) : null}

            {step === "verified" ? (
              <form onSubmit={submitQuestion} className="flex gap-2">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value.slice(0, 1000))}
                  placeholder="Ask your vendor question…"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />
                <button type="submit" disabled={busy || !question.trim()} className="btn btn-primary px-4" aria-label="Send question">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : null}

            {step === "customer" ? (
              <button type="button" onClick={reset} className="btn btn-outline btn-md w-full text-sm">
                Start again
              </button>
            ) : null}

            <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">
              Never share OTPs, passwords, bank PINs, or card details in chat.
            </p>
          </footer>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-full border border-[#C7A667] bg-[#0B1830] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_38px_rgba(11,24,48,0.3)] hover:-translate-y-0.5 hover:bg-[#163457] sm:px-5"
          aria-label="Open Utsav Saathi vendor help"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#C7A667] text-[#0B1830]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span>Utsav Saathi</span>
        </button>
      )}
    </div>
  );
}
