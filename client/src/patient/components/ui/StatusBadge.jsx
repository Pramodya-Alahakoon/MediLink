const COLORS = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  resolved: "bg-sky-100 text-sky-700",
  archived: "bg-slate-100 text-slate-700",
  default: "bg-slate-100 text-slate-700",
};

export default function StatusBadge({ value = "default" }) {
  const key = String(value).toLowerCase();
  const className = COLORS[key] || COLORS.default;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {value}
    </span>
  );
}
