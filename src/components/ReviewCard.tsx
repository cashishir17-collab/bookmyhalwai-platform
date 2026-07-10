export interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  eventType: string;
}

export default function ReviewCard({ name, rating, comment, eventType }: ReviewCardProps) {
  return (
    <article className="premium-card rounded-[2rem] p-6 transition hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{eventType}</p>
        </div>
        <div className="rounded-3xl bg-[#F5F3FF] px-3 py-2 text-sm font-semibold text-[#0F172A]">
          {rating.toFixed(1)} ★
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{comment}</p>
    </article>
  );
}
