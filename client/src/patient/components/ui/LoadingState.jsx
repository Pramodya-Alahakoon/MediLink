export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}
