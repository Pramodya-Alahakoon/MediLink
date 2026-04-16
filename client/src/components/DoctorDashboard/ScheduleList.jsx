import React, { useState } from 'react';
import { Video, User, Activity } from 'lucide-react';
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

const ScheduleList = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  // Mock appointments updated with IDs for the Telemedicine demo
  const appointments = [
    {
      id: 'demo-apt-101',
      time: '09:00',
      period: 'AM',
      patientData: {
        id: 'pat-123',
        name: 'Sarah Jenkins',
        typeLabel: 'Video Call',
        typeIcon: Video,
        subtext: 'Follow-up Check',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
      },
      action: { label: 'Join Call', style: 'bg-[#055153] text-white hover:bg-[#044143]' },
      status: 'normal'
    },
    // ... other mock data
    {
      id: 2,
      time: '10:30',
      period: 'AM',
      patientData: {
        name: 'Mark Thompson',
        typeLabel: 'In-person',
        typeIcon: User,
        subtext: 'New Consultation',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces'
      },
      action: { label: 'View Profile', style: 'border border-[#055153] text-[#055153] hover:bg-[#055153]/5 bg-transparent' },
      status: 'normal'
    },
    {
      id: 3,
      time: '01:15',
      period: 'PM',
      patientData: {
        name: 'Alex Rivera',
        typeLabel: 'Post-op Checkup',
        typeIcon: Activity,
        isUrgent: true,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces'
      },
      action: { label: 'Emergency Review', style: 'bg-[#C62828] text-white shadow-md shadow-red-500/20 hover:bg-[#B71C1C]' },
      status: 'urgent'
    },
    {
      id: 4,
      time: '03:00',
      period: 'PM',
      isAvailable: true
    }
  ];

  const handleJoinCall = async (appointmentId, patientId) => {
    if (!doctorId || !patientId) {
      toast.error('Missing doctor or patient id for video call.');
      return;
    }
    setIsConnecting(true);
    try {
      const doctorId = 'demo-doc-789'; 

      const response = await customFetch.post('/api/consultations/create-session', {
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

  return (
    <div className="w-full font-inter">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#112429] dark:text-white tracking-tight font-manrope transition-colors">Today's Schedule</h2>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tuesday, Oct 24</span>
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
          if (apt.isAvailable) {
            return (
              <div key={apt.id} className="flex gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 opacity-60">
                <div className="w-20 text-center border-r border-slate-200 dark:border-slate-800 pr-5 opacity-40">
                  <p className="text-xl font-extrabold text-[#112429] dark:text-white">{apt.time}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{apt.period}</p>
                </div>
                <div className="flex items-center justify-center flex-1">
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 italic">Available for Appointment Slot</p>
                </div>
              </div>
            );
          }

          const isUrgent = apt.status === 'urgent';
          const isVideoCall = apt.patientData?.typeLabel === 'Video Call';
          
          return (
            <div key={apt.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl transition-all hover:shadow-md border ${
              isUrgent 
                ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-500/5' 
                : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-teal-100 dark:hover:border-teal-900/30'
            }`}>
              
              {/* Time Column */}
              <div className="w-20 text-center border-r border-slate-100 dark:border-slate-800 pr-6 hidden sm:block">
                <p className={`text-xl font-extrabold transition-colors ${isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'}`}>{apt.time}</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{apt.period}</p>
              </div>

              <div className="flex items-center gap-3 sm:hidden mb-2">
                <span className={`text-lg font-black ${isUrgent ? 'text-[#C62828] dark:text-red-400' : 'text-[#112429] dark:text-white'}`}>{apt.time} {apt.period}</span>
                {apt.patientData.isUrgent && (
                  <span className="bg-[#C62828] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">Urgent</span>
                )}
              </div>

              <div className="flex items-center flex-1 gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0 relative group border-2 border-transparent shadow-sm">
                  <img src={apt.patientData.image} alt={apt.patientData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] font-bold text-[#112429] dark:text-slate-200 font-manrope">{apt.patientData.name}</h4>
                    {apt.patientData.isUrgent && (
                      <span className="hidden sm:inline-block bg-[#C62828] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider">Urgent</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isUrgent 
                        ? 'bg-red-100 dark:bg-red-500/10 text-[#C62828] dark:text-red-400' 
                        : 'text-[#055153] dark:text-teal-400 bg-[#E6F3F3] dark:bg-teal-500/10'
                    }`}>
                      {apt.patientData.typeIcon && <apt.patientData.typeIcon size={12} strokeWidth={3} />}
                      {apt.patientData.typeLabel}
                    </span>
                    {apt.patientData.subtext && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{apt.patientData.subtext}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button 
                  onClick={() => isVideoCall ? handleJoinCall(apt.id, apt.patientData.id) : null}
                  disabled={isConnecting && isVideoCall}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm ${apt.action.style} ${isConnecting && isVideoCall ? 'opacity-50 cursor-not-allowed' : ''} dark:shadow-black/20`}
                >
                  {isConnecting && isVideoCall ? 'Connecting...' : apt.action.label}
                </button>
                
                {isVideoCall && (
                  <button 
                    onClick={() => handleCompleteCall(apt.id)}
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
