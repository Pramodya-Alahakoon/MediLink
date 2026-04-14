import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-x-hidden">
      {/* Global Toast Provider */}
      <Toaster position="top-right" reverseOrder={false} />


      {/* Navbar - Now handles its own fixed positioning */}
      <Navbar />

      {/* Page Content - Full width without extra constraints */}
      <main className="w-full flex-grow pt-20 px-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
