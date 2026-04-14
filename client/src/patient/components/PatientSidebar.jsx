import { NavLink } from "react-router-dom";
import { createElement } from "react";
import { Activity, FileText, Search, Stethoscope } from "lucide-react";

const links = [
  { to: "/patient/symptom-checker", label: "Symptom Checker", icon: Activity },
  { to: "/patient/ai-insights", label: "AI Insights", icon: Stethoscope },
  { to: "/patient/reports", label: "My Reports", icon: FileText },
  { to: "/patient/find-doctors", label: "Find Doctors", icon: Search },
];

export default function PatientSidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <h1 className="text-2xl font-black text-slate-900">Aura Health</h1>
      <p className="mt-1 text-sm text-slate-500">Patient Portal</p>

      <nav className="mt-5 grid gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {createElement(Icon, { size: 16 })}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
