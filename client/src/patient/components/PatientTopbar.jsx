import { Bell, Settings, UserCircle2 } from "lucide-react";

export default function PatientTopbar() {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="text-3xl font-extrabold text-slate-900">Patient Dashboard</h2>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-slate-800">
          <Bell size={18} />
        </button>
        <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-slate-800">
          <Settings size={18} />
        </button>
        <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-slate-800">
          <UserCircle2 size={18} />
        </button>
      </div>
    </header>
  );
}
