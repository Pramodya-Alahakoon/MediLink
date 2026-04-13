import hero from "/Images/main.jpg";
import { useState } from "react";
import CustomButton from "@/components/UI/Button";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/UI/Logo";
import toast from "react-hot-toast";
import customFetch from "../utils/customFetch";
import axios from "axios";
import { MdErrorOutline } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";

function SignIn() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setEmailError(errors.email);
    setPasswordError(errors.password);
    return isValid;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
  };

  const handleFormSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await customFetch.post("/auth/login", {
        email,
        password,
      });

      if (response.data) {
        toast.success("Login successful!");

        // Delay navigation to show toast
        setTimeout(() => {
          // Navigate based on user role
          switch (response.data.user.role) {
            case "admin":
              navigate("/");
              break;
            case "organizer":
              navigate("/organizer-dashboard");
              break;
            case "user":
              navigate("/");
              break;
            default:
              navigate("/"); // Default fallback
          }
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.msg || "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex lg:flex-row flex-col min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Image Section - Left Side */}
      <div className="lg:w-1/2 lg:block hidden relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
        <img
          src={hero}
          alt="Medical Background"
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-lg opacity-90">Access your medical records and appointments</p>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-8 lg:mb-12">
          <Logo className="w-[112px] h-[54px]" />
        </div>

        {/* Sign In Container */}
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Email Input Group */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none ${
                  touched.email && emailError
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
              />
              {touched.email && emailError && (
                <MdErrorOutline className="absolute right-4 top-3.5 text-red-500 text-xl" />
              )}
            </div>
            {touched.email && emailError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {emailError}
              </p>
            )}
          </div>

          {/* Password Input Group */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Password
            </label>
            <div className="relative group">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 text-base font-medium placeholder-gray-400 bg-white border-2 rounded-lg transition-all duration-300 focus:outline-none pr-12 ${
                  touched.password && passwordError
                    ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 group-hover:border-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {passwordVisible ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
            {touched.password && passwordError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <MdErrorOutline size={16} />
                {passwordError}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-8">
            <Link
              to="/forgot-password"
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleFormSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm font-medium mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Sign Up
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

export default SignIn;
