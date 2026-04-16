import React, { useEffect, useState } from 'react';
import { FileText, CalendarClock } from 'lucide-react';
import { useDoctorContext } from '@/context/DoctorContext';
import customFetch from '@/utils/customFetch';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ActivityFeed = () => {
  const { doctorId } = useDoctorContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const { data } = await customFetch.get(`/api/doctors/${doctorId}/appointments?status=Confirmed&page=1&limit=10`);
        const appointments = data.data || data.appointments || [];
        const mapped = appointments.map((apt) => ({
          id: apt._id,
          icon: FileText,
          iconBg: 'bg-emerald-100 dark:bg-emerald-500/10',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          title: `${apt.patientName || 'Patient'} — ${apt.specialization || 'Consultation'}`,
          subtitle: apt.symptoms ? apt.symptoms.slice(0, 70) : '',
          time: apt.appointmentDate
            ? format(typeof apt.appointmentDate === 'string' ? parseISO(apt.appointmentDate) : new Date(apt.appointmentDate), 'dd MMM, hh:mm a')
            : 'No date',
        }));
        setItems(mapped);
      } catch (e) {
        console.error('Failed to load recent activity', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [doctorId]);

  const handleSeeAll = () => {
    navigate('/doctor/schedules');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 font-inter transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#112429] dark:text-white font-manrope">Recent Patient Activity</h3>
        <button
          onClick={handleSeeAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#055153] dark:text-teal-400 hover:underline"
        >
          <CalendarClock size={14} />
          See All
        </button>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading recent activity…</p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity yet.</p>
        )}

        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
              <item.icon size={14} className={item.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{item.subtitle}</p>
              )}
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;

