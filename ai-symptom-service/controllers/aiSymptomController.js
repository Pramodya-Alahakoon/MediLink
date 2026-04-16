import { getAISuggestions } from "../utils/aiSymptomChecker.js";

/**
 * HTTP handler: delegates to existing getAISuggestions (unchanged logic).
 */
export const analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (symptoms === undefined || symptoms === null || String(symptoms).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "symptoms is required",
      });
    }

    const result = await getAISuggestions(String(symptoms));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
