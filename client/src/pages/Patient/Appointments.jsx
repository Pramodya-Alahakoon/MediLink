import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { patientApi } from "../../patient/services/patientApi";
import customFetch from "../../utils/customFetch";
import toast from "react-hot-toast";
import {
  Calendar,
  Search,
  MapPin,
  Users,
  Clock,
  Stethoscope,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { format } from "date-fns";

const PatientAppointments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    symptoms: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rating state
  const [ratingModal, setRatingModal] = useState(null); // appointment object or null
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [reviewedAppointments, setReviewedAppointments] = useState({}); // { appointmentId: true }

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  // Auto-refresh every 15s so doctor confirmations appear in real time
  useEffect(() => {
    const interval = setInterval(loadAppointments, 15000);
    return () => clearInterval(interval);
  }, []);

  // Check which completed appointments already have reviews
  useEffect(() => {
    const completedApts = appointments.filter((a) => a.status === "Completed");
    if (completedApts.length === 0) return;
    const checkAll = async () => {
      const results = {};
      await Promise.all(
        completedApts.map(async (apt) => {
          try {
            const { data } = await customFetch.get(
              `/api/doctors/reviews/check/${apt._id}`,
            );
            if (data.exists) results[apt._id] = true;
          } catch {
            // ignore — treat as not reviewed
          }
        }),
      );
      setReviewedAppointments((prev) => ({ ...prev, ...results }));
    };
    checkAll();
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getMyAppointments();
      setAppointments(response.appointments || response.data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await patientApi.getDoctors();
      setDoctors(response.doctors || response.data || []);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      if (
        !bookingForm.doctorId ||
        !bookingForm.appointmentDate ||
        !bookingForm.appointmentTime ||
        !bookingForm.symptoms
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const appointmentDateTime = new Date(
        `${bookingForm.appointmentDate}T${bookingForm.appointmentTime}`,
      );

      const response = await patientApi.bookAppointment({
        doctorId: bookingForm.doctorId,
        appointmentDate: appointmentDateTime,
        symptoms: bookingForm.symptoms,
        patientId: user.id,
        patientEmail: user.email || "",
      });

      if (response.success || response.appointment) {
        toast.success("Appointment booked successfully!");
        setShowBookingModal(false);
        setBookingForm({
          doctorId: "",
          appointmentDate: "",
          appointmentTime: "",
          symptoms: "",
        });
        await loadAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await patientApi.cancelAppointment(appointmentId);
      toast.success("Appointment cancelled");
      await loadAppointments();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const openRatingModal = (appointment) => {
    setRatingModal(appointment);
    setRatingValue(0);
    setRatingHover(0);
    setRatingComment("");
  };

  const handleSubmitRating = async () => {
    if (!ratingValue) {
      toast.error("Please select a star rating");
      return;
    }
    try {
      setRatingSubmitting(true);
      await customFetch.post("/api/doctors/reviews", {
        doctorId: ratingModal.doctorId,
        appointmentId: ratingModal._id,
        rating: ratingValue,
        comment: ratingComment.trim() || undefined,
        patientName: user?.name || "Patient",
      });
      toast.success("Thank you for your review!");
      setReviewedAppointments((prev) => ({ ...prev, [ratingModal._id]: true }));
      setRatingModal(null);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    let filtered = appointments;

    if (activeTab === "upcoming") {
      filtered = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > now && apt.status !== "Cancelled";
      });
    } else if (activeTab === "past") {
      filtered = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return (
          (aptDate <= now || apt.status === "Completed") &&
          apt.status !== "Cancelled"
        );
      });
    } else if (activeTab === "cancelled") {
      filtered = appointments.filter((apt) => apt.status === "Cancelled");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.specialization?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#055153]"></div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-[#F8FAFB] dark:bg-slate-950 transition-colors duration-300">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-1">
          {[
            { id: "upcoming", label: "Upcoming" },
            { id: "past", label: "Past" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#055153] text-white shadow-lg shadow-teal-900/10"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#055153] focus:border-transparent outline-none w-full sm:w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold mb-1 text-slate-500 dark:text-slate-400">
            No appointments
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {activeTab === "upcoming"
              ? "Book your first appointment to get started."
              : `No ${activeTab} appointments.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 hover:border-[#055153]/20 dark:hover:border-teal-400/20 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-[#112429] dark:text-white">
                    {appointment.doctorName || "Dr. Unknown"}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-[#055153]" />
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {appointment.specialization ||
                          appointment.recommendedSpecialty ||
                          "General"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#0E8A7F]" />
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {format(
                          new Date(appointment.appointmentDate),
                          "MMM dd, yyyy",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-500" />
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {format(
                          new Date(appointment.appointmentDate),
                          "hh:mm a",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              {appointment.symptoms && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl mb-4 border border-slate-100 dark:border-slate-700/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">
                      Symptoms/Reason:
                    </strong>{" "}
                    {appointment.symptoms}
                  </p>
                </div>
              )}

              {activeTab === "upcoming" && appointment.status === "Pending" && (
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-xs transition mt-1"
                >
                  Cancel Appointment
                </button>
              )}

              {appointment.status === "Completed" && (
                <div className="mt-2">
                  {reviewedAppointments[appointment._id] ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl">
                      <CheckCircle size={14} /> Review Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => openRatingModal(appointment)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      <Star size={14} /> Rate Doctor
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-transparent dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold mb-6 text-[#112429] dark:text-white">
              Book Appointment
            </h2>

            <form onSubmit={handleBookAppointment} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2 text-slate-500 dark:text-slate-400">
                  Select Doctor *
                </label>
                <select
                  value={bookingForm.doctorId}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, doctorId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#055153] outline-none font-medium text-slate-800 dark:text-slate-200"
                  required
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} - {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2 text-slate-500 dark:text-slate-400">
                  Date *
                </label>
                <input
                  type="date"
                  value={bookingForm.appointmentDate}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      appointmentDate: e.target.value,
                    })
                  }
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#055153] outline-none font-medium text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2 text-slate-500 dark:text-slate-400">
                  Time *
                </label>
                <input
                  type="time"
                  value={bookingForm.appointmentTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#055153] outline-none font-medium text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase mb-2 text-slate-500 dark:text-slate-400">
                  Symptoms / Reason *
                </label>
                <textarea
                  value={bookingForm.symptoms}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, symptoms: e.target.value })
                  }
                  placeholder="Describe your symptoms or reason for the appointment..."
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#055153] outline-none font-medium resize-none placeholder:text-gray-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-sm text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#055153] hover:bg-[#044143] text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-all shadow-lg shadow-teal-900/10"
                >
                  {isSubmitting ? "Booking..." : "Book Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setRatingModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-transparent dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold mb-1 text-[#112429] dark:text-white">
              Rate Your Experience
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              How was your consultation with{" "}
              <span className="font-semibold text-[#055153] dark:text-teal-400">
                {ratingModal.doctorName || "the doctor"}
              </span>
              ?
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  onMouseEnter={() => setRatingHover(star)}
                  onMouseLeave={() => setRatingHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      star <= (ratingHover || ratingValue)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }
                  />
                </button>
              ))}
            </div>
            {ratingValue > 0 && (
              <p className="text-center text-sm font-semibold mb-4 text-slate-600 dark:text-slate-300">
                {
                  ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                    ratingValue
                  ]
                }
              </p>
            )}

            {/* Comment */}
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows="3"
              maxLength={500}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#055153] outline-none font-medium resize-none placeholder:text-gray-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200 mb-6"
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setRatingModal(null)}
                className="px-5 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-sm text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={ratingSubmitting || !ratingValue}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Star size={14} />
                {ratingSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
