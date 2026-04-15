import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Settings2,
  Calendar as CalendarIcon,
  Ban,
  Check,
  Loader2,
  AlertCircle,
  X,
  Search,
  Bell
} from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import customFetch from '../../utils/customFetch';
import { useDoctorContext } from '../../context/DoctorContext';

const Availability = () => {
  const { doctorId, doctorProfile, isLoadingProfile, profileError } = useDoctorContext();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekData, setWeekData] = useState([]);
  const [settings, setSettings] = useState({
    appointmentDuration: 30,
    bufferTime: 15,
    isBufferTimeEnabled: true,
    maxAppointmentsPerDay: 12,
    defaultStartTime: '08:00 AM',
    defaultEndTime: '05:00 PM',
  });
  const [tempSettings, setTempSettings] = useState(settings);
  const [blockedDays, setBlockedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [blockDates, setBlockDates] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    if (!doctorId) return;
    fetchWeekData();
    fetchSettings();
    fetchBlockedDays();
  }, [currentWeek, doctorId]);

  // Sync tempSettings when fetched settings change
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const fetchWeekData = async () => {
    try {
      setLoading(true);
      const weekStart = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const { data } = await customFetch.get(`/api/availability/week/${doctorId}?startDate=${weekStart}`);
      
      if (data.success) {
        setWeekData(data.data);
        if (data.settings) {
          setSettings(data.settings);
        }
      } else {
        toast.error('Failed to fetch availability data');
      }
    } catch (error) {
      console.error('Error fetching week data:', error);
      toast.error('Error loading availability');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await customFetch.get(`/api/availability/settings/${doctorId}`);
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchBlockedDays = async () => {
    try {
      const { data } = await customFetch.get(`/api/availability/blocked-days/${doctorId}`);
      if (data.success) {
        setBlockedDays(data.data);
      }
    } catch (error) {
      console.error('Error fetching blocked days:', error);
    }
  };

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleUpdateSettings = async () => {
    try {
      const { data } = await customFetch.put(`/api/availability/settings`, { ...tempSettings, doctorId });
      if (data.success) {
        setSettings(data.data);
        toast.success('Settings updated successfully');
        fetchWeekData();
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Error updating settings');
    }
  };

  const handleBlockDays = async () => {
    if (!blockDates.startDate || !blockDates.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    
    try {
      const { data } = await customFetch.post(`/api/availability/blocked-days`, { ...blockDates, doctorId, type: 'vacation' });
      if (data.success) {
        toast.success('Days blocked successfully');
        setBlockDates({ startDate: '', endDate: '' });
        fetchWeekData();
        fetchBlockedDays();
      } else {
        toast.error('Failed to block days');
      }
    } catch (error) {
      console.error('Error blocking days:', error);
      toast.error('Error blocking days');
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBlockSlot = async () => {
    if (!selectedSlot) return;
    
    try {
      const { data } = await customFetch.post(`/api/availability/slots/${selectedSlot._id}/block`);
      if (data.success) {
        toast.success('Slot blocked');
        fetchWeekData();
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error('Error blocking slot:', error);
      toast.error('Error blocking slot');
    }
  };

  const handleUnblockSlot = async () => {
    if (!selectedSlot) return;
    
    try {
      const { data } = await customFetch.post(`/api/availability/slots/${selectedSlot._id}/unblock`);
      if (data.success) {
        toast.success('Slot unblocked');
        fetchWeekData();
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error('Error unblocking slot:', error);
      toast.error('Error unblocking slot');
    }
  };

  const getDayLabel = (day) => {
    const map = {
      Sunday: 'SUN', Monday: 'MON', Tuesday: 'TUE',
      Wednesday: 'WED', Thursday: 'THU', Friday: 'FRI', Saturday: 'SAT',
    };
    return map[day] || day?.substring(0, 3).toUpperCase() || day;
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  // Show error if no doctor profile found
  if (!isLoadingProfile && profileError && !doctorId) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-[#112429] mb-2">Doctor Profile Not Found</h2>
          <p className="text-[#64748B] mb-4">{profileError}</p>
          <p className="text-sm text-[#64748B]">Make sure you registered as a doctor. Contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-[#055153]" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full lg:flex-row flex flex-col gap-6 p-6 overflow-hidden bg-slate-50/50">
      
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent rounded-2xl">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#0D1C2E] mb-1 tracking-tight">Manage Availability</h1>
            <p className="text-[#4B5A69] text-[15px]">Configure your working hours and session blocks.</p>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-100 p-1">
            <button 
              onClick={handlePrevWeek}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-1">
              <span className="font-semibold text-[#0D1C2E] text-[15px]">
                {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
              </span>
            </div>
            <button 
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-6 flex flex-col h-0">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-[#055153]" size={32} />
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 mb-2 pb-4 border-b border-slate-100">
                <div>{/* Empty top-left cell */}</div>
                {weekData.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest mb-1">
                      {getDayLabel(day.day)}
                    </div>
                    <div className={`text-[22px] font-bold ${
                      idx === 3 ? 'text-[#055153]' : day.isBlocked ? 'text-gray-400' : 'text-[#0D1C2E]'
                    }`}>
                      {day.dayNumber}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Main View */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
                <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 h-full min-h-[600px] absolute inset-0">
                  
                  {/* Time Labels Column */}
                  <div className="flex flex-col border-r border-slate-100/50 pr-4 mt-4">
                    {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'].map((time, i) => (
                      <div key={i} className="h-24 text-[11px] font-semibold text-slate-400 text-right whitespace-nowrap">
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {weekData.map((day, dayIdx) => (
                    <div key={dayIdx} className={`relative flex flex-col border-r border-slate-100/50 last:border-r-0 ${day.isBlocked ? 'bg-slate-50/50' : ''}`}>
                      {day.isBlocked ? (
                        <div className="absolute inset-x-0 top-0 bottom-0 bg-slate-100/50 flex flex-col items-center justify-center p-4">
                          <Ban size={24} className="text-slate-300 mb-2" />
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider">BLOCKED</span>
                        </div>
                      ) : (
                        <div className="px-1 pt-4 h-full relative">
                           {day.slots.map((slot, slotIdx) => {
                             // Basic styling to mimic the calendar blocks.
                             let bgStyles = "";
                             let label = "";

                             if (slot.status === 'available') {
                               bgStyles = "bg-[#ECFDF5] border-l-4 border-emerald-500 text-emerald-800";
                               label = "AVAILABLE";
                             } else if (slot.status === 'booked') {
                               bgStyles = "bg-[#EFF6FF] border-l-4 border-blue-500 text-blue-900 shadow-sm";
                               label = slot.patientName || "Booked";
                             } else if (slot.status === 'blocked') {
                               bgStyles = "bg-slate-100 border-l-4 border-slate-400 text-slate-600";
                               label = "BLOCKED";
                             }

                             return (
                              <button
                                key={slotIdx}
                                onClick={() => handleSlotClick(slot)}
                                className={`w-full mb-3 text-left p-3 rounded-lg rounded-l-none transition-all hover:-translate-y-0.5 ${bgStyles} ${
                                  selectedSlot?._id === slot._id ? 'ring-2 ring-offset-1 ring-blue-400 shadow-md' : ''
                                }`}
                              >
                                <div className="text-[10px] font-bold tracking-wider mb-1 opacity-80 uppercase">{label}</div>
                                {slot.status === 'booked' && (
                                  <div className="text-[11px] opacity-70">
                                    {slot.appointmentType || 'Check-up'}
                                  </div>
                                )}
                                <div className="text-[11px] font-semibold mt-2 opacity-60">
                                  {slot.startTime}
                                </div>
                              </button>
                             )
                           })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend Footer */}
              <div className="flex items-center justify-between pt-4 mt-2 bg-white">
                <div className="flex items-center gap-6 px-4 py-3 bg-slate-50/80 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[12px] font-bold text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    <span className="text-[12px] font-bold text-slate-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-[12px] font-bold text-slate-600">Blocked</span>
                  </div>
                </div>

                {/* Slot Context Actions */}
                {selectedSlot && (
                  <div className="flex items-center gap-3 animate-fade-in pr-4">
                    <span className="text-[13px] font-semibold text-slate-600">
                      {selectedSlot.startTime} • {selectedSlot.status}
                    </span>
                    {selectedSlot.status === 'blocked' ? (
                      <button onClick={handleUnblockSlot} className="px-4 py-2 text-[12px] font-bold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors">
                        Unblock Slot
                      </button>
                    ) : selectedSlot.status === 'available' ? (
                      <button onClick={handleBlockSlot} className="px-4 py-2 text-[12px] font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">
                        Block Slot
                      </button>
                    ) : null}
                    <button onClick={() => setSelectedSlot(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-5 overflow-y-auto px-1 pb-4 custom-scrollbar">
        
        {/* Settings Card */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] border border-slate-100/60 p-6 pt-5">
          <div className="flex items-center gap-3 mb-6">
            <Settings2 size={20} className="text-[#055153]" />
            <h2 className="font-bold text-[17px] text-[#0D1C2E]">Appointment Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Duration */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Appointment Duration
              </label>
              <select 
                value={tempSettings.appointmentDuration}
                onChange={(e) => setTempSettings({...tempSettings, appointmentDuration: parseInt(e.target.value)})}
                className="w-full p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#0D1C2E] text-[14px] focus:ring-2 focus:ring-[#055153]/20 focus:border-[#055153] transition-all cursor-pointer appearance-none outline-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Buffer Time */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[14px] text-[#0D1C2E]">
                  Buffer Time
                </label>
                <button 
                  onClick={() => setTempSettings({...tempSettings, isBufferTimeEnabled: !tempSettings.isBufferTimeEnabled})}
                  className={`w-11 h-6 rounded-full transition-colors relative shadow-inner ${
                    tempSettings.isBufferTimeEnabled ? 'bg-[#055153]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-300 ${
                    tempSettings.isBufferTimeEnabled ? 'left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>
              <p className="text-[13px] text-slate-500 mb-2">15 min between sessions</p>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Max Appointments */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                Max Appointments Per Day
              </label>
              <input 
                type="number"
                min={1}
                max={50}
                value={tempSettings.maxAppointmentsPerDay}
                onChange={(e) => setTempSettings({...tempSettings, maxAppointmentsPerDay: parseInt(e.target.value)})}
                className="w-full p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#0D1C2E] text-[14px] focus:ring-2 focus:ring-[#055153]/20 focus:border-[#055153] transition-all outline-none"
              />
            </div>
            
            <div className="h-px bg-slate-100" />

            {/* Block Days Embedded form */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon size={18} className="text-[#055153]" />
                <span className="font-bold text-[15px] text-[#0D1C2E]">Block Days</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5 block tracking-widest">Start Date</label>
                  <input 
                    type="date"
                    value={blockDates.startDate}
                    onChange={(e) => setBlockDates({...blockDates, startDate: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-[13px] text-[#0D1C2E] focus:ring-2 focus:ring-[#055153]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5 block tracking-widest">End Date</label>
                  <input 
                    type="date"
                    value={blockDates.endDate}
                    onChange={(e) => setBlockDates({...blockDates, endDate: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-[13px] text-[#0D1C2E] focus:ring-2 focus:ring-[#055153]/20 outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={handleBlockDays}
                className="w-full py-2.5 flex justify-center items-center gap-2 bg-slate-200 hover:bg-slate-300/80 text-slate-700 rounded-xl font-bold text-[13px] transition-colors"
              >
                <Ban size={15} className="opacity-70" />
                Block Days
              </button>
            </div>
          </div>
        </div>

        {/* Change Request / Save Actions */}
        <div className="bg-[#F0F4F8] rounded-[20px] p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
          <p className="text-[13px] text-slate-600 mb-4 leading-relaxed relative z-10 px-1">
            You have <strong className="text-[#0D1C2E]">2 pending change requests</strong> for the upcoming week from the administration desk.
          </p>
          <button 
            onClick={handleUpdateSettings}
            className="w-full py-4 bg-[#055153] hover:bg-[#064243] text-white rounded-xl font-bold text-[15px] transition-all shadow-[0_4px_14px_rgba(5,81,83,0.3)] hover:shadow-[0_6px_20px_rgba(5,81,83,0.4)] hover:-translate-y-0.5 relative z-10"
          >
            Save Changes
          </button>
          
          {/* Decorative blurred circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-[40px] opacity-60 -mr-10 -mt-10" />
        </div>

        {/* Pro Tip Card */}
        <div className="bg-[#05151F] rounded-[20px] p-6 text-white relative overflow-hidden shrink-0 shadow-lg mt-auto">
          {/* Bulb Icon Decoration */}
          <div className="absolute -bottom-6 -right-6 opacity-10">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.58 2 4 5.58 4 10C4 12.35 5.03 14.47 6.64 15.93C7.22 16.45 7.61 17.18 7.61 17.97V19C7.61 19.55 8.06 20 8.61 20H15.39C15.94 20 16.39 19.55 16.39 19V17.97C16.39 17.18 16.78 16.45 17.36 15.93C18.97 14.47 20 12.35 20 10C20 5.58 16.42 2 12 2ZM15 22H9C8.45 22 8 22.45 8 23C8 23.55 8.45 24 9 24H15C15.55 24 16 23.55 16 23C16 22.45 15.55 22 15 22Z" />
            </svg>
          </div>
          
          <h3 className="font-bold text-[16px] mb-3 relative z-10">Pro Tip</h3>
          <p className="text-[13px] text-slate-300/90 leading-relaxed mb-5 relative z-10">
            Set your recurring availability once to automatically populate future weeks. Syncing with Google Calendar is recommended.
          </p>
          <button className="text-emerald-400 text-[13px] font-bold hover:text-emerald-300 transition-colors flex items-center gap-1 group relative z-10">
            Learn more 
            <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Availability;
