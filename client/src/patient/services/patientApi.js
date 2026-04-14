import customFetch from "@/utils/customFetch";

const ENDPOINTS = {
  patients: (import.meta.env.VITE_API_PATIENTS_BASE_PATH || "/api/patients").replace(/\/$/, ""),
  reports: (import.meta.env.VITE_API_REPORTS_BASE_PATH || "/api/reports").replace(/\/$/, ""),
  history: (import.meta.env.VITE_API_MEDICAL_HISTORY_BASE_PATH || "/history").replace(/\/$/, ""),
  doctors: (import.meta.env.VITE_API_DOCTORS_BASE_PATH || "/api/doctors").replace(/\/$/, ""),
  appointments: (import.meta.env.VITE_API_APPOINTMENTS_BASE_PATH || "/api/appointments").replace(/\/$/, ""),
};

export const patientApi = {
  async getPatientById(patientId) {
    const { data } = await customFetch.get(`${ENDPOINTS.patients}/patients/${patientId}`);
    return data;
  },

  async getReports(patientId) {
    const { data } = await customFetch.get(`${ENDPOINTS.reports}/patient/${patientId}`);
    return data;
  },

  async uploadReport(patientId, formData) {
    const { data } = await customFetch.post(`${ENDPOINTS.reports}/upload/${patientId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async updateReport(reportId, payload) {
    const { data } = await customFetch.put(`${ENDPOINTS.reports}/${reportId}`, payload);
    return data;
  },

  async deleteReport(reportId) {
    const { data } = await customFetch.delete(`${ENDPOINTS.reports}/${reportId}`);
    return data;
  },

  async getMedicalHistory(patientId) {
    const { data } = await customFetch.get(`${ENDPOINTS.history}/${patientId}`);
    return data;
  },

  async createMedicalHistory(payload) {
    const { data } = await customFetch.post(ENDPOINTS.history, payload);
    return data;
  },

  async updateMedicalHistory(historyId, payload) {
    const { data } = await customFetch.put(`${ENDPOINTS.history}/${historyId}`, payload);
    return data;
  },

  async deleteMedicalHistory(historyId) {
    const { data } = await customFetch.delete(`${ENDPOINTS.history}/${historyId}`);
    return data;
  },

  async getDoctors(params = {}) {
    const { data } = await customFetch.get(ENDPOINTS.doctors, { params });
    return data;
  },

  async createAppointment(payload) {
    const { data } = await customFetch.post(ENDPOINTS.appointments, payload);
    return data;
  },
};
