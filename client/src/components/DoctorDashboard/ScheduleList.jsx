import React, { useState } from 'react';
import { Video, User } from 'lucide-react';
import customFetch from '@/utils/customFetch';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { useDoctorContext } from '@/context/DoctorContext';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ScheduleList = ({ todayAppointments = [], loading }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { doctorId } = useDoctorContext();

  const appointments = todayAppointments;

  const handleJoinCall = async (appointmentId, patientId) => {
    setIsConnecting(true);
    try {
      const response = await customFetch.post('/api/consultations/create-session', {
        appointmentId,
        doctorId,
        patientId
      });

      if (response.data.success) {
        const { meetingLink } = response.data.data;
        toast.success('Consultation session ready!');
        window.open(meetingLink, '_blank', 'noopener,noreferrer');
        
        // After opening, mark as active in the backend
        await customFetch.patch(`/api/consultations/${appointmentId}/status`, { status: 'active' });
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
      const response = await customFetch.patch(`/api/consultations/${appointmentId}/status`, { status: 'completed' });
      if (response.data.success) {
        toast.success('Consultation marked as completed');
      }
    } catch (error) {
      console.error('Failed to complete consultation:', error);
      toast.error('Failed to update status.');
    }
  };

  const safeFormat = (date) => {
    try {
      if (!date) return 'TBD';
      const d = typeof date === 'string' ? parseISO(date) : new Date(date);
      return {
        time: format(d, 'hh:mm a'),
        day: format(d, 'MMM dd, yyyy'),
      };
    } catch {
      return { time: 'TBD', day: 'No date set' };
    }
  };

  const todayLabel = format(new Date(), 'EEEE, MMM dd');

  return (
    <div className="w-full font-inter h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#112429] dark:text-white tracking-tight font-manrope transition-colors">
          Today's Schedule
        </h2>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{todayLabel}</span>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 flex-1">
        {loading && !appointments.length && (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">Loading today&apos;s appointments…</div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No appointments scheduled for today.
          </div>
        )}

        {appointments.map((apt) => {
          const { time, day } = safeFormat(apt.appointmentDate);
          const isVideoCall = (apt.specialization || '').toLowerCase().includes('online') || apt.consultationType === 'Online';
          const isUrgent = apt.urgencyLevel === 'high';
          const avatarUrl = apt.patientAvatar || apt.patient?.avatar || null;
          const initials = getInitials(apt.patientName || 'Patient');

          return (
            <div
              key={apt._id}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl transition-all hover:shadow-md border ${
                isUrgent
                  ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-500/5'
                  : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-teal-100 dark:hover:border-teal-900/30'
              }`}
            >
              {/* Time Column */}
              <div className="w-20 text-center border-r border-slate-100 dark:border-slate-800 pr-6 hidden sm:block">
                <p
                  className={`text-xl font-extrabold transition-colors ${
                    isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'
                  }`}
                >
                  {time}
                </p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Today</p>
              </div>

              <div className="flex items-center gap-3 sm:hidden mb-2">
                <span
                  className={`text-lg font-black ${
                    isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'
                  }`}
                >
                  {time}
                </span>
                {isUrgent && (
                  <span className="bg-[#C62828] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                    Urgent
                  </span>
                )}
              </div>

              {/* Patient Data Column */}
              <div className="flex items-center flex-1 gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 relative group border-2 border-transparent shadow-sm bg-[#E2E8F0] flex items-center justify-center text-[#1E293B] font-bold">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={apt.patientName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] font-bold text-[#112429] dark:text-slate-200 font-manrope">
                      {apt.patientName || 'Unknown Patient'}
                    </h4>
                    {isUrgent && (
                      <span className="hidden sm:inline-block bg-[#C62828] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-red-100 dark:bg-red-500/10 text-[#C62828] dark:text-red-400'
                          : 'text-[#055153] dark:text-teal-400 bg-[#E6F3F3] dark:bg-teal-500/10'
                      }`}
                    >
                      {isVideoCall ? <Video size={12} strokeWidth={3} /> : <User size={12} strokeWidth={3} />}
                      {isVideoCall ? 'Video consult' : 'In-person visit'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{day}</span>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-shrink-0 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {isVideoCall && (
                  <button
                    onClick={() => handleJoinCall(apt._id, apt.patientId?._id || apt.patientId)}
                    disabled={isConnecting}
                    className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm bg-[#055153] text-white hover:bg-[#044143] ${
                      isConnecting ? 'opacity-50 cursor-not-allowed' : ''
                    } dark:shadow-black/20`}
                  >
                    {isConnecting ? 'Connecting…' : 'Join Call'}
                  </button>
                )}

                {!isVideoCall && (
                  <div className="px-5 py-2 rounded-full text-[13px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {apt.status || 'Scheduled'}
                  </div>
                )}

                {isVideoCall && (
                  <button
                    onClick={() => handleCompleteCall(apt._id)}
                    className="px-4 py-2.5 rounded-full text-[13px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-inter"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
}

export default ScheduleList;
