import React from 'react';
import { FileText, FileBadge, BellRing } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      icon: FileText,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      title: <span className="text-[#112429]"><strong>Sarah Jenkins</strong> uploaded a lab report</span>,
      time: '24 MINS AGO'
    },
    {
      id: 2,
      icon: FileBadge,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: <span className="text-[#112429]"><strong>Mark Thompson</strong> settled pending invoice</span>,
      time: '1 HOUR AGO'
    },
    {
      id: 3,
      icon: BellRing,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      title: <span className="text-[#112429]"><strong>Pharmacy Alert:</strong> Refill request for Room 302</span>,
      time: '2 HOURS AGO'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 font-inter">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#112429] font-manrope">Recent Patient Activity</h3>
        <button className="text-xs font-bold text-[#055153] hover:underline">See All</button>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[17px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 pl-2">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.iconBg}`}>
              <activity.icon size={14} className={activity.iconColor} strokeWidth={3} />
            </div>
            <div className="pt-1.5 pb-2">
              <p className="text-sm text-slate-600 leading-snug">{activity.title}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
