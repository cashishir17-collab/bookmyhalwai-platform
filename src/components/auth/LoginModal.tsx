"use client";

import { useEffect, useState } from "react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import PhoneLogin from "@/components/auth/PhoneLogin";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => {
        setMessage(null);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60">
      <div className="min-h-screen overflow-y-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-start justify-center">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
                  Welcome back
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Sign in to BookMyHalwai</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-orange-300 hover:text-orange-600"
                aria-label="Close login modal"
              >
                ✕
              </button>
            </div>

            {message ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <GoogleLoginButton
                onSuccess={() => {
                  setMessage("Signed in successfully.");
                  onClose();
                }}
                onError={(errorMessage) => setMessage(errorMessage)}
              />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <PhoneLogin
                onSuccess={() => {
                  setMessage("Phone authentication successful.");
                  onClose();
                }}
                onError={(errorMessage) => setMessage(errorMessage)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
