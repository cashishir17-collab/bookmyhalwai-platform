"use client";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isComplete = index + 1 < currentStep;

        return (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "border-slate-300 bg-slate-100 text-[#0F172A]"
                : isComplete
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-[#0F172A] text-white"
                  : isComplete
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {index + 1}
            </span>
            <span className="leading-5">{step}</span>
          </div>
        );
      })}
    </div>
  );
}
