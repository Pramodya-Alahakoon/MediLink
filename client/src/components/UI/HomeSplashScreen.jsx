import React from "react";
import { motion } from "framer-motion";

const HomeSplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#ECF5F6] dark:bg-slate-950">
      <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#23A6A8]/25 blur-3xl" />
      <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-[#055153]/25 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-white/40 dark:bg-teal-500/10 blur-2xl" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex w-full max-w-xl flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.84, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-[#0A7D7F]/20 blur-xl" />
            <img
              src="/Images/medilink-logo.png"
              alt="MediLink Cloud"
              className="relative h-36 w-36 object-contain md:h-44 md:w-44"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-center font-manrope text-[32px] font-black tracking-[0.08em] text-[#063B44] dark:text-teal-300 md:text-[44px]"
          >
            MEDILINK CLOUD
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.55 }}
            className="mt-2 text-center font-inter text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0E5660]/80 dark:text-teal-200/80"
          >
            Intelligent care, connected lives
          </motion.p>

          <div className="mt-8 h-1.5 w-60 overflow-hidden rounded-full bg-white/70 dark:bg-slate-800">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-[#0C7C80] via-[#12A4A7] to-[#055153]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeSplashScreen;
