import React from 'react';

const StatCard = ({ title, value, badgeText, badgeColor, icon: Icon, isHighlighted }) => {
  if (isHighlighted) {
    return (
      <div className="relative bg-[#055153] rounded-3xl p-6 overflow-hidden flex flex-col justify-between shadow-lg shadow-[#055153]/30 h-44 border border-[#055153]">
        <div className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none">
          <span className="text-[140px] font-bold leading-none">$</span>
        </div>
        
        <div>
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Icon size={18} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/80 text-[10px] font-extrabold tracking-widest uppercase mb-1 font-inter">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-manrope text-xl font-bold">LKR</span>
            <h3 className="text-white text-4xl font-extrabold font-manrope tracking-tight">{value}</h3>
          </div>
        </div>
      </div>
    );
  }

  // Color mappings for badges and icons
  const colorMap = {
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-[#E6F3F3]', iconText: 'text-[#055153]' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-50', iconText: 'text-blue-600' },
    red: { bg: 'bg-red-50', text: 'text-red-500', iconBg: 'bg-red-50', iconText: 'text-red-500', border: 'border-l-4 border-red-500' }
  };

  const colors = colorMap[badgeColor] || colorMap.green;

  return (
    <div className={`bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-slate-100/80 h-44 ${colors.border || ''}`}>
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
        <p className="text-slate-500 text-[10px] font-extrabold tracking-widest uppercase mb-1 font-inter">{title}</p>
        <h3 className="text-[#112429] text-4xl font-extrabold font-manrope tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
