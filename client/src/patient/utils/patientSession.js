export const getActivePatientId = () => {
  const storedId = localStorage.getItem("patientId");
  if (storedId) return storedId;

  const rawUser = localStorage.getItem("user");
  if (!rawUser) return "demo-patient-id";

  try {
    const parsedUser = JSON.parse(rawUser);
    return parsedUser?.id || parsedUser?._id || "demo-patient-id";
  } catch {
    return "demo-patient-id";
  }
};
