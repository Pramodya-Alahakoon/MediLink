import React, { useState, useEffect } from 'react';
import { Calendar, Briefcase, ClipboardList, Wallet, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDoctorContext } from '../../context/DoctorContext';
import customFetch from '../../utils/customFetch';
import StatCard from '../../components/DoctorDashboard/StatCard';
import ScheduleList from '../../components/DoctorDashboard/ScheduleList';
import ActivityFeed from '../../components/DoctorDashboard/ActivityFeed';
import QuickShortcuts from '../../components/DoctorDashboard/QuickShortcuts';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { doctorProfile, doctorId, isLoadingProfile, profileError } = useDoctorContext();
  const doctorName = doctorProfile?.name || user?.name || 'Doctor';

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: null,
    todayCount: null,
    remainingToday: null,
    pendingRequests: null,
    monthlyEarnings: null,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [activityItems, setActivityItems] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [allRes, pendRes, payRes] = await Promise.all([
          customFetch.get(`/api/doctors/${doctorId}/appointments?limit=500`),
          customFetch.get(`/api/doctors/${doctorId}/appointments?status=Pending&limit=1`),
          customFetch
            .get(`/api/payment/doctor/summary?doctorId=${encodeURIComponent(doctorId)}`)
            .catch(() => ({ data: { data: { monthlyTotal: 0 } } })),
        ]);

        const apps = allRes.data?.data || [];
        const total = allRes.data?.total ?? apps.length;
        const pendingTotal = pendRes.data?.total ?? 0;

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const todayApps = apps.filter((a) => {
          const d = new Date(a.appointmentDate);
          return isWithinInterval(d, { start: todayStart, end: todayEnd });
        });

        const activeToday = todayApps.filter((a) =>
          ['Pending', 'Confirmed'].includes(a.status)
        );
        const todayCount = activeToday.length;
        const now = new Date();
        const remainingToday = activeToday.filter(
          (a) => new Date(a.appointmentDate) > now && a.status !== 'Completed'
        ).length;

        const monthlyEarnings = payRes.data?.data?.monthlyTotal ?? 0;

        setStats({
          totalAppointments: total,
          todayCount,
          remainingToday,
          pendingRequests: pendingTotal,
          monthlyEarnings,
        });

        const sortedToday = [...activeToday].sort(
          (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
        );
        setTodayAppointments(sortedToday);

        const recent = [...apps]
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt || 0) -
              new Date(a.createdAt || a.updatedAt || 0)
          )
          .slice(0, 8);

        setActivityItems(
          recent.map((a) => ({
            id: a._id,
            patientName: a.patientName || 'Patient',
            status: a.status,
            appointmentDate: a.appointmentDate,
            createdAt: a.createdAt,
            specialization: a.specialization,
          }))
        );
      } catch (e) {
        console.error('Dashboard load failed:', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doctorId]);

  const fmt = (n) => (n === null || n === undefined ? '—' : String(n));
  const fmtMoney = (n) =>
    n === null || n === undefined
      ? '—'
      : Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

  const statsLoading = isLoadingProfile || loading;

  return (
    <div className="w-full h-full p-4 md:p-8 flex lg:flex-row flex-col gap-8 bg-[#F8FAFB] dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-black text-[#112429] dark:text-white tracking-tight font-manrope leading-tight mb-2 transition-colors">
              Good Morning,{' '}
              <span className="text-[#055153] dark:text-teal-400">Dr. {doctorName}</span>
            </h1>
            <p className="text-[#475569] dark:text-slate-400 font-medium font-inter text-[14px] md:text-[15px] transition-colors">
              Here is what is happening with your practice today.
            </p>
            {profileError && (
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{profileError}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all font-bold text-[#055153] dark:text-teal-400 text-[13px] font-inter"
            >
              <Download size={16} strokeWidth={2.5} />
              Daily Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Appointments"
            value={statsLoading ? '—' : fmt(stats.totalAppointments)}
            icon={Calendar}
          />
          <StatCard
            title="Today's Consultations"
            value={statsLoading ? '—' : fmt(stats.todayCount)}
            badgeText={
              statsLoading || !stats.remainingToday
                ? undefined
                : `${stats.remainingToday} remaining`
            }
            badgeColor="blue"
            icon={Briefcase}
          />
          <StatCard
            title="Pending Requests"
            value={statsLoading ? '—' : fmt(stats.pendingRequests)}
            badgeText={
              stats.pendingRequests > 0 && !statsLoading ? 'Action needed' : undefined
            }
            badgeColor="red"
            icon={ClipboardList}
          />
          <StatCard
            title="Monthly Earnings (LKR)"
            value={statsLoading ? '—' : fmtMoney(stats.monthlyEarnings)}
            icon={Wallet}
            isHighlighted={true}
          />
        </div>

        <div className="mt-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
          <ScheduleList
            appointments={todayAppointments}
            loading={statsLoading}
            doctorId={doctorId}
          />
        </div>
      </div>

      <div className="w-full lg:w-[320px] xl:w-[350px] flex-shrink-0 flex flex-col gap-6">
        <ActivityFeed activities={activityItems} loading={statsLoading} />
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
          <QuickShortcuts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
