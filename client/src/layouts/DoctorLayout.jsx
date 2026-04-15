import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/DoctorDashboard/Sidebar';
import TopHeader from '../components/DoctorDashboard/TopHeader';
import { DoctorProvider, useDoctorContext } from '../context/DoctorContext';

const DoctorLayoutContent = () => {
  const { isSidebarOpen, toggleSidebar } = useDoctorContext();

  return (
    <div className="flex w-full min-h-screen bg-[#F8FAFB] dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Overlay/Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Responsive Design */}
      <div className={`
        fixed inset-y-0 left-0 z-[60] lg:static lg:z-auto
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out flex-shrink-0
      `}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <TopHeader />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-[1600px] h-full pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const DoctorLayout = () => {
  return (
    <DoctorProvider>
      <DoctorLayoutContent />
    </DoctorProvider>
  );
};

export default DoctorLayout;

