"use client";

import { useState } from "react";
import type { ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

interface PhoneLoginProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function PhoneLogin({ onSuccess, onError }: PhoneLoginProps) {
  const { loginWithPhone, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSendingOtp(true);
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send OTP";
      onError?.(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!confirmationResult) {
      onError?.("Please request an OTP first.");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await verifyOtp(confirmationResult, otp);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid OTP";
      onError?.(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSendOtp} className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          Phone number
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="+91 9876543210"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSendingOtp}
          className="w-full rounded-full bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSendingOtp ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <div id="phone-recaptcha" />

      {confirmationResult ? (
        <form onSubmit={handleVerifyOtp} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            OTP
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter 6-digit OTP"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="w-full rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
