import axios from "axios";

const DEFAULT_AI_SYMPTOM_URL = "http://localhost:5006";

/**
 * Calls the AI Symptom microservice; returns the same JSON shape as the former in-process getAISuggestions.
 */
export async function fetchAISuggestions(symptoms) {
  const base =
    process.env.AI_SYMPTOM_SERVICE_URL?.replace(/\/$/, "") ||
    DEFAULT_AI_SYMPTOM_URL;
  const response = await axios.post(
    `${base}/api/ai-symptoms`,
    { symptoms },
    { timeout: 120000, validateStatus: () => true }
  );
  if (response.status >= 400) {
    const msg =
      response.data?.message ||
      `AI Symptom Service returned status ${response.status}`;
    throw new Error(msg);
  }
  return response.data;
}
