import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { CalendarClock, Search, Star } from "lucide-react";
import { patientApi } from "@/patient/services/patientApi";
import { useAsyncData } from "@/patient/hooks/useAsyncData";
import SectionCard from "@/patient/components/ui/SectionCard";
import LoadingState from "@/patient/components/ui/LoadingState";
import ErrorState from "@/patient/components/ui/ErrorState";
import EmptyState from "@/patient/components/ui/EmptyState";
import ModalCard from "@/patient/components/ui/ModalCard";
import { usePatientAuth } from "@/patient/context/PatientAuthContext";

export default function PatientFindDoctorsPage() {
  const { patientId, isLoadingAuth, authError } = usePatientAuth();
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");

  const { data, isLoading, error, refetch } = useAsyncData(async () => {
    const response = await patientApi.getDoctors();
    return response?.doctors || response?.data || response || [];
  }, []);

  const doctors = useMemo(() => {
    return data.filter((doctor) => {
      if (!specialtyFilter) return true;
      const specialty = doctor.specialty || doctor.specialization || "";
      return specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
    });
  }, [data, specialtyFilter]);

  const handleBook = async () => {
    if (!selectedDoctor || !appointmentDate) return;
    if (!patientId) {
      toast.error("Patient session not found. Please sign in again.");
      return;
    }

    try {
      await patientApi.createAppointment({
        patientId,
        doctorId: selectedDoctor._id || selectedDoctor.id,
        dateTime: appointmentDate,
      });
      toast.success("Appointment request sent.");
      setSelectedDoctor(null);
      setAppointmentDate("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not create appointment.");
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Find Doctors" subtitle="Discover specialists based on your medical needs">
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            placeholder="Filter by specialty..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-600"
          />
        </div>
      </SectionCard>

      {isLoading ? <LoadingState label="Loading doctors..." /> : null}
      {isLoadingAuth ? <LoadingState label="Loading patient session..." /> : null}
      {!isLoadingAuth && authError ? <ErrorState message={authError} /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={refetch} /> : null}
      {!isLoading && !error && !doctors.length ? (
        <EmptyState title="No doctors found" description="Try another specialty filter." />
      ) : null}

      {!isLoading && !error && doctors.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <article key={doctor._id || doctor.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Verified Expert</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{doctor.name || "Dr. Specialist"}</h3>
              <p className="text-sm text-slate-500">{doctor.specialty || doctor.specialization || "General"}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <Star size={16} className="text-amber-400" />
                <span>{doctor.rating || "4.8"} / 5.0</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctor(doctor)}
                className="mt-4 w-full rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Book Appointment
              </button>
            </article>
          ))}
        </div>
      ) : null}

      <ModalCard isOpen={Boolean(selectedDoctor)} title="Book Consultation" onClose={() => setSelectedDoctor(null)}>
        {selectedDoctor ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Request consultation with <span className="font-semibold text-slate-900">{selectedDoctor.name}</span>.
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Preferred date and time</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
              />
            </div>
            <button
              type="button"
              onClick={handleBook}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              <CalendarClock size={16} />
              Confirm Booking
            </button>
          </div>
        ) : null}
      </ModalCard>
    </div>
  );
}
