import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Briefcase, ClipboardList, Wallet, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDoctorContext } from '../../context/DoctorContext';
import StatCard from '../../components/DoctorDashboard/StatCard';
import ScheduleList from '../../components/DoctorDashboard/ScheduleList';
import ActivityFeed from '../../components/DoctorDashboard/ActivityFeed';
import QuickShortcuts from '../../components/DoctorDashboard/QuickShortcuts';
import customFetch from '../../utils/customFetch';
import { format, isSameDay, parseISO } from 'date-fns';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const { user } = useAuth();
  const { doctorId, doctorProfile } = useDoctorContext();
  const doctorName = doctorProfile?.name || user?.name || user?.fullName || 'Doctor';

  const [appointments, setAppointments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!doctorId) return;
      setLoadingStats(true);
      try {
        // Fetch confirmed + pending for a richer summary
        const [confirmedRes, pendingRes, completedRes] = await Promise.all([
          customFetch.get(`/api/doctors/${doctorId}/appointments?status=Confirmed&page=1&limit=50`),
          customFetch.get(`/api/doctors/${doctorId}/appointments?status=Pending&page=1&limit=50`),
          customFetch.get(`/api/doctors/${doctorId}/appointments?status=Completed&page=1&limit=50`),
        ]);

        const confirmed = confirmedRes.data?.data || confirmedRes.data?.appointments || [];
        const pending = pendingRes.data?.data || pendingRes.data?.appointments || [];
        const completed = completedRes.data?.data || completedRes.data?.appointments || [];
        setAppointments([...confirmed, ...pending, ...completed]);
      } catch (e) {
        console.error('Failed to load dashboard appointments', e);
        setAppointments([]);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, [doctorId]);

  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    if (!appointments.length) {
      return { total: 0, todayConsults: 0, pending: 0 };
    }
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    const todayConsults = appointments.filter((a) => {
      if (!a.appointmentDate) return false;
      const d = typeof a.appointmentDate === 'string' ? parseISO(a.appointmentDate) : new Date(a.appointmentDate);
      return isSameDay(d, today);
    }).length;
    return { total, todayConsults, pending };
  }, [appointments, today]);

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (!a.appointmentDate) return false;
      const d = typeof a.appointmentDate === 'string' ? parseISO(a.appointmentDate) : new Date(a.appointmentDate);
      return isSameDay(d, today);
    });
  }, [appointments, today]);

  const handleDailySummaryPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    let y = margin;

    const primary = '#055153';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(primary);
    doc.text('MediLink Daily Clinical Summary', margin, y);
    y += 24;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#111111');
    doc.text(`Doctor: Dr. ${doctorName}`, margin, y);
    y += 16;
    if (doctorProfile?.specialization) {
      doc.text(`Specialization: ${doctorProfile.specialization}`, margin, y);
      y += 16;
    }
    doc.text(`Date: ${format(today, 'dd MMM yyyy')}`, margin, y);
    y += 24;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Summary', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = [
      `Total appointments (recent): ${stats.total}`,
      `Today\'s consultations: ${stats.todayConsults}`,
      `Pending requests: ${stats.pending}`,
    ];
    lines.forEach((line) => {
      doc.text(line, margin, y);
      y += 14;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Today\'s Schedule', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const header = ['Time', 'Patient', 'Status', 'Specialty'];
    const colWidths = [70, 180, 80, 140];

    let x = margin;
    header.forEach((h, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(h, x, y);
      x += colWidths[i];
    });
    y += 12;
    doc.setFont('helvetica', 'normal');

    const maxRows = 12; // ensure single page
    todayAppointments.slice(0, maxRows).forEach((apt) => {
      x = margin;
      const dateVal = apt.appointmentDate
        ? format(typeof apt.appointmentDate === 'string' ? parseISO(apt.appointmentDate) : new Date(apt.appointmentDate), 'hh:mm a')
        : 'TBD';
      const patient = apt.patientName || 'Unknown';
      const status = apt.status || '—';
      const spec = apt.specialization || 'General';

      const row = [dateVal, patient, status, spec];
      row.forEach((cell, i) => {
        const text = String(cell).slice(0, 26);
        doc.text(text, x, y);
        x += colWidths[i];
      });
      y += 12;
    });

    doc.save(`medilink-daily-summary-${format(today, 'yyyyMMdd')}.pdf`);
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex lg:flex-row flex-col gap-8 bg-[#F8FAFB] dark:bg-slate-950 transition-colors duration-300">
      {/* Left Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-black text-[#112429] dark:text-white tracking-tight font-manrope leading-tight mb-2 transition-colors">
              Good Morning, <span className="text-[#055153] dark:text-teal-400">Dr. {doctorName}</span>
            </h1>
            <p className="text-[#475569] dark:text-slate-400 font-medium font-inter text-[14px] md:text-[15px] transition-colors">
              Here is what is happening with your practice today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDailySummaryPdf}
              disabled={loadingStats}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white rounded-full shadow-md shadow-primary/30 transition-all font-bold text-[13px] font-inter"
            >
              <Download size={16} strokeWidth={2.5} />
              Daily Summary (PDF)
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Total Appointments" 
            value={stats.total.toString()} 
            badgeText={stats.total ? 'Last 50 loaded' : undefined} 
            badgeColor="green" 
            icon={Calendar} 
          />
          <StatCard 
            title="Today's Consultations" 
            value={stats.todayConsults.toString()} 
            badgeText={stats.todayConsults ? undefined : 'No visits today'} 
            badgeColor="blue" 
            icon={Briefcase} 
          />
          <StatCard 
            title="Pending Requests" 
            value={stats.pending.toString()} 
            badgeText={stats.pending ? 'Action needed' : 'All clear'} 
            badgeColor="red" 
            icon={ClipboardList} 
          />
          <StatCard 
            title="Monthly Earnings" 
            value="—" 
            icon={Wallet} 
            isHighlighted={true}
          />
        </div>

        {/* Today's Schedule */}
        <div className="mt-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all max-h-[380px] flex flex-col">
          <ScheduleList todayAppointments={todayAppointments} loading={loadingStats} />
        </div>
        
      </div>

      {/* Right Column (Sidebar Widgets) */}
      <div className="w-full lg:w-[320px] xl:w-[350px] flex-shrink-0 flex flex-col gap-6">
        <ActivityFeed />
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
           <QuickShortcuts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

