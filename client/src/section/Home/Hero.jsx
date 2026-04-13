import hero from "/Images/main.jpg";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import customFetch from "../../utils/customFetch";

function Hero() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await customFetch.get("/users/current-user");
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setCurrentUser(null);
      }
    };
    getCurrentUser();
  }, []);

  const handlePlanEventClick = (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to plan an event");
      navigate("/signin");
      return;
    }

    navigate("/plan-event");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <img
        src={hero}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container - Centered */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 lg:px-20">
        {/* Text Content */}
        <div className="w-full max-w-2xl text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4"
          >
            Make Your Appointment
          </motion.h1>

          {/* Sub Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.5,
            }}
            className="text-gray-300 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.7,
            }}
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Create unforgettable experiences with our world-class facilities and
            expert support
          </motion.p>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.9,
            }}
          >
            <Link to="/plan-event" onClick={handlePlanEventClick}>
              <button className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-lg transition-all duration-300 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl">
                Plan Appointment
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
