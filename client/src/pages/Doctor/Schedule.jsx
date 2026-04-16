import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Video, 
  User, 
  FileText, 
  X,
  Trash2,
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-hot-toast';
import customFetch from '../../utils/customFetch';
import { useDoctorContext } from '../../context/DoctorContext';
import PrescriptionBuilderModal from '../../components/DoctorDashboard/PrescriptionBuilderModal';
import PatientReportsViewerModal from '../../components/DoctorDashboard/PatientReportsViewerModal';

const Schedule = () => {
  const { doctorId } = useDoctorContext();
  const [activeTab, setActiveTab] = useState('Upcoming'); // Upcoming, Pending, Completed, Cancelled
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ Upcoming: 0, Pending: 0, Completed: 0, Cancelled: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptionModalApt, setPrescriptionModalApt] = useState(null);
  const [reportModalApt, setReportModalApt] = useState(null);

  const statusMap = {
    'Upcoming': 'Confirmed',
    'Pending': 'Pending',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled'
  };

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
      fetchAllCounts();
    }
  }, [doctorId, activeTab, page]);

  const fetchAllCounts = async () => {
    try {
      const fetchCount = async (status) => {
        const { data } = await customFetch.get(`/api/doctors/${doctorId}/appointments?status=${status}&limit=1`);
        return data.total || 0;
      };
      
      const [confirmed, pending, completed, cancelled] = await Promise.all([
        fetchCount('Confirmed'),
        fetchCount('Pending'),
        fetchCount('Completed'),
        fetchCount('Cancelled')
      ]);

      setCounts({
        Upcoming: confirmed,
        Pending: pending,
        Completed: completed,
        Cancelled: cancelled
      });
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const mappedStatus = statusMap[activeTab];
      const { data } = await customFetch.get(`/api/doctors/${doctorId}/appointments?status=${mappedStatus}&page=${page}&limit=10`);
      
      if (data.success) {
        setAppointments(data.data || data.appointments || []);
        const total = data.total || 0;
        setTotalPages(Math.ceil(total / 10) || 1);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, appointmentId, extraData = {}) => {
    try {
      let endpoint = '';
      let method = 'put';
      let payload = { ...extraData };

      switch (action) {
        case 'accept':
          endpoint = `/api/doctors/appointments/${appointmentId}/accept`;
          break;
        case 'reject':
        case 'cancel':
          endpoint = `/api/doctors/appointments/${appointmentId}/reject`;
          payload.reason = 'Cancelled by doctor';
          break;
        case 'complete': // if we add a restore/complete feature later
          endpoint = `/api/doctors/appointments/${appointmentId}/complete`;
          break;
        default:
          return;
      }

      const { data } = await customFetch[method](endpoint, payload);
      
      if (data.success || data.msg) {
        toast.success(`Appointment ${action}ed successfully`);
        fetchAppointments();
        fetchAllCounts();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to ${action} appointment`);
    }
  };

  const handleStartCall = async (apt) => {
    try {
      // Create or fetch existing video consultation session via telemedicine-service
      const { data } = await customFetch.post('/api/consultations/create-session', {
        appointmentId: apt._id,
        doctorId: doctorId,
        patientId: apt.patientId?._id || apt.patientId,
        notes: apt.symptoms
      });

      if (data.success && data.data?.meetingLink) {
        const link = data.data.meetingLink;
        // Frontend should open meetingLink in browser for video call
        window.open(link, '_blank');
        toast.success(
          `Video session started! 🎥\nRoom: ${link.split('/').pop()}`,
          { duration: 6000, icon: '🩺' }
        );
      } else {
        toast.error('Failed to generate meeting link. Please try again.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Could not start video call');
    }
  };


  const getFilteredAppointments = () => {
    if (!searchQuery) return appointments;
    return appointments.filter(apt => 
      (apt.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (apt.contactPhone || '').includes(searchQuery)
    );
  };

  const safeFormatDate = (dateStr, formatStyle, fallback = 'TBD') => {
    try {
      if (!dateStr) return fallback;
      return format(parseISO(dateStr), formatStyle);
    } catch (e) {
      return fallback;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="w-full min-h-screen bg-[#F8FAFB] flex flex-col p-6 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[26px] xl:text-[30px] font-bold text-[#0D1C2E] mb-1 tracking-tight">Appointment Management</h1>
          <p className="text-[#64748B] text-[15px]">Review and manage your daily clinical consultation flow.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white p-1 rounded-full shadow-sm border border-slate-200">
            <button className="px-5 py-2 text-[14px] font-bold rounded-full bg-[#F1F5F9] text-[#0D1C2E] flex items-center gap-2 transition-all">
              <Filter size={16} /> List View
            </button>
            <button className="px-5 py-2 text-[14px] font-bold rounded-full text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-all hover:bg-slate-50">
              <Calendar size={16} /> Calendar
            </button>
          </div>
          <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#055153] text-white font-bold rounded-full text-[14px] shadow-sm hover:bg-[#044042] transition-colors">
            New Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar">
        {['Upcoming', 'Pending', 'Completed', 'Cancelled'].map((tab) => {
          let label = tab;
          if (tab === 'Upcoming' && counts.Upcoming > 0) label = `Upcoming (${counts.Upcoming})`;
          if (tab === 'Pending' && counts.Pending > 0) label = `Pending Requests (${counts.Pending})`;

          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`pb-4 px-2 text-[15px] font-bold whitespace-nowrap transition-colors relative ${
                activeTab === tab 
                  ? 'text-[#055153]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#055153] rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Action Bar (Search & Filters) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-[14px] shadow-sm focus:outline-none focus:border-[#055153] focus:ring-1 focus:ring-[#055153]"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50">
            <Calendar size={18} className="text-[#0D1C2E]" />
            <span className="font-semibold text-[#0D1C2E] text-[14px]">Today</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50">
            <Filter size={18} className="text-[#0D1C2E]" />
            <span className="font-semibold text-[#0D1C2E] text-[14px]">All Types</span>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="flex-1 flex flex-col gap-4 relative">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-2xl">
             <Loader2 className="animate-spin text-[#055153]" size={40} />
           </div>
        ) : filteredAppointments.length === 0 ? (
           <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Calendar className="text-slate-400" size={32} />
             </div>
             <h3 className="text-[18px] font-bold text-slate-700 mb-1">No appointments found</h3>
             <p className="text-slate-500">There are no {activeTab.toLowerCase()} appointments right now.</p>
           </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-[24px] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              
              {/* Profile Details */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-[#E2E8F0] overflow-hidden shrink-0 flex items-center justify-center text-[#64748B] font-bold text-xl border-2 border-white shadow-sm">
                  {(apt.patientName?.charAt(0) || '?').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0D1C2E] mb-1">{apt.patientName || 'Unknown Patient'}</h3>
                  <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium font-inter">
                    <span>{apt.contactPhone || 'No Phone'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[#055153] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                      {apt.specialization || 'General'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Details */}
              <div className="flex items-center gap-3 w-48 shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-[#0D1C2E]" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0D1C2E] mb-0.5">
                    {safeFormatDate(apt.appointmentDate, 'hh:mm a', 'TBD')}
                  </div>
                  <div className="text-[12px] text-slate-500 font-medium">
                    {safeFormatDate(apt.appointmentDate, 'MMM dd, yyyy', 'No date set')}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-2 items-start lg:items-center w-32 shrink-0">
                <div className={`px-3 py-1 text-[11px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wider
                  ${apt.specialization === 'General Medicine' ? 'bg-[#EEF2FF] text-[#3B82F6]' : 'bg-[#ECFEFF] text-[#0891B2]'}`}>
                  {apt.specialization === 'General Medicine' ? <User size={12}/> : <Video size={12}/>}
                  Consult
                </div>
                <div className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide
                  ${apt.status === 'Confirmed' ? 'bg-[#ECFDF5] text-emerald-600' : ''}
                  ${apt.status === 'Pending' ? 'bg-[#FEF3C7] text-amber-700' : ''}
                  ${apt.status === 'Cancelled' ? 'bg-[#FEF2F2] text-red-600' : ''}
                  ${apt.status === 'Completed' ? 'bg-[#F1F5F9] text-slate-600' : ''}
                `}>
                  {apt.status}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 lg:mt-0 ml-auto bg-[#F8FAFB] p-2 rounded-2xl">
                
                {apt.status === 'Pending' && (
                  <button 
                    onClick={() => handleAction('accept', apt._id)}
                    className="px-6 py-2.5 bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E3A8A] font-bold text-[14px] rounded-xl transition-colors shadow-sm"
                  >
                    Confirm Visit
                  </button>
                )}

                {apt.status === 'Confirmed' && (
                  <button 
                    onClick={() => handleStartCall(apt)}
                    className="px-6 py-2.5 bg-[#055153] hover:bg-[#044042] text-white font-bold text-[14px] rounded-xl transition-colors shadow-sm"
                  >
                    Start Call
                  </button>
                )}

                {apt.status === 'Cancelled' && (
                  <div className="px-6 py-2.5 bg-slate-200 text-slate-500 font-bold text-[14px] rounded-xl opacity-70">
                    Cancelled
                  </div>
                )}

                {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                  <>
                    <button 
                      onClick={() => setPrescriptionModalApt(apt)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-emerald-600 hover:text-emerald-700 transition-colors shadow-sm bg-transparent border border-transparent hover:border-emerald-200"
                      title="Issue E-Prescription"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => setReportModalApt(apt)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-indigo-600 hover:text-indigo-700 transition-colors shadow-sm bg-transparent border border-transparent hover:border-indigo-200"
                      title="View Patient Records"
                    >
                      <FolderOpen size={18} />
                    </button>
                    <button 
                      onClick={() => handleAction('reject', apt._id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-slate-500 hover:text-red-500 transition-colors shadow-sm bg-transparent border border-transparent hover:border-slate-200"
                    >
                      <X size={20} />
                    </button>
                  </>
                )}

                {apt.status === 'Cancelled' && (
                   <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white text-slate-500 hover:text-red-500 transition-colors shadow-sm bg-transparent border border-transparent hover:border-slate-200">
                     <Trash2 size={18} />
                   </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between mt-8 pt-4">
          <span className="text-[14px] font-medium text-slate-500">
            Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, counts[activeTab] || 10)} of {counts[activeTab] || filteredAppointments.length} appointments
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-[#0D1C2E] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#055153] text-white font-bold text-[14px] shadow-sm">
              {page}
            </div>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-[#0D1C2E] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Prescription Builder Modal */}
      <PrescriptionBuilderModal 
        isOpen={!!prescriptionModalApt}
        appointment={prescriptionModalApt}
        doctorId={doctorId}
        onClose={() => setPrescriptionModalApt(null)}
        onSuccess={() => {
          fetchAppointments();
          fetchAllCounts();
        }}
      />

      {/* Patient Reports Viewer Modal */}
      <PatientReportsViewerModal 
        isOpen={!!reportModalApt}
        appointment={reportModalApt}
        onClose={() => setReportModalApt(null)}
      />
    </div>
  );
};

export default Schedule;
