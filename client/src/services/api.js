import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient APIs
export const patientAPI = {
  getPatient: (id) => apiClient.get(`/patients/${id}`),
  getAllPatients: () => apiClient.get('/patients'),
  createPatient: (data) => apiClient.post('/patients', data),
  updatePatient: (id, data) => apiClient.put(`/patients/${id}`, data),
  deletePatient: (id) => apiClient.delete(`/patients/${id}`),
};

// Medical History APIs
export const medicalHistoryAPI = {
  getMedicalHistory: (patientId) =>
    apiClient.get(`/medical-history/history/${patientId}`),
  addMedicalHistory: (data) =>
    apiClient.post('/medical-history/history', data),
  updateMedicalHistory: (id, data) =>
    apiClient.put(`/medical-history/history/${id}`, data),
  deleteMedicalHistory: (id) =>
    apiClient.delete(`/medical-history/history/${id}`),
};

// Prescription APIs
export const prescriptionAPI = {
  getPrescriptions: (patientId) =>
    apiClient.get(`/prescriptions/patient/${patientId}`),
  getActivePrescriptions: (patientId) =>
    apiClient.get(`/prescriptions/patient/${patientId}/active`),
  getPrescriptionById: (id) =>
    apiClient.get(`/prescriptions/${id}`),
  addPrescription: (data) =>
    apiClient.post('/prescriptions', data),
  updatePrescription: (id, data) =>
    apiClient.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) =>
    apiClient.delete(`/prescriptions/${id}`),
};

// Report APIs
export const reportAPI = {
  getPatientReports: (patientId) =>
    apiClient.get(`/reports/patient/${patientId}`),
  getReportById: (id) =>
    apiClient.get(`/reports/${id}`),
  uploadReport: (patientId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/reports/upload/${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteReport: (id) =>
    apiClient.delete(`/reports/${id}`),
  updateReport: (id, data) =>
    apiClient.put(`/reports/${id}`, data),
};

// Video Consultation APIs
export const videoConsultationAPI = {
  getVideoConsultationLink: (appointmentId) =>
    apiClient.get(`/video-consultation/${appointmentId}`),
  updateVideoConsultationLink: (appointmentId, data) =>
    apiClient.put(`/video-consultation/${appointmentId}`, data),
};

export default apiClient;
