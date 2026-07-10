"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const { loginWithGoogle, loading } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsPending(true);
      await loginWithGoogle();
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login failed";
      onError?.(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading || isPending}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 13.99A6.89 6.89 0 0 1 5.84 10.01V7.17H2.18a11.99 11.99 0 0 0 0 13.65l3.66-2.83Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.98c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.17l3.66 2.83C6.71 7.91 9.14 5.98 12 5.98Z"
        />
      </svg>
      {isPending ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
