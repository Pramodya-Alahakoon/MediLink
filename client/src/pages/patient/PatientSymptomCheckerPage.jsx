import { useMemo, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { patientApi } from "@/patient/services/patientApi";
import { useAsyncData } from "@/patient/hooks/useAsyncData";
import LoadingState from "@/patient/components/ui/LoadingState";
import ErrorState from "@/patient/components/ui/ErrorState";
import SectionCard from "@/patient/components/ui/SectionCard";
import InfoCard from "@/patient/components/ui/InfoCard";
import { usePatientAuth } from "@/patient/context/PatientAuthContext";
import { Activity, AlertCircle, Brain } from "lucide-react";

const quickSymptoms = ["Fever", "Fatigue", "Sore Throat", "Nausea", "Headache"];

export default function PatientSymptomCheckerPage() {
  const { patientId, isLoadingAuth, authError } = usePatientAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "assistant", text: "Describe your symptoms and I will suggest likely clinical directions." },
  ]);

  const { data: historyData, isLoading, error } = useAsyncData(async () => {
    if (!patientId) return [];
    const response = await patientApi.getMedicalHistory(patientId);
    return response?.data || response || [];
  }, [patientId]);

  const stats = useMemo(() => {
    return {
      entries: historyData.length,
      active: historyData.filter((row) => row.status === "active").length,
    };
  }, [historyData]);

  const onSend = (value) => {
    if (!value.trim()) return;
    setChat((prev) => [
      ...prev,
      { role: "user", text: value },
      { role: "assistant", text: "Thanks. I recorded this for clinician review and trend analysis." },
    ]);
    setMessage("");
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={Activity} title="Recent Symptom Logs" value={stats.entries} hint="Last 30 days" />
        <InfoCard icon={AlertCircle} title="Active Conditions" value={stats.active} hint="Need monitoring" />
        <InfoCard icon={Brain} title="AI Confidence" value="85%" hint="Based on available records" />
      </div>

      <SectionCard title="Clinical Assistant" subtitle="AI-supported symptom triage (informational only)">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            {chat.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`mb-2 max-w-2xl rounded-2xl px-4 py-3 text-sm ${
                  item.role === "assistant" ? "bg-white text-slate-700" : "ml-auto bg-teal-700 text-white"
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => onSend(symptom)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-teal-600 hover:text-teal-700"
              >
                {symptom}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={() => onSend(message)}
              className="rounded-full bg-teal-700 p-3 text-white hover:bg-teal-800"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recent History">
        {isLoadingAuth ? <LoadingState label="Loading patient session..." /> : null}
        {!isLoadingAuth && authError ? <ErrorState message={authError} /> : null}
        {isLoading ? <LoadingState label="Loading symptom history..." /> : null}
        {!isLoading && error ? <ErrorState message={error} /> : null}
        {!isLoadingAuth && !authError && !isLoading && !error && !historyData.length ? (
          <p className="text-sm text-slate-500">No medical history entries available yet.</p>
        ) : null}
      </SectionCard>
    </div>
  );
}
