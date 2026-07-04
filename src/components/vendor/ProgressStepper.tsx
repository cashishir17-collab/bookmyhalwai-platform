"use client";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isComplete = index + 1 < currentStep;

        return (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium ${
              isActive
                ? "border-orange-300 bg-orange-50 text-orange-700"
                : isComplete
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-orange-600 text-white"
                  : isComplete
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {index + 1}
            </span>
            {step}
          </div>
        );
      })}
    </div>
  );
}
