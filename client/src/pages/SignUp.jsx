import hero from "/Images/main.jpg";
import { useState } from "react";
import CustomButton from "@/components/UI/Button";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "@/utils/customFetch";
import axios from "axios";
import Logo from "@/components/UI/Logo";
import { MdErrorOutline } from "react-icons/md";



function SignUp() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false,
    location: false,
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^0[0-9]{9}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number starting with 0";
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      };

      // Register as patient (no role specified, backend defaults to patient)
      const authResponse = await customFetch.post("/api/auth/register", payload);

      if (authResponse.data) {
        toast.success("Registration successful! Please sign in.");
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMsg = error.response?.data?.message || error.response?.data?.msg;
        const errorMessage = backendMsg
          ? (Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg)
          : `Axios Error: ${error.message} (Status: ${error.response?.status})`;
        toast.error(errorMessage);
      } else {
        toast.error(`Unknown Error: ${error.message || "Please try again."}`);
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex lg:flex-row flex-col min-h-screen bg-[#F8FAFB] dark:bg-slate-900">
      {/* Hero Image Section - Left Side */}
      <div className="lg:w-1/2 lg:block hidden relative overflow-hidden">
        <img
          src={hero}
          alt="Medical Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#012022] via-[#054E50]/95 to-[#087D80]/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8 font-manrope max-w-xl drop-shadow-xl">
            <h2 className="text-4xl xl:text-5xl font-black mb-4 drop-shadow-lg text-white">Join Us Today</h2>
            <p className="text-lg xl:text-xl font-inter drop-shadow-md text-white/95">Create an account to access premium healthcare services tailored for you.</p>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center items-center py-6 px-4 sm:px-10 lg:px-12 relative bg-[#F8FAFB] dark:bg-slate-900 min-h-screen">
        <div className="w-full max-w-[460px] bg-white/70 dark:bg-slate-800/40 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-700/50 px-6 py-6 sm:px-8 sm:py-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          
          {/* Header */}
          <div className="mb-4 font-manrope">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112429] dark:text-white mb-1">Create Account</h1>
            <p className="text-[#64748B] dark:text-slate-400 text-xs sm:text-sm font-inter">
              Sign up to get started with your account
            </p>
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="Enter Your Name"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 ${
                  touched.fullName && errors.fullName
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              {touched.fullName && errors.fullName && (
                <MdErrorOutline className="absolute right-4 top-3.5 text-red-500 text-xl" />
              )}
            </div>
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your E-mail"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 ${
                  touched.email && errors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              {touched.email && errors.email && (
                <MdErrorOutline className="absolute right-4 top-3.5 text-red-500 text-xl" />
              )}
            </div>
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Phone Number
            </label>
            <div className="relative group">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="Enter Phone Number"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 ${
                  touched.phoneNumber && errors.phoneNumber
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <MdErrorOutline className="absolute right-4 top-3.5 text-red-500 text-xl" />
              )}
            </div>
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Location
            </label>
            <div className="relative group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                onBlur={() => handleBlur("location")}
                placeholder="Enter Location"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 ${
                  touched.location && errors.location
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              {touched.location && errors.location && (
                <MdErrorOutline className="absolute right-4 top-3.5 text-red-500 text-xl" />
              )}
            </div>
            {touched.location && errors.location && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.location}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 pr-12 ${
                  touched.password && errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {passwordVisible ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#112429] dark:text-slate-200 mb-1.5">
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2.5 text-sm font-medium bg-white/50 dark:bg-slate-800/50 dark:text-white border border-slate-200/80 dark:border-slate-700/50 rounded-xl transition-colors focus:outline-none focus:bg-white dark:focus:bg-slate-800/80 pr-12 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "focus:border-[#055153] dark:focus:border-primary focus:ring-4 focus:ring-[#055153]/10 dark:focus:ring-primary/20 hover:border-[#CBD5E1] dark:hover:border-slate-600"
                } font-inter`}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {confirmPasswordVisible ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleFormSubmit}
            disabled={isLoading}
            className="w-full bg-[#055153] dark:bg-primary hover:bg-[#044143] dark:hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[#055153]/20 dark:shadow-primary/20 mt-1 font-inter"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span>{isLoading ? "Creating Account..." : "Sign Up"}</span>
          </button>

          {/* Sign In Link */}
          <p className="text-center text-[#475569] dark:text-slate-400 text-sm font-medium mt-6 font-inter">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#055153] dark:text-primary font-bold hover:underline transition-colors block mx-auto py-1"
            >
              Sign In
            </button>
          </p>

          {/* Security Notice */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-700">
            <p className="text-xs text-[#94A3B8] dark:text-slate-500 text-center leading-relaxed">
              This site is protected by reCAPTCHA and the Google Privacy Policy
              and Terms of Service apply.
              <br /> © 2026 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
