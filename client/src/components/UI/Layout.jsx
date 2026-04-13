import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";

function Layout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-x-hidden">
      {/* Global Toast Provider */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-20 backdrop-blur-md">
          <BounceLoader size={50} color="#EE1133" />
        </div>
      )}

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
