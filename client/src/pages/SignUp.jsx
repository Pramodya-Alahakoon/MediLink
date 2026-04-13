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
      const response = await customFetch.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      });

      if (response.data) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.msg || "Registration failed";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex lg:flex-row flex-col min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Image Section - Left Side */}
      <div className="lg:w-1/2 lg:block hidden relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
        <img
          src={hero}
          alt="Medical Background"
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <h2 className="text-4xl font-bold mb-4">Join Us Today</h2>
            <p className="text-lg opacity-90">Create an account to access healthcare services</p>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-8 lg:mb-12">
          <Logo className="w-[112px] h-[54px]" />
        </div>

        {/* Sign Up Container */}
        <div className="w-full max-w-xl lg:max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Sign up to get started with your account
            </p>
          </div>

          {/* Full Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="John Doe"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                  touched.fullName && errors.fullName
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                  touched.email && errors.email
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Phone Number
            </label>
            <div className="relative group">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="0xxxxxxxxx"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                  touched.phoneNumber && errors.phoneNumber
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Location
            </label>
            <div className="relative group">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                onBlur={() => handleBlur("location")}
                placeholder="City, Country"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                  touched.location && errors.location
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none pr-12 ${
                  touched.password && errors.password
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none pr-12 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
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
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
          <p className="text-center text-gray-600 text-sm font-medium mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              This site is protected by reCAPTCHA and the Google Privacy Policy
              and Terms of Service apply. © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
