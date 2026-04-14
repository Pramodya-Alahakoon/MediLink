import React from 'react';
import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  BarChart, 
  AlertCircle, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', active: true },
    { icon: Users, label: 'Patients', active: false },
    { icon: Calendar, label: 'Schedules', active: false },
    { icon: FileText, label: 'Clinical Notes', active: false },
    { icon: CreditCard, label: 'Billing', active: false },
    { icon: BarChart, label: 'Reports', active: false },
  ];

  return (
    <div className="w-[260px] h-screen bg-[#F8FAFB] flex flex-col pt-6 font-inter border-r border-[#E2E8F0]">
      {/* Brand Logo */}
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#055153] rounded-xl flex items-center justify-center shadow-lg shadow-[#055153]/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[#055153] text-[17px] tracking-tight leading-tight">Dr. Editorial</span>
          <span className="text-xs text-slate-500 font-semibold tracking-wide">Oncology Dept.</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
              item.active 
              ? 'bg-white text-[#055153] shadow-sm shadow-slate-200 border border-slate-100' 
              : 'text-[#64748B] hover:bg-white/50 hover:text-[#055153]'
            }`}
          >
            <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 pb-6 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-100/80 text-red-600 hover:bg-red-200/80 transition-colors text-xs font-bold mb-4 shadow-sm shadow-red-100">
          <AlertCircle size={16} strokeWidth={2.5} />
          Emergency Alert
        </button>
        
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold text-[#64748B] hover:bg-white/50 hover:text-[#055153]">
          <HelpCircle size={20} strokeWidth={2} />
          <span>Support</span>
        </button>
        
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold text-[#64748B] hover:bg-white/50 hover:text-[#055153]">
          <LogOut size={20} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
