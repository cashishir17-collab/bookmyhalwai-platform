"use client";

interface IndiaPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  className?: string;
}

export function toIndianMobileDigits(value: string | null | undefined) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.startsWith("91") && digits.length > 10
    ? digits.slice(2, 12)
    : digits.slice(-10);
}

export function toIndianPhoneE164(value: string) {
  const mobile = toIndianMobileDigits(value);
  return mobile.length === 10 ? `+91${mobile}` : "";
}

export function isValidIndianMobile(value: string) {
  return /^\d{10}$/.test(toIndianMobileDigits(value));
}

export default function IndiaPhoneInput({
  value,
  onChange,
  disabled = false,
  required = false,
  id,
  name,
  placeholder = "10-digit mobile number",
  className = "",
}: IndiaPhoneInputProps) {
  const mobile = toIndianMobileDigits(value);

  return (
    <span className={`flex overflow-hidden rounded-2xl border border-slate-200 bg-white transition focus-within:border-[#0F172A] focus-within:ring-2 focus-within:ring-slate-100 ${className}`}>
      <span
        className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700"
        aria-label="India country code"
      >
        +91
      </span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={mobile}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder={placeholder}
        minLength={10}
        maxLength={10}
        pattern="[0-9]{10}"
        required={required}
        disabled={disabled}
        className="min-w-0 flex-1 bg-white px-4 py-3 text-sm outline-none disabled:bg-slate-100"
      />
    </span>
  );
}
