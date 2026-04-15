import { StatusCodes } from 'http-status-codes';
import { fetchPatientReports } from '../services/patientService.js';
import { BadRequestError } from '../errors/customErrors.js';

// @desc    View all reports uploaded by a specific patient (accessed by doctor)
// @route   GET /api/doctors/patient/:patientId/reports
// @access  Doctor (Private)
export const getPatientReports = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      throw new BadRequestError('patientId is required');
    }

    // Extract bearer token from this request and forward it to patient-service
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    const reports = await fetchPatientReports(patientId, token);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Patient reports retrieved successfully',
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
