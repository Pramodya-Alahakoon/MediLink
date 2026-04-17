import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Pill,
  Activity,
  Calendar,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import customFetch from "../../utils/customFetch";

// Uses precise schema defined in doctor-service/models/Prescription.js
const DOSAGE_UNITS = [
  "mg",
  "ml",
  "g",
  "mcg",
  "IU",
  "tablet(s)",
  "drop(s)",
  "%",
];

const defaultMedicine = {
  name: "",
  dosageAmount: "",
  dosageUnit: "mg",
  frequency: "",
  duration: "",
  instructions: "",
};

// Combine dosageAmount + dosageUnit into dosage string
const buildDosage = (med) => {
  if (!med.dosageAmount) return "";
  return `${med.dosageAmount}${med.dosageUnit}`;
};

const PrescriptionBuilderModal = ({
  isOpen,
  onClose,
  appointment,
  doctorId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [medicines, setMedicines] = useState([{ ...defaultMedicine }]);

  if (!isOpen || !appointment) return null;

  const handleAddMedicine = () => {
    setMedicines([...medicines, { ...defaultMedicine }]);
  };

  const handleRemoveMedicine = (index) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      return toast.error("Diagnosis is required.");
    }

    // Filter out completely empty medicines
    const filteredMedicines = medicines
      .filter((m) => m.name.trim() !== "")
      .map(({ dosageAmount, dosageUnit, ...rest }) => ({
        ...rest,
        dosage: buildDosage({ dosageAmount, dosageUnit }),
      }));

    const payload = {
      doctorId,
      // Appointment schema handles patientId potentially being populated
      patientId:
        typeof appointment.patientId === "object"
          ? appointment.patientId._id
          : appointment.patientId,
      appointmentId: appointment._id,
      diagnosis,
      medicines: filteredMedicines,
      notes,
      ...(followUpDate && { followUpDate }),
    };

    try {
      setLoading(true);
      const { data } = await customFetch.post("/api/prescriptions", payload);

      if (data.success || data.data) {
        toast.success("Digital Prescription issued successfully!");

        // Auto-complete the appointment implicitly if it was pending
        if (
          appointment.status === "Confirmed" ||
          appointment.status === "Pending"
        ) {
          try {
            await customFetch.put(
              `/api/doctors/appointments/${appointment._id}/complete`,
            );
          } catch (e) {
            /* ignore auto-completion error if endpoint is missing */
          }
        }

        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to issue prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#055153] flex items-center justify-center shrink-0">
              <Pill size={20} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#0D1C2E]">
                Issue E-Prescription
              </h2>
              <p className="text-[13px] font-medium text-slate-500">
                Patient:{" "}
                <span className="font-bold text-slate-700">
                  {appointment.patientName || "Unknown"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <form
            id="prescription-form"
            onSubmit={handleSubmit}
            className="p-6 md:p-8 space-y-8"
          >
            {/* Context / Diagnosis Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#055153]">
                <Activity size={18} />
                <h3 className="font-bold text-[15px]">
                  Clinical Diagnosis & Notes
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                    Primary Diagnosis <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    maxLength={500}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis"
                    className="w-full bg-[#F8FAFB] py-3 text-[14px] px-4 font-medium rounded-xl border border-transparent focus:border-[#055153] focus:bg-white focus:ring-1 focus:ring-[#055153] transition-all outline-none text-[#0D1C2E]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                    Physician Notes (Optional)
                  </label>
                  <textarea
                    maxLength={1000}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any diet restrictions, advice, or observation logs..."
                    className="w-full bg-[#F8FAFB] py-3 text-[14px] px-4 font-medium rounded-xl border border-transparent focus:border-[#055153] focus:bg-white focus:ring-1 focus:ring-[#055153] transition-all outline-none resize-none h-24 text-[#0D1C2E]"
                  ></textarea>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">
                    Follow-up Date (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full bg-[#F8FAFB] py-3 pl-11 pr-4 text-[14px] font-medium rounded-xl border border-transparent focus:border-[#055153] focus:bg-white focus:ring-1 focus:ring-[#055153] transition-all outline-none text-[#0D1C2E] cursor-pointer"
                    />
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medicines Array Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#055153]">
                  <Pill size={18} />
                  <h3 className="font-bold text-[15px]">
                    Prescribed Medicines
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="flex items-center gap-1.5 text-[13px] font-bold text-[#055153] bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((med, index) => (
                  <div
                    key={index}
                    className="relative bg-[#F8FAFB] rounded-2xl p-5 border border-slate-100 group transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                  >
                    {/* Delete row button (only show if more than 1) */}
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 bg-white shadow-sm border border-slate-100 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Name - 4 columns */}
                      <div className="md:col-span-4">
                        <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Medicine Name
                        </label>
                        <input
                          placeholder="e.g. Paracetamol"
                          value={med.name}
                          onChange={(e) =>
                            handleMedicineChange(index, "name", e.target.value)
                          }
                          className="w-full bg-white border border-slate-200 text-[#0D1C2E] px-4 py-2.5 rounded-xl text-[14px] font-medium focus:border-[#055153] outline-none"
                          required={index === 0} // only first medicine absolutely required
                        />
                      </div>

                      {/* Dosage - 3 columns (amount + unit) */}
                      <div className="md:col-span-3">
                        <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Dosage
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            placeholder="e.g. 500"
                            value={med.dosageAmount}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "dosageAmount",
                                e.target.value,
                              )
                            }
                            className="w-[60%] bg-white border border-slate-200 text-[#0D1C2E] px-3 py-2.5 rounded-xl text-[14px] font-medium focus:border-[#055153] outline-none"
                          />
                          <select
                            value={med.dosageUnit}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "dosageUnit",
                                e.target.value,
                              )
                            }
                            className="w-[40%] bg-white border border-slate-200 text-[#0D1C2E] px-2 py-2.5 rounded-xl text-[13px] font-medium focus:border-[#055153] outline-none appearance-none cursor-pointer"
                          >
                            {DOSAGE_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Frequency - 3 columns */}
                      <div className="md:col-span-3">
                        <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Frequency
                        </label>
                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "frequency",
                              e.target.value,
                            )
                          }
                          className="w-full bg-white border border-slate-200 text-[14px] font-medium text-[#0D1C2E] px-4 py-2.5 rounded-xl focus:border-[#055153] outline-none appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="Once daily">Once daily (OD)</option>
                          <option value="Twice daily">Twice daily (BD)</option>
                          <option value="Thrice daily">
                            Thrice daily (TDS)
                          </option>
                          <option value="Four times daily">
                            Four times daily (QDS)
                          </option>
                          <option value="As needed">As needed (PRN)</option>
                        </select>
                      </div>

                      {/* Duration - 2 columns */}
                      <div className="md:col-span-2">
                        <label className="block text-[12px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Duration
                        </label>
                        <input
                          placeholder="e.g. 5 days"
                          value={med.duration}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="w-full bg-white border border-slate-200 text-[#0D1C2E] px-4 py-2.5 rounded-xl text-[14px] font-medium focus:border-[#055153] outline-none"
                        />
                      </div>

                      {/* Instructions - Full Width */}
                      <div className="md:col-span-12">
                        <input
                          placeholder="Specific instructions (e.g. Take after meals, swallow whole)"
                          value={med.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value,
                            )
                          }
                          className="w-full bg-white border border-slate-200 text-[#0D1C2E] px-4 py-2 text-[13px] font-medium rounded-lg focus:border-[#055153] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-[14px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="prescription-form"
            disabled={loading}
            className="px-8 py-2.5 font-bold text-white bg-[#055153] hover:bg-[#044042] rounded-xl transition-colors text-[14px] shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Issue Script
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionBuilderModal;
