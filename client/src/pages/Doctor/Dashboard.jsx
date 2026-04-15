import React from 'react';
import { Calendar, Briefcase, ClipboardList, Wallet, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/DoctorDashboard/StatCard';
import ScheduleList from '../../components/DoctorDashboard/ScheduleList';
import ActivityFeed from '../../components/DoctorDashboard/ActivityFeed';
import QuickShortcuts from '../../components/DoctorDashboard/QuickShortcuts';

const Dashboard = () => {
  const { user } = useAuth();
  const doctorName = user?.name || user?.fullName || 'Doctor';

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
            <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all font-bold text-[#055153] dark:text-teal-400 text-[13px] font-inter">
              <Download size={16} strokeWidth={2.5} />
              Daily Summary
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Total Appointments" 
            value="342" 
            badgeText="+12%" 
            badgeColor="green" 
            icon={Calendar} 
          />
          <StatCard 
            title="Today's Consultations" 
            value="12" 
            badgeText="4 remaining" 
            badgeColor="blue" 
            icon={Briefcase} 
          />
          <StatCard 
            title="Pending Requests" 
            value="8" 
            badgeText="New" 
            badgeColor="red" 
            icon={ClipboardList} 
          />
          <StatCard 
            title="Monthly Earnings" 
            value="450,200" 
            icon={Wallet} 
            isHighlighted={true}
          />
        </div>

        {/* Today's Schedule */}
        <div className="mt-2 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
          <ScheduleList />
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

