export default function InfoCard({ icon: Icon, title, value, hint }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-xl bg-teal-50 p-2 text-teal-700">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
