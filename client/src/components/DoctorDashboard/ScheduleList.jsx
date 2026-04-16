import React, { useState } from 'react';
import { Video, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import customFetch from '@/utils/customFetch';
import toast from 'react-hot-toast';

const ScheduleList = ({ appointments = [], loading = false, doctorId }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleJoinCall = async (appointmentId, patientId) => {
    if (!doctorId || !patientId) {
      toast.error('Missing doctor or patient id for video call.');
      return;
    }
    setIsConnecting(true);
    try {
      const response = await customFetch.post('/api/telemedicine/create-session', {
        appointmentId,
        doctorId,
        patientId,
      });

      if (response.data.success) {
        const session = response.data.data;
        const meetingLink = session?.meetingLink;
        if (meetingLink) {
          toast.success('Consultation session ready!');
          window.open(meetingLink, '_blank', 'noopener,noreferrer');
        }
        await customFetch.patch(`/api/telemedicine/${appointmentId}/status`, { status: 'active' });
      }
    } catch (error) {
      console.error('Failed to start consultation:', error);
      toast.error('Could not start video call. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCompleteCall = async (appointmentId) => {
    try {
      const response = await customFetch.patch(`/api/telemedicine/${appointmentId}/status`, {
        status: 'completed',
      });
      if (response.data.success) {
        toast.success('Consultation marked as completed');
      }
    } catch (error) {
      console.error('Failed to complete consultation:', error);
      toast.error('Failed to update status.');
    }
  };

  const displayDate = format(new Date(), 'EEEE, MMM d');

  if (loading) {
    return (
      <div className="w-full font-inter animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!doctorId) {
    return (
      <div className="w-full font-inter text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
        Load your doctor profile to see today&apos;s schedule.
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="w-full font-inter">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] md:text-[22px] font-bold text-[#112429] dark:text-white tracking-tight font-manrope transition-colors">
            Today&apos;s Schedule
          </h2>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{displayDate}</span>
        </div>
        <p className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
          No confirmed or pending appointments for today.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-inter">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#112429] dark:text-white tracking-tight font-manrope transition-colors">
          Today&apos;s Schedule
        </h2>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{displayDate}</span>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          const timeStr = format(aptDate, 'hh:mm');
          const period = format(aptDate, 'a');
          const isUrgent = apt.urgencyLevel === 'high';
          const patientName = apt.patientName || 'Patient';
          const initials = patientName
            .split(/\s+/)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          const typeLabel = apt.specialization || 'Consultation';
          const subtext =
            apt.symptoms && apt.symptoms.length > 60
              ? `${apt.symptoms.slice(0, 60)}…`
              : apt.symptoms || apt.status;

          const TypeIcon =
            typeLabel.toLowerCase().includes('video') || apt.status === 'Confirmed' ? Video : User;

          return (
            <div
              key={apt._id}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl transition-all hover:shadow-md border ${
                isUrgent
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-500/5'
                  : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-teal-100 dark:hover:border-teal-900/30'
              }`}
            >
              <div className="w-20 text-center border-r border-slate-100 dark:border-slate-800 pr-6 hidden sm:block">
                <p
                  className={`text-xl font-extrabold transition-colors ${
                    isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'
                  }`}
                >
                  {timeStr}
                </p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{period}</p>
              </div>

              <div className="flex items-center gap-3 sm:hidden mb-2">
                <span
                  className={`text-lg font-black ${
                    isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'
                  }`}
                >
                  {timeStr} {period}
                </span>
                {isUrgent && (
                  <span className="bg-[#C62828] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                    Urgent
                  </span>
                )}
              </div>

              <div className="flex items-center flex-1 gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#E6F3F3] dark:bg-teal-900/30 text-[#055153] dark:text-teal-400 text-xs font-bold border-2 border-transparent shadow-sm">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] font-bold text-[#112429] dark:text-slate-200 font-manrope">
                      {patientName}
                    </h4>
                    {isUrgent && (
                      <span className="hidden sm:inline-block bg-[#C62828] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-red-100 dark:bg-red-500/10 text-[#C62828] dark:text-red-400'
                          : 'text-[#055153] dark:text-teal-400 bg-[#E6F3F3] dark:bg-teal-500/10'
                      }`}
                    >
                      <TypeIcon size={12} strokeWidth={3} />
                      {typeLabel}
                    </span>
                    {subtext && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {subtext}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => handleJoinCall(apt._id, apt.patientId)}
                  disabled={isConnecting}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm dark:shadow-black/20 bg-[#055153] text-white hover:bg-[#044143] ${
                    isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isConnecting ? 'Connecting…' : 'Join Call'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCompleteCall(apt._id)}
                  className="px-4 py-2.5 rounded-full text-[13px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-inter"
                >
                  Complete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleList;
