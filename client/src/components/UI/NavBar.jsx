import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogIn, FiUserPlus, FiLogOut, FiUser, FiMenu, FiX } from "react-icons/fi";
import Logo from "@/components/UI/Logo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import customFetch from "@/utils/customFetch";
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
        const { data } = await customFetch.get("/users/current-user");
        setCurrentUser(data.user);
      } catch {
        setCurrentUser(null);
      }
    };
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await customFetch.post("/auth/logout");
      setCurrentUser(null);
      setIsLogoutModalOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Error logging out");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-4 sm:mx-6 lg:mx-10 rounded-2xl transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
          isScrolled
            ? "glass shadow-xl shadow-tertiary/5"
            : "bg-transparent"
        }`}>
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-black text-base font-manrope">M</span>
              </div>
              <span className="font-bold text-lg text-tertiary font-manrope tracking-tight hidden sm:block">
                Medi<span className="text-primary">Link</span>
              </span>
            </Link>

            {/* Desktop Nav - center */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/60">
              {NavItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 font-inter ${
                    isActive(item.path)
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "text-tertiary/70 hover:text-tertiary hover:bg-white/80"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  <Link to={`/${currentUser.role}-dashboard`}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-tertiary hover:text-primary transition-colors font-inter">
                      <FiUser className="w-4 h-4" />
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-tertiary text-white hover:bg-tertiary/90 transition-all font-inter shadow-sm"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <button className="px-4 py-2 rounded-full text-sm font-medium text-tertiary/70 hover:text-tertiary transition-colors font-inter">
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/80 glass flex items-center justify-center text-tertiary hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
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
              className="lg:hidden mx-4 sm:mx-6 mt-2 glass rounded-2xl shadow-2xl border border-white/60 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {NavItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all font-inter ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-tertiary hover:bg-primary/5 hover:text-primary"
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
