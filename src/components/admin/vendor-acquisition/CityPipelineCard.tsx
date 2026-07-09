interface CityPipelineCardProps {
  city: string;
  totalLeads: number;
  pendingVerification: number;
  approved: number;
  published: number;
  averageQualityScore: number;
}

export default function CityPipelineCard({ city, totalLeads, pendingVerification, approved, published, averageQualityScore }: CityPipelineCardProps) {
  return (
    <div className="premium-card rounded-[1.5rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{city}</h3>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{totalLeads} leads</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600">
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <span>Pending Verification</span>
          <span className="font-semibold text-slate-900">{pendingVerification}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <span>Approved</span>
          <span className="font-semibold text-slate-900">{approved}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <span>Published</span>
          <span className="font-semibold text-slate-900">{published}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <span>Avg Quality Score</span>
          <span className="font-semibold text-emerald-600">{averageQualityScore}</span>
        </div>
      </div>
    </div>
  );
}
