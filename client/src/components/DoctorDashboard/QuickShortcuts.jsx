import React from 'react';
import { FileText, Users, CalendarCheck } from 'lucide-react';

const QuickShortcuts = () => {
  const shortcuts = [
    {
      id: 1,
      label: 'Add Prescription',
      icon: FileText,
      primary: true
    },
    {
      id: 2,
      label: 'View Patient Registry',
      icon: Users,
      primary: false
    },
    {
      id: 3,
      label: 'Set Availability',
      icon: CalendarCheck,
      primary: false
    }
  ];

  return (
    <div className="font-inter">
      <h3 className="text-[17px] font-bold text-[#112429] font-manrope mb-4">Quick Shortcuts</h3>
      <div className="flex flex-col gap-3">
        {shortcuts.map((shortcut) => (
          <button 
            key={shortcut.id}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${
              shortcut.primary 
                ? 'bg-[#055153] text-white hover:bg-[#044143] shadow-md shadow-[#055153]/20' 
                : 'bg-white border border-slate-200 text-[#112429] hover:border-[#055153]/50 hover:shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              shortcut.primary 
                ? 'bg-white/20' 
                : 'bg-[#E6F3F3] text-[#055153] group-hover:bg-[#055153] group-hover:text-white transition-colors'
            }`}>
              <shortcut.icon size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold">{shortcut.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickShortcuts;
