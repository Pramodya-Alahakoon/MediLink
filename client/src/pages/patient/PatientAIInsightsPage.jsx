import { useMemo, useState } from "react";
import { patientApi } from "@/patient/services/patientApi";
import { useAsyncData } from "@/patient/hooks/useAsyncData";
import InfoCard from "@/patient/components/ui/InfoCard";
import SectionCard from "@/patient/components/ui/SectionCard";
import LoadingState from "@/patient/components/ui/LoadingState";
import ErrorState from "@/patient/components/ui/ErrorState";
import EmptyState from "@/patient/components/ui/EmptyState";
import DataTable from "@/patient/components/ui/DataTable";
import StatusBadge from "@/patient/components/ui/StatusBadge";
import ModalCard from "@/patient/components/ui/ModalCard";
import { usePatientAuth } from "@/patient/context/PatientAuthContext";
import { Brain, HeartPulse, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PatientAIInsightsPage() {
  const { patientId, isLoadingAuth, authError } = usePatientAuth();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({ title: "", summary: "", status: "active" });

  const { data, isLoading, error, refetch } = useAsyncData(async () => {
    if (!patientId) return [];
    const response = await patientApi.getMedicalHistory(patientId);
    return response?.data || response || [];
  }, [patientId]);

  const insights = useMemo(
    () =>
      data.map((item) => ({
        _id: item._id,
        title: item.condition || item.title || "Clinical insight",
        summary: item.notes || item.summary || "No notes available",
        status: item.status || "active",
        severity: item.severity || "moderate",
      })),
    [data]
  );

  const onCreate = async (event) => {
    event.preventDefault();
    if (!patientId) {
      toast.error("Patient session not found. Please sign in again.");
      return;
    }

    try {
      await patientApi.createMedicalHistory({
        patientId,
        condition: newRecord.title,
        notes: newRecord.summary,
        status: newRecord.status,
      });
      setNewRecord({ title: "", summary: "", status: "active" });
      toast.success("Insight record added.");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add insight record.");
    }
  };

  const onUpdateStatus = async (record, status) => {
    try {
      await patientApi.updateMedicalHistory(record._id, {
        condition: record.title,
        notes: record.summary,
        status,
      });
      toast.success("Insight updated.");
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update insight.");
    }
  };

  const onDelete = async (record) => {
    try {
      await patientApi.deleteMedicalHistory(record._id);
      toast.success("Insight deleted.");
      setSelectedRecord(null);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete insight.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={Brain} title="AI Insights" value={insights.length} hint="Model-assisted recommendations" />
        <InfoCard
          icon={HeartPulse}
          title="Critical Signals"
          value={insights.filter((entry) => entry.severity === "high").length}
          hint="Require priority follow-up"
        />
        <InfoCard icon={ShieldCheck} title="Data Security" value="HIPAA" hint="Protected records" />
      </div>

      <SectionCard title="Assessment Progress" subtitle="AI findings from your reported symptoms and records">
        {isLoadingAuth ? <LoadingState label="Loading patient session..." /> : null}
        {!isLoadingAuth && authError ? <ErrorState message={authError} /> : null}
        {isLoading ? <LoadingState label="Analyzing health records..." /> : null}
        {!isLoading && error ? <ErrorState message={error} onRetry={refetch} /> : null}
        {!isLoadingAuth && !authError && !isLoading && !error && !insights.length ? (
          <EmptyState title="No insights found" description="Create your first insight record to begin tracking." />
        ) : null}
        {!isLoadingAuth && !authError && !isLoading && !error && insights.length ? (
          <DataTable
            columns={[
              { key: "title", label: "Symptom / Condition" },
              { key: "summary", label: "Summary" },
              { key: "severity", label: "Severity" },
              { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            ]}
            rows={insights}
            renderActions={(row) => (
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700"
                onClick={() => setSelectedRecord(row)}
              >
                View
              </button>
            )}
          />
        ) : null}
      </SectionCard>

      <SectionCard title="Add Insight Record">
        <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-3">
          <input
            value={newRecord.title}
            onChange={(e) => setNewRecord((prev) => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Condition / symptom"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
          />
          <input
            value={newRecord.summary}
            onChange={(e) => setNewRecord((prev) => ({ ...prev, summary: e.target.value }))}
            required
            placeholder="Clinical note"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
          />
          <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
            Save Insight
          </button>
        </form>
      </SectionCard>

      <ModalCard isOpen={Boolean(selectedRecord)} title="Insight Details" onClose={() => setSelectedRecord(null)}>
        {selectedRecord ? (
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Condition:</span> {selectedRecord.title}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Summary:</span> {selectedRecord.summary}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Severity:</span> {selectedRecord.severity}
            </p>
            <StatusBadge value={selectedRecord.status} />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(selectedRecord, "resolved")}
                className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-800"
              >
                Mark Resolved
              </button>
              <button
                type="button"
                onClick={() => onDelete(selectedRecord)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ) : null}
      </ModalCard>
    </div>
  );
}
