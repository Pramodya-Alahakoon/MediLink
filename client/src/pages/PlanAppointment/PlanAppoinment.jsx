import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import customFetch from "../../utils/customFetch";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiUser, FiStar, FiArrowRight, FiPhone } from "react-icons/fi";

function PlanAppointment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    contactPhone: "",
    specialization: "",
    doctorId: "",
    appointmentDate: "",
    symptoms: "",
  });

  // Data State
  const [currentUser, setCurrentUser] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointmentResponse, setAppointmentResponse] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch specializations and current user
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [userResponse, doctorsResponse] = await Promise.all([
        customFetch.get("/users/current-user"),
        customFetch.get("/api/doctors"),
      ]);

      setCurrentUser(userResponse.data.user);
      
      // Set pre-filled name from user
      setFormData((prev) => ({
        ...prev,
        patientName: userResponse.data.user.name || "",
      }));

      // Extract unique specializations from doctors
      const doctorList = doctorsResponse.data.doctors || [];
      setDoctors(doctorList);
      
      const uniqueSpecializations = [...new Set(doctorList.map((doc) => doc.specialization))];
      setSpecializations(uniqueSpecializations);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Failed to load appointment data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors when specialization changes
  useEffect(() => {
    if (formData.specialization) {
      const filtered = doctors.filter(
        (doc) => doc.specialization === formData.specialization
      );
      setFilteredDoctors(filtered);
      setFormData((prev) => ({ ...prev, doctorId: "" })); // Reset doctor selection
    }
  }, [formData.specialization, doctors]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user edits
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: {
        // Name validation
        if (!formData.patientName.trim()) {
          newErrors.patientName = "Patient name is required";
        } else if (formData.patientName.trim().length < 3) {
          newErrors.patientName = "Patient name must be at least 3 characters";
        }

        // Phone validation
        if (!formData.contactPhone.trim()) {
          newErrors.contactPhone = "Contact phone is required";
        } else if (!/^[0-9]{10}$/.test(formData.contactPhone)) {
          newErrors.contactPhone = "Phone number must be exactly 10 digits";
        }
        break;
      }

      case 2: {
        if (!formData.specialization) {
          newErrors.specialization = "Please select a specialization";
        }
        break;
      }

      case 3: {
        if (!formData.doctorId) {
          newErrors.doctorId = "Please select a doctor";
        }
        break;
      }

      case 4: {
        if (!formData.appointmentDate) {
          newErrors.appointmentDate = "Please select an appointment date";
        } else {
          const selectedDate = new Date(formData.appointmentDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.appointmentDate = "Appointment date cannot be in the past";
          }
        }
        break;
      }

      case 5: {
        if (!formData.symptoms.trim()) {
          newErrors.symptoms = "Please describe your symptoms";
        } else if (formData.symptoms.trim().length < 10) {
          newErrors.symptoms = "Symptoms description must be at least 10 characters";
        }
        break;
      }

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    try {
      // Find selected doctor details
      const selectedDoctor = doctors.find((doc) => doc._id === formData.doctorId);

      // Format date and time for appointment
      const appointmentDateTime = new Date(formData.appointmentDate);

      const appointmentData = {
        patientId: currentUser._id,
        patientName: formData.patientName,
        contactPhone: formData.contactPhone,
        specialization: formData.specialization,
        doctorId: formData.doctorId,
        appointmentDate: appointmentDateTime.toISOString(),
        symptoms: formData.symptoms,
      };

      console.log("Submitting appointment data:", appointmentData);

      const response = await customFetch.post("/api/appointments", appointmentData);

      setAppointmentResponse(response.data);
      toast.success("Appointment booked successfully!");

      // Move to summary step
      setCurrentStep(6);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Failed to book appointment";
      toast.error(errorMessage);
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    return (currentStep / 6) * 100;
  };

  // Check if can proceed
  const canProceed = () => {
    return validateStep(currentStep);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Personal Information
            </h2>

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  errors.patientName
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-slate-600 focus:border-blue-600"
                } dark:bg-slate-700 dark:text-white`}
              />
              {errors.patientName && (
                <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <FiPhone className="text-blue-600" />
                  Contact Phone Number *
                </div>
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                maxLength="10"
                pattern="\d{10}"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  errors.contactPhone
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-slate-600 focus:border-blue-600"
                } dark:bg-slate-700 dark:text-white`}
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Select Specialization</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Medical Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  errors.specialization
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-slate-600 focus:border-blue-600"
                } dark:bg-slate-700 dark:text-white`}
              >
                <option value="">Choose a specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
              )}
            </div>

            {formData.specialization && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Found <span className="font-semibold">{filteredDoctors.length}</span> doctor(s) in{" "}
                  <span className="font-semibold">{formData.specialization}</span>
                </p>
              </motion.div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Select Doctor</h2>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No doctors available in this specialization
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDoctors.map((doctor) => (
                  <motion.button
                    key={doctor._id}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "doctorId", value: doctor._id },
                      })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.doctorId === doctor._id
                        ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                        : "border-gray-200 dark:border-slate-600 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {doctor.specialization}
                        </p>
                        {doctor.experienceYears && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Experience: {doctor.experienceYears} years
                          </p>
                        )}
                      </div>
                      {doctor.rating && (
                        <div className="flex items-center gap-1 ml-4">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {doctor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {formData.doctorId === doctor._id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 ml-4 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {errors.doctorId && (
              <p className="text-red-500 text-sm">{errors.doctorId}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FiCalendar className="text-blue-600" />
              Choose Appointment Date
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  errors.appointmentDate
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-slate-600 focus:border-blue-600"
                } dark:bg-slate-700 dark:text-white`}
              />
              {errors.appointmentDate && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
              )}
            </div>

            {formData.appointmentDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Appointment scheduled for{" "}
                  <span className="font-semibold">
                    {new Date(formData.appointmentDate).toLocaleDateString()}
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Describe Your Symptoms</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Symptoms *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Describe your symptoms or reason for visit (minimum 10 characters)"
                rows="5"
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none ${
                  errors.symptoms
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 dark:border-slate-600 focus:border-blue-600"
                } dark:bg-slate-700 dark:text-white`}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {formData.symptoms.length} characters
                </p>
                {errors.symptoms && (
                  <p className="text-red-500 text-sm">{errors.symptoms}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return renderSummary();

      default:
        return null;
    }
  };

  // Render summary
  const renderSummary = () => {
    const selectedDoctor = doctors.find((doc) => doc._id === formData.doctorId);

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your appointment has been successfully booked
          </p>
        </motion.div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Doctor
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                Dr. {selectedDoctor?.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedDoctor?.specialization}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Date
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {new Date(formData.appointmentDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Patient Name
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formData.patientName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Contact
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formData.contactPhone}
              </p>
            </div>
          </div>

          {appointmentResponse?.appointment?.preMedicationSteps &&
            appointmentResponse.appointment.preMedicationSteps.length > 0 && (
              <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Pre-Medication Steps:
                </h3>
                <ul className="space-y-2">
                  {appointmentResponse.appointment.preMedicationSteps.map(
                    (step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="font-semibold text-blue-600 min-w-max">
                          {index + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {appointmentResponse?.appointment?.urgencyLevel && (
            <div className="border-t dark:border-slate-600 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Urgency Level
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    appointmentResponse.appointment.urgencyLevel === "high"
                      ? "bg-red-100 text-red-800"
                      : appointmentResponse.appointment.urgencyLevel === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {appointmentResponse.appointment.urgencyLevel.charAt(0).toUpperCase() +
                    appointmentResponse.appointment.urgencyLevel.slice(1)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-16">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Quick and easy appointment scheduling
          </p>
        </motion.div>

        {/* Progress Bar */}
        {currentStep < 6 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                Step {currentStep} of 5
              </span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {calculateProgress().toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-600 to-blue-700"
              />
            </div>
          </div>
        )}

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6"
        >
          {isLoading && currentStep < 6 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderStepContent()
          )}
        </motion.div>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between gap-4">
            {currentStep > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePreviousStep}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </motion.button>
            )}

            {currentStep < 5 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextStep}
                disabled={!canProceed() || isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                Next
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    Booking...
                  </>
                ) : (
                  <>
                    Book Appointment
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}

        {/* Success Navigation */}
        {currentStep === 6 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/"}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300"
          >
            Return to Home
          </motion.button>
        )}
      </div>
    </section>
  );
}

export default PlanAppointment;
