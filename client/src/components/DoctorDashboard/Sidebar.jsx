import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDoctorContext } from '../../context/DoctorContext';
import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  FileText, 
  BarChart, 
  LogOut,
  Clock
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { doctorProfile, isSidebarOpen, toggleSidebar } = useDoctorContext();
  
  const specialization = doctorProfile?.specialization || 'Doctor Portal';
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const handleItemClick = (path) => {
    navigate(path);
    if (isSidebarOpen) toggleSidebar();
  };

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: Calendar, label: 'Schedules', path: '/doctor/schedules' },
    { icon: Clock, label: 'Availability', path: '/doctor/availability' },
    { icon: FileText, label: 'Clinical Notes', path: '/doctor/notes' },
    { icon: BarChart, label: 'Reports', path: '/doctor/reports' },
  ];

  return (
    <div className="w-[260px] h-screen bg-[#F8FAFB] dark:bg-slate-900 flex flex-col pt-6 font-inter border-r border-[#E2E8F0] dark:border-slate-800 transition-colors duration-300">
      {/* Brand Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#055153] dark:bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#055153]/20 dark:shadow-teal-500/20">
          <img src="/favicon.png" alt="MediLink" className="w-6 h-6 invert brightness-0" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[#055153] dark:text-teal-400 text-[18px] tracking-tight leading-tight uppercase font-manrope">MediLink</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.1em] uppercase">Doctor Portal</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, idx) => {
          const isActive = currentPath === item.path;
          return (
            <button 
              key={idx}
              onClick={() => handleItemClick(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                isActive 
                ? 'bg-white dark:bg-slate-800 text-[#055153] dark:text-teal-400 shadow-sm shadow-slate-200 dark:shadow-black/20 border border-slate-100 dark:border-slate-700' 
                : 'text-[#64748B] dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-[#055153] dark:hover:text-teal-400'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>


      {/* Bottom Actions */}
      <div className="px-4 pb-6 space-y-2">
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-[#055153] dark:hover:text-teal-400">
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

