import React from 'react';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TopHeader = () => {
  return (
    <header className="w-full h-20 bg-white sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 group-focus-within:text-[#055153] transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search patients, reports..."
          className="w-full pl-11 pr-4 py-3 bg-[#F8FAFB] border-transparent focus:border-[#055153]/20 focus:bg-white focus:ring-4 focus:ring-[#055153]/5 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 transition-all font-inter"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-700 hover:text-[#055153] hover:bg-slate-50 transition-colors rounded-full">
            <Bell size={22} strokeWidth={2.5} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          <button className="p-2 text-slate-700 hover:text-[#055153] hover:bg-slate-50 transition-colors rounded-full">
            <Settings size={22} strokeWidth={2.5} />
          </button>
          <button className="p-2 text-slate-700 hover:text-[#055153] hover:bg-slate-50 transition-colors rounded-full">
            <HelpCircle size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 group text-start pl-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#112429] group-hover:text-[#055153] transition-colors font-manrope">Dr. Julianne Moore</span>
            <span className="text-[10px] font-extrabold text-[#055153] uppercase tracking-wider text-right uppercase bg-[#055153]/10 px-1.5 py-0.5 rounded-md mt-0.5 w-fit ml-auto">Senior Oncologist</span>
          </div>
          <div className="w-11 h-11 bg-teal-100 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#055153]/20 transition-all">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopHeader;
