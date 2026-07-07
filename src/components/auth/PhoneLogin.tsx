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
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtpError("");

    if (!phoneNumber.trim()) {
      onError?.("Please enter a phone number");
      return;
    }

    try {
      setIsSendingOtp(true);
      const result = await loginWithPhone(phoneNumber);
      console.log("LOGIN STEP 4 - Confirmation stored");
      setConfirmationResult(result);
      setOtp("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send OTP";
      onError?.(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setOtpError("");

    if (!confirmationResult) {
      onError?.("Please request an OTP first.");
      return;
    }

    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await verifyOtp(confirmationResult, otp);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid OTP. Please try again.";
      setOtpError(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleBack = () => {
    setConfirmationResult(null);
    setOtp("");
    setPhoneNumber("");
    setOtpError("");
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtp("");

    try {
      setIsSendingOtp(true);
      const result = await loginWithPhone(phoneNumber);
      console.log("LOGIN STEP 4 - Confirmation stored (resend)");
      setConfirmationResult(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend OTP";
      setOtpError(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="space-y-4">
      <div id="phone-recaptcha" />

      {!confirmationResult ? (
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
              disabled={isSendingOtp}
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
      ) : (
        <div className="space-y-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            OTP sent to <span className="font-semibold">{phoneNumber}</span>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Enter 6-digit OTP
              <input
                type="text"
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                maxLength={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold outline-none transition focus:border-orange-400"
                required
                disabled={isVerifyingOtp}
              />
            </label>

            {otpError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {otpError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isVerifyingOtp || otp.length !== 6}
              className="w-full rounded-full bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSendingOtp || isVerifyingOtp}
              className="flex-1 rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={handleBack}
              disabled={isSendingOtp || isVerifyingOtp}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
