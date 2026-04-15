import React from 'react';

const StatCard = ({ title, value, badgeText, badgeColor, icon: Icon, isHighlighted }) => {
  if (isHighlighted) {
    return (
      <div className="relative bg-[#055153] dark:bg-teal-600/20 rounded-3xl p-5 overflow-hidden flex flex-col justify-between shadow-lg shadow-[#055153]/20 dark:shadow-black/20 h-40 border border-[#055153] dark:border-teal-500/30 transition-all duration-300">
        <div className="absolute -bottom-6 -right-6 text-white/5 dark:text-teal-400/10 pointer-events-none">
          <Icon size={140} strokeWidth={1} />
        </div>
        
        <div>
          <div className="w-9 h-9 bg-white/20 dark:bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Icon size={18} className="text-white dark:text-teal-400" strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/80 dark:text-teal-400/80 text-[10px] font-extrabold tracking-widest uppercase mb-1 font-inter">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-white dark:text-teal-400 text-3xl font-extrabold font-manrope tracking-tight">{value}</h3>
          </div>
        </div>
      </div>
    );
  }

  // Color mappings for badges and icons
  const colorMap = {
    green: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-[#E6F3F3] dark:bg-teal-500/10', iconText: 'text-[#055153] dark:text-teal-400' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-500/10', iconText: 'text-blue-600 dark:text-blue-400' },
    red: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-500 dark:text-red-400', iconBg: 'bg-red-50 dark:bg-red-500/10', iconText: 'text-red-500 dark:text-red-400', border: 'border-l-4 border-red-500' }
  };

  const colors = colorMap[badgeColor] || colorMap.green;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl p-5 flex flex-col justify-between shadow-sm border border-slate-100 dark:border-slate-800 h-40 transition-all duration-300 ${colors.border || ''}`}>
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.iconBg}`}>
          <Icon size={18} className={colors.iconText} strokeWidth={2.5} />
        </div>
        
        {badgeText && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-extrabold tracking-widest uppercase mb-1 font-inter">{title}</p>
        <h3 className="text-[#112429] dark:text-white text-3xl font-extrabold font-manrope tracking-tight transition-colors">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;

