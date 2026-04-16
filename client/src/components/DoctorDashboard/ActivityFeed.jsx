import React from 'react';
import { Calendar, ClipboardList } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

/**
 * @param {Array<{ id: string, patientName: string, status: string, appointmentDate: string, createdAt?: string, specialization?: string }>} activities
 */
const ActivityFeed = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 font-inter animate-pulse">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 font-inter transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#112429] dark:text-white font-manrope">Recent activity</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
          No recent appointments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 font-inter transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#112429] dark:text-white font-manrope">Recent activity</h3>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[17px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 pl-2">
        {activities.map((a) => {
          const refDate = a.createdAt ? new Date(a.createdAt) : new Date(a.appointmentDate);
          const timeLabel = formatDistanceToNow(refDate, { addSuffix: true });
          const Icon = a.status === 'Pending' ? ClipboardList : Calendar;
          const iconBg =
            a.status === 'Pending'
              ? 'bg-amber-100 dark:bg-amber-500/10'
              : 'bg-emerald-100 dark:bg-emerald-500/10';
          const iconColor =
            a.status === 'Pending'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400';

          return (
            <div key={a.id} className="relative flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${iconBg} border-4 border-white dark:border-slate-900`}
              >
                <Icon size={12} className={iconColor} strokeWidth={3} />
              </div>
              <div className="pt-1 pb-2">
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-snug">
                  <span className="text-[#112429] dark:text-slate-200 font-semibold">{a.patientName}</span>
                  {' — '}
                  {a.status} · {format(new Date(a.appointmentDate), 'MMM d, yyyy')}
                  {a.specialization ? ` · ${a.specialization}` : ''}
                </p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                  {timeLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
