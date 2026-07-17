import { STATE_VISUALS } from "@/data/stateVisuals";

export function StateVisual({ code, stateName }: { code: string; stateName: string }) {
  const visual = STATE_VISUALS[code] ?? {
    title: `${stateName} Heritage`,
    symbol: "✨",
    colors: ["#315A78", "#D7C49E"] as const,
  };
  const gradientId = `state-gradient-${code.toLowerCase()}`;

  return (
    <div className="relative h-36 overflow-hidden" role="img" aria-label={`${visual.title}, a famous attraction or speciality of ${stateName}`}>
      <svg viewBox="0 0 640 280" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={visual.colors[0]} />
            <stop offset="1" stopColor={visual.colors[1]} />
          </linearGradient>
        </defs>
        <rect width="640" height="280" fill={`url(#${gradientId})`} />
        <circle cx="520" cy="52" r="76" fill="#FFF4D2" opacity=".35" />
        <circle cx="88" cy="54" r="34" fill="#FFFFFF" opacity=".1" />
        <path d="M0 210 L98 120 L178 194 L272 92 L376 192 L472 116 L640 218 V280 H0Z" fill="#061B2D" opacity=".2" />
        <path d="M0 238 Q120 185 244 235 T480 226 T700 225 V280 H0Z" fill="#061B2D" opacity=".25" />
        <path d="M38 244 H602" stroke="#FFF8E8" strokeOpacity=".24" strokeWidth="2" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#061326]/80 via-transparent to-transparent" />
      <span className="absolute right-5 top-4 text-5xl drop-shadow-lg" aria-hidden="true">{visual.symbol}</span>
      <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">State highlight</p>
        <p className="mt-1 font-serif text-lg font-semibold leading-tight text-white">{visual.title}</p>
      </div>
    </div>
  );
}
