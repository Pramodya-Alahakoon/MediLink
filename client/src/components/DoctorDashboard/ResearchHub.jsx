import React from 'react';
import { FlaskConical } from 'lucide-react';

const ResearchHub = () => {
  return (
    <div className="relative bg-[#5b6a82] overflow-hidden rounded-3xl p-6 shadow-md border border-[#4a586e] h-48 mt-6 flex flex-col justify-between">
      {/* Background Graphic */}
      <div className="absolute -bottom-10 -right-8 text-white/10 pointer-events-none transform rotate-12">
        <FlaskConical size={140} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <h3 className="text-white text-lg font-bold font-manrope mb-2">Internal Research Hub</h3>
        <p className="text-white/80 text-[11px] font-medium leading-relaxed font-inter pr-8">
          Access latest oncology papers and collaborative case studies from Aura Network.
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <button className="px-5 py-2 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-white/10 transition-colors">
          Launch Portal
        </button>
      </div>
    </div>
  );
};

export default ResearchHub;
