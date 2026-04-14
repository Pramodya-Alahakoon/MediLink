import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

const stats = [
  { label: "Total Patients", value: "2,480", icon: FiUsers, color: "from-teal-500 to-teal-600" },
  { label: "Total Doctors", value: "142", icon: FiActivity, color: "from-blue-500 to-blue-600" },
  { label: "Appointments Today", value: "38", icon: FiCalendar, color: "from-purple-500 to-purple-600" },
  { label: "System Health", value: "99.9%", icon: FiSettings, color: "from-green-500 to-green-600" },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/signin");
  };

  const adminName = localStorage.getItem("userName") || "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#07282a] to-slate-900 text-white font-inter">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <FiShield className="text-teal-400 w-5 h-5" />
          </div>
          <span className="text-white font-bold text-lg font-manrope tracking-tight">
            MediLink <span className="text-teal-400">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Welcome, <span className="text-white font-semibold">{adminName}</span></span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-8 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-black font-manrope mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mb-10">
          Manage users, doctors, appointments, and system settings.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}
              >
                <Icon className="text-white w-5 h-5" />
              </div>
              <p className="text-3xl font-black font-manrope text-white mb-1">
                {value}
              </p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold font-manrope mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Manage Patients", desc: "View & edit patient records" },
              { label: "Manage Doctors", desc: "Verify and manage doctors" },
              { label: "View Appointments", desc: "All scheduled appointments" },
            ].map(({ label, desc }) => (
              <button
                key={label}
                className="text-left p-4 rounded-xl bg-white/5 hover:bg-teal-500/10 border border-white/10 hover:border-teal-500/30 transition-all group"
              >
                <p className="font-semibold text-white group-hover:text-teal-300 transition-colors mb-1">
                  {label}
                </p>
                <p className="text-slate-400 text-xs">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
