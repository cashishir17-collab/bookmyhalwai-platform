"use client";

import { useState } from "react";
import type { ConfirmationResult } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

interface PhoneLoginProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const INDIA_COUNTRY_CODE = "+91";

export default function PhoneLogin({ onSuccess, onError }: PhoneLoginProps) {
  const { loginWithPhone, verifyOtp } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const firebasePhoneNumber = `${INDIA_COUNTRY_CODE}${mobileNumber}`;
  const displayPhoneNumber = `${INDIA_COUNTRY_CODE} ${mobileNumber}`;

  const validateMobileNumber = () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      onError?.("Please enter a valid 10-digit mobile number.");
      return false;
    }
    return true;
  };

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtpError("");

    if (!validateMobileNumber()) {
      return;
    }

    try {
      setIsSendingOtp(true);
      const result = await loginWithPhone(firebasePhoneNumber);
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
    setMobileNumber("");
    setOtpError("");
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtp("");

    if (!validateMobileNumber()) {
      return;
    }

    try {
      setIsSendingOtp(true);
      const result = await loginWithPhone(firebasePhoneNumber);
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
            Mobile number
            <span className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-slate-100">
              <span
                className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700"
                aria-label="India country code"
              >
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={mobileNumber}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobileNumber(digits);
                }}
                placeholder="10-digit mobile number"
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                className="min-w-0 flex-1 bg-white px-4 py-3 text-sm outline-none"
                required
                disabled={isSendingOtp}
                aria-describedby="mobile-number-help"
              />
            </span>
          </label>
          <p id="mobile-number-help" className="text-xs text-slate-500">
            India (+91) is selected automatically. Enter only your 10-digit mobile number.
          </p>

          <button
            type="submit"
            disabled={isSendingOtp || mobileNumber.length !== 10}
            className="w-full rounded-full bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#C4B5FD] bg-[#F5F3FF] px-4 py-3 text-sm text-[#5B21B6]">
            OTP sent to <span className="font-semibold">{displayPhoneNumber}</span>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Enter 6-digit OTP
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                placeholder="000000"
                maxLength={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold outline-none transition focus:border-[#0F172A] focus:ring-2 focus:ring-slate-100"
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
              className="w-full rounded-full bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSendingOtp || isVerifyingOtp}
              className="flex-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm font-semibold text-[#047857] transition hover:bg-[#D1FAE5] disabled:cursor-not-allowed disabled:opacity-70"
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
