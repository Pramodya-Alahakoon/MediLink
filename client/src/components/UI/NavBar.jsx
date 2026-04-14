import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn, FiUserPlus, FiLogOut, FiUser, FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import Logo from "@/components/UI/Logo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-hot-toast";
import Modal from "@/components/UI/Modal";

const NavItems = [
  { title: "Home", path: "/" },
  { title: "Appointments", path: "/appointments" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

function NavComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCurrentUser(null);
          return;
        }
        const { data } = await customFetch.post("/api/auth/verify", { token });
        setCurrentUser(data.user);
      } catch (error) {
        console.warn("Failed to fetch current user:", error.message);
        setCurrentUser(null);
      }
    };
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await customFetch.post("/api/auth/logout");
      setCurrentUser(null);
      localStorage.removeItem("token");
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.warn("Error logging out:", error.message);
      // Clear local data even if API fails
      setCurrentUser(null);
      localStorage.removeItem("token");
      setIsLogoutModalOpen(false);
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-4 sm:mx-6 lg:mx-10 rounded-2xl transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
          isScrolled
            ? "glass shadow-xl shadow-tertiary/5 dark:bg-slate-900/80 dark:border-white/10 dark:shadow-slate-900/20"
            : "bg-transparent"
        }`}>
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-black text-base font-manrope">M</span>
              </div>
              <span className="font-bold text-lg text-tertiary dark:text-white font-manrope tracking-tight hidden sm:block">
                Medi<span className="text-primary">Link</span>
              </span>
            </Link>

            {/* Desktop Nav - center */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/60 dark:border-white/10">
              {NavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                    isActive(item.path)
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "text-tertiary/70 dark:text-slate-300 hover:text-tertiary dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-800 border border-white/60 dark:border-slate-700 text-tertiary dark:text-yellow-400 hover:bg-white/80 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              </button>

              {currentUser ? (
                <>
                  <Link to={`/${currentUser.role}-dashboard`}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-tertiary dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors font-inter">
                      <FiUser className="w-4 h-4" />
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-tertiary dark:bg-slate-700 text-white hover:bg-tertiary/90 dark:hover:bg-slate-600 transition-all font-inter shadow-sm"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <button className="px-4 py-2 rounded-full text-sm font-medium text-tertiary/70 dark:text-slate-300 hover:text-tertiary dark:hover:text-white transition-colors font-inter">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all font-inter shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
                      <FiUserPlus className="w-4 h-4" />
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu & Theme Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-800 flex items-center justify-center text-tertiary dark:text-yellow-400 hover:text-primary dark:hover:text-yellow-300 transition-colors"
              >
                {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-800 flex items-center justify-center text-tertiary dark:text-slate-200 hover:text-primary dark:hover:text-white transition-colors border border-transparent dark:border-slate-700"
              >
                {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mx-4 sm:mx-6 mt-2 glass dark:bg-slate-800/95 rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {NavItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all font-inter ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-tertiary dark:text-slate-200 hover:bg-primary/5 hover:text-primary dark:hover:bg-slate-700"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="p-4 pt-0 border-t border-white/40 flex flex-col gap-2 mt-2">
                {currentUser ? (
                  <>
                    <Link to={`/${currentUser.role}-dashboard`}>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border-2 border-tertiary/20 text-tertiary hover:border-primary hover:text-primary transition-all font-inter">
                        <FiUser className="w-4 h-4" />
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={() => { setIsLogoutModalOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-tertiary text-white font-inter"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 border-tertiary/20 text-tertiary hover:border-primary hover:text-primary transition-all font-inter">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/signup">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-white font-inter">
                        <FiUserPlus className="w-4 h-4" />
                        Get Started Free
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout">
        <div className="space-y-5">
          <p className="text-neutral font-inter text-base">
            Are you sure you want to log out of MediLink Cloud?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-tertiary hover:bg-gray-50 text-sm font-medium font-inter transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-semibold font-inter transition-colors shadow-sm"
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default NavComponent;
