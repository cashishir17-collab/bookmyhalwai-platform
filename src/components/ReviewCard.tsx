export interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  eventType: string;
}

export default function ReviewCard({ name, rating, comment, eventType }: ReviewCardProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{eventType}</p>
        </div>
        <div className="rounded-3xl bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700">
          {rating.toFixed(1)} ★
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{comment}</p>
    </article>
  );
}
