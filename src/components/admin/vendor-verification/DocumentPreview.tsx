interface DocumentPreviewProps {
  label: string;
  value?: string | null;
  type?: string;
}

export default function DocumentPreview({ label, value, type }: DocumentPreviewProps) {
  if (!value) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="mt-1">No document uploaded.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-sm text-slate-500">{type || "Document available"}</p>
      <a href={value} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-orange-600">
        View document
      </a>
    </div>
  );
}
