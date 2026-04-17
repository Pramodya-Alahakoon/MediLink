import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { patientApi } from "../../patient/services/patientApi";
import toast from "react-hot-toast";
import { Pill, Calendar, User, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";

const PatientPrescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleDownloadPDF = (prescription) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const img = new window.Image();
      img.src = "/favicon.png";

      img.onload = () => {
        // Add Header Logo & Title
        doc.addImage(img, "PNG", 14, 15, 16, 16);
        doc.setFontSize(22);
        doc.setTextColor(5, 81, 83); // #055153
        doc.text("MediLink", 34, 23);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Patient Portal | Prescription", 34, 28);

        // Add divider line
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 38, 196, 38);

        // Prescription Info
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59);
        doc.text(`Dr. ${prescription.doctorName || "Unknown"}`, 14, 52);

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        if (prescription.specialization) {
          doc.text(`Specialization: ${prescription.specialization}`, 14, 60);
        }

        doc.text(
          `Issued: ${format(new Date(prescription.date), "MMM dd, yyyy")}`,
          130,
          52,
        );
        if (prescription.expiryDate) {
          doc.text(
            `Expires: ${format(new Date(prescription.expiryDate), "MMM dd, yyyy")}`,
            130,
            60,
          );
        }

        // Medicines Section
        doc.setFillColor(248, 250, 251);
        doc.rect(14, 75, 182, 10, "F");
        doc.setFontSize(13);
        doc.setTextColor(5, 81, 83);
        doc.text("Prescribed Medicines", 18, 82);

        let yPos = 95;

        prescription.medicines?.forEach((med, idx) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setTextColor(30, 41, 59);
          doc.setFont(undefined, "bold");
          doc.text(
            `${idx + 1}. ${med.name} ${med.dosage ? `- ${med.dosage}` : ""}`,
            14,
            yPos,
          );

          yPos += 6;
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.setFont(undefined, "normal");

          const freqText = med.frequency ? `Frequency: ${med.frequency}` : "";
          let durText = med.duration ? `Duration: ${med.duration}` : "";
          if (med.duration && !isNaN(med.duration)) durText += " days";

          doc.text(
            `${freqText}${freqText && durText ? "   |   " : ""}${durText}`,
            20,
            yPos,
          );

          if (med.instructions) {
            yPos += 6;
            doc.setTextColor(15, 23, 42); // darker for emphasis
            doc.text(`Instructions: ${med.instructions}`, 20, yPos);
          }
          yPos += 12;
        });

        // Doctor's Notes Section
        if (prescription.notes) {
          if (yPos > 240) {
            doc.addPage();
            yPos = 20;
          } else {
            yPos += 10;
          }

          doc.setFillColor(239, 246, 255); // bg-blue-50
          doc.rect(14, yPos, 182, 40, "F");

          doc.setFontSize(12);
          doc.setTextColor(5, 81, 83);
          doc.setFont(undefined, "bold");
          doc.text("Doctor's Notes", 20, yPos + 10);

          doc.setFontSize(11);
          doc.setTextColor(51, 65, 85);
          doc.setFont(undefined, "normal");
          const splitNotes = doc.splitTextToSize(prescription.notes, 170);
          doc.text(splitNotes, 20, yPos + 20);
        }

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text("Generated securely from MediLink Platform", 70, 285);

        doc.save(
          `Prescription_${prescription.doctorName || "Doctor"}_${format(new Date(prescription.date), "yyyy-MM-dd")}.pdf`,
        );
        toast.success("PDF Downloaded successfully!");
      };

      img.onerror = () => {
        toast.error("Failed to load logo for PDF.");
      };
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, [user?.userId]);

  useEffect(() => {
    filterPrescriptions();
  }, [prescriptions, activeTab, searchTerm]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const patientId = user?.userId;
      if (patientId) {
        const response = await patientApi.getPrescriptions(patientId);
        const presc = response.data || response.prescriptions || [];
        setPrescriptions(Array.isArray(presc) ? presc : []);
      }
    } catch (error) {
      console.error("Failed to load prescriptions:", error);
      toast.error("Failed to load prescriptions");
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    let filtered = prescriptions;

    // Filter by status (active/expired)
    if (activeTab === "active") {
      filtered = filtered.filter((p) => {
        if (!p.expiryDate) return true;
        return new Date(p.expiryDate) > new Date();
      });
    } else if (activeTab === "expired") {
      filtered = filtered.filter((p) => {
        if (!p.expiryDate) return false;
        return new Date(p.expiryDate) <= new Date();
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.medicines?.some((m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          p.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredPrescriptions(filtered);
  };

  const getStatusColor = (expiryDate) => {
    if (!expiryDate)
      return "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50";
    const isExpired = new Date(expiryDate) <= new Date();
    return isExpired
      ? "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50"
      : "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50";
  };

  const getStatusText = (expiryDate) => {
    if (!expiryDate) return "Active";
    const isExpired = new Date(expiryDate) <= new Date();
    return isExpired ? "Expired" : "Active";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-[#F8FAFB] dark:bg-[#0f1523] min-h-screen transition-colors duration-300">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-[#1e293b] dark:text-slate-100 mb-8 drop-shadow-sm">
        My Prescriptions
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-slate-800">
        {[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "expired", label: "Expired" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#055153] text-[#055153] dark:border-teal-400 dark:text-teal-400 bg-[#055153]/5 dark:bg-teal-400/10 rounded-t-lg"
                : "border-transparent text-gray-500 dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-slate-200 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 rounded-t-lg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by medicine name, doctor, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3.5 border border-gray-200 dark:border-slate-700/80 rounded-xl bg-white dark:bg-[#151c2c] text-[#1e293b] dark:text-slate-200 focus:ring-2 focus:ring-[#055153]/50 focus:border-[#055153] dark:focus:ring-teal-500/30 dark:focus:border-teal-500 outline-none dark:placeholder:text-slate-500 shadow-sm transition-all"
        />
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm text-center">
          <div className="p-5 bg-gray-50 dark:bg-slate-800 rounded-full mb-4">
            <Pill size={48} className="text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-slate-300 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-500 dark:text-slate-500 max-w-sm">
            {prescriptions.length === 0
              ? "Your prescriptions will appear here once your doctor issues them."
              : "No prescriptions match your search criteria. Try a different keyword."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-transparent dark:border-slate-800 hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-300 p-6 md:p-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-1">
                      {prescription.doctorName || "Dr. Unknown"}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={14}
                          className="text-blue-500/70 dark:text-blue-400/70"
                        />
                        <span>
                          Issued:{" "}
                          {format(new Date(prescription.date), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {prescription.expiryDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            size={14}
                            className="text-orange-500/70 dark:text-orange-400/70"
                          />
                          <span>
                            Expires:{" "}
                            {format(
                              new Date(prescription.expiryDate),
                              "MMM dd, yyyy",
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${getStatusColor(prescription.expiryDate)}`}
                >
                  {getStatusText(prescription.expiryDate)}
                </span>
              </div>

              {/* Medicines List */}
              <div className="bg-gray-50 dark:bg-slate-800/40 rounded-xl p-5 mb-6 border border-gray-100 dark:border-slate-800/60">
                <h4 className="font-bold text-[#1e293b] dark:text-slate-200 mb-4 flex items-center gap-2">
                  <Pill
                    size={18}
                    className="text-blue-500 dark:text-teal-400"
                  />
                  Medicines Preview
                </h4>
                <div className="space-y-3">
                  {prescription.medicines?.map((medicine, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900/80 p-4 rounded-lg border border-gray-200 dark:border-slate-700/80 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                        <div>
                          <h5 className="font-bold text-[#1e293b] dark:text-teal-400 text-lg">
                            {medicine.name}
                          </h5>
                          <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                            {medicine.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:flex gap-4 md:gap-8 text-sm text-gray-600 dark:text-slate-300">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500">
                            Frequency
                          </span>
                          <span className="font-medium text-gray-700 dark:text-slate-200">
                            {medicine.frequency}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500">
                            Duration
                          </span>
                          <span className="font-medium text-gray-700 dark:text-slate-200">
                            {medicine.duration}
                          </span>
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-3 bg-gray-50 dark:bg-slate-800 p-2.5 rounded-md border-l-2 border-gray-300 dark:border-slate-600">
                          <p className="text-sm text-gray-600 dark:text-slate-300 font-medium">
                            <span className="text-gray-400 dark:text-slate-500 text-xs uppercase font-bold mr-2">
                              Guide:
                            </span>
                            {medicine.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {prescription.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-4 rounded">
                  <h4 className="font-semibold text-[#1e293b] dark:text-blue-100 mb-2">
                    Notes from Doctor
                  </h4>
                  <p className="text-[#334155] dark:text-blue-50">
                    {prescription.notes}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedPrescription(prescription)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => handleDownloadPDF(prescription)}
                  className="flex items-center gap-2 text-green-600 dark:text-teal-400 hover:text-green-700 dark:hover:text-teal-300 font-semibold text-sm transition"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-extrabold text-[#055153] dark:text-teal-400 mb-6 drop-shadow-sm">
              Prescription Details
            </h2>

            {/* Doctor Info */}
            <div className="bg-gradient-to-r from-blue-50/80 to-teal-50/80 dark:from-slate-800 dark:to-slate-800/80 border border-transparent dark:border-slate-700 p-6 rounded-xl mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm text-blue-500 dark:text-teal-400">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#1e293b] dark:text-white">
                    Dr. {selectedPrescription.doctorName}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 font-medium">
                    {selectedPrescription.specialization ||
                      "Medical Practitioner"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500 dark:text-slate-400 mb-1">
                    Issued Date
                  </p>
                  <p className="font-semibold text-[#1e293b] dark:text-slate-200 text-base">
                    {format(
                      new Date(selectedPrescription.date),
                      "MMMM dd, yyyy",
                    )}
                  </p>
                </div>
                {selectedPrescription.expiryDate && (
                  <div>
                    <p className="text-gray-500 dark:text-slate-400 mb-1">
                      Expiry Date
                    </p>
                    <p className="font-semibold text-[#1e293b] dark:text-slate-200 text-base">
                      {format(
                        new Date(selectedPrescription.expiryDate),
                        "MMMM dd, yyyy",
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Medicines */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-5 flex items-center gap-3 border-b dark:border-slate-800 pb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Pill size={20} />
                </div>
                Prescribed Medicines
              </h3>
              <div className="space-y-4">
                {selectedPrescription.medicines?.map((medicine, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-bold text-lg text-[#1e293b] dark:text-teal-400 mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">
                      {medicine.name}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-[#334155] dark:text-slate-300">
                      <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                          Dosage
                        </p>
                        <p className="font-medium text-sm">{medicine.dosage}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                          Frequency
                        </p>
                        <p className="font-medium text-sm">
                          {medicine.frequency}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                          Duration
                        </p>
                        <p className="font-medium text-sm">
                          {medicine.duration}
                        </p>
                      </div>
                    </div>
                    {medicine.instructions && (
                      <div className="mt-4 p-3 bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200/90 font-medium">
                          <span className="font-bold mr-1">Instructions:</span>
                          {medicine.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            {selectedPrescription.notes && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-6 rounded">
                <h3 className="font-bold text-[#1e293b] dark:text-blue-100 mb-2">
                  Doctor's Notes
                </h3>
                <p className="text-[#334155] dark:text-blue-50">
                  {selectedPrescription.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setSelectedPrescription(null)}
                className="w-full sm:flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedPrescription)}
                className="w-full sm:flex-1 px-6 py-3 bg-[#055153] dark:bg-teal-600 text-white rounded-lg hover:bg-[#044042] dark:hover:bg-teal-500 transition font-semibold flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
