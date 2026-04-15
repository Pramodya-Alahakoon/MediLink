import React, { useState } from 'react';
import { Video, User, Activity } from 'lucide-react';
import customFetch from '@/utils/customFetch';
import toast from 'react-hot-toast';

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
    setIsConnecting(true);
    try {
      const doctorId = 'demo-doc-789'; 

      const response = await customFetch.post('/api/doctors/consultations/create-session', {
        appointmentId,
        doctorId,
        patientId
      });

      if (response.data.success) {
        const { meetingLink } = response.data.data;
        toast.success('Consultation session ready!');
        window.open(meetingLink, '_blank', 'noopener,noreferrer');
        
        // After opening, mark as active in the backend
        await customFetch.patch(`/api/doctors/consultations/${appointmentId}/status`, { status: 'active' });
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
      const response = await customFetch.patch(`/api/doctors/consultations/${appointmentId}/status`, { status: 'completed' });
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-[#112429] tracking-tight font-manrope">Today's Schedule</h2>
        <span className="text-sm font-semibold text-slate-500">Tuesday, Oct 24</span>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => {
          if (apt.isAvailable) {
            return (
              <div key={apt.id} className="flex gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 opacity-60">
                <div className="w-20 text-center border-r border-slate-200 pr-5 opacity-40">
                  <p className="text-xl font-extrabold text-[#112429]">{apt.time}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{apt.period}</p>
                </div>
                <div className="flex items-center justify-center flex-1">
                  <p className="text-sm font-semibold text-slate-400 italic">Available for Appointment Slot</p>
                </div>
              </div>
            );
          }

          const isUrgent = apt.status === 'urgent';
          const isVideoCall = apt.patientData?.typeLabel === 'Video Call';
          
          return (
            <div key={apt.id} className={`flex items-center gap-6 p-5 rounded-2xl bg-white border ${isUrgent ? 'border-red-200 bg-red-50/30' : 'border-white shadow-sm shadow-slate-100'} transition-all hover:shadow-md`}>
              
              {/* Time Column */}
              <div className="w-20 text-center border-r border-slate-100 pr-6">
                <p className={`text-xl font-extrabold ${isUrgent ? 'text-[#C62828]' : 'text-[#112429]'}`}>{apt.time}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{apt.period}</p>
              </div>

              {/* Patient Data Column */}
              <div className="flex items-center flex-1 gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative group border-2 border-transparent">
                  <img src={apt.patientData.image} alt={apt.patientData.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[15px] font-bold text-[#112429] font-manrope">{apt.patientData.name}</h4>
                    {apt.patientData.isUrgent && (
                      <span className="bg-[#C62828] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider">Urgent</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                      isUrgent ? 'bg-red-100 text-[#C62828]' : 'text-[#055153] bg-[#E6F3F3]'
                    }`}>
                      {apt.patientData.typeIcon && <apt.patientData.typeIcon size={12} strokeWidth={3} />}
                      {apt.patientData.typeLabel}
                    </span>
                    {apt.patientData.subtext && (
                      <span className="text-xs font-medium text-slate-500">{apt.patientData.subtext}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-shrink-0 gap-2">
                <button 
                  onClick={() => isVideoCall ? handleJoinCall(apt.id, apt.patientData.id) : null}
                  disabled={isConnecting && isVideoCall}
                  className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-sm ${apt.action.style} ${isConnecting && isVideoCall ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isConnecting && isVideoCall ? 'Connecting...' : apt.action.label}
                </button>
                
                {isVideoCall && (
                  <button 
                    onClick={() => handleCompleteCall(apt.id)}
                    className="px-4 py-2.5 rounded-full text-[13px] font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
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
};

export default ScheduleList;
