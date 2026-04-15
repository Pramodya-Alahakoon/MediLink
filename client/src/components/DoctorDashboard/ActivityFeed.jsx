import React from 'react';
import { FileText, FileBadge, BellRing } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      icon: FileText,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/10',
      title: <span className="text-[#112429] dark:text-slate-200"><strong>Sarah Jenkins</strong> uploaded a lab report</span>,
      time: '24 MINS AGO'
    },
    {
      id: 2,
      icon: FileBadge,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-500/10',
      title: <span className="text-[#112429] dark:text-slate-200"><strong>Mark Thompson</strong> settled pending invoice</span>,
      time: '1 HOUR AGO'
    },
    {
      id: 3,
      icon: BellRing,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-500/10',
      title: <span className="text-[#112429] dark:text-slate-200"><strong>Pharmacy Alert:</strong> Refill request for Room 302</span>,
      time: '2 HOURS AGO'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 font-inter transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#112429] dark:text-white font-manrope">Recent Patient Activity</h3>
        <button className="text-xs font-bold text-[#055153] dark:text-teal-400 hover:underline">See All</button>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[17px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 pl-2">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.iconBg} border-4 border-white dark:border-slate-900`}>
              <activity.icon size={12} className={activity.iconColor} strokeWidth={3} />
            </div>
            <div className="pt-1 pb-2">
              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-snug">{activity.title}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;

