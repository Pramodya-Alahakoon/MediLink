import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/DoctorDashboard/Sidebar';
import TopHeader from '../components/DoctorDashboard/TopHeader';
import { DoctorProvider } from '../context/DoctorContext';

const DoctorLayout = () => {
  return (
    <DoctorProvider>
      <div className="flex w-full min-h-screen bg-[#F4F7F8] overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <TopHeader />
          </div>

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="mx-auto max-w-7xl h-full pb-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DoctorProvider>
  );
};

export default DoctorLayout;
