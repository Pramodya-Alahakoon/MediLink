import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import Consultation from '../models/Consultation.js';

/**
 * ----------------------------------------------------------------------------
 * VIDEO CONSULTATION CONTROLLER
 * ----------------------------------------------------------------------------
 * This controller handles the creation and retrieval of video consultation 
 * sessions using Jitsi Meet.
 */

// @desc    Create a new video consultation session
// @route   POST /api/doctors/consultations/create-session
// @access  Doctor
export const createConsultationSession = async (req, res, next) => {
  try {
    const { appointmentId, doctorId, patientId } = req.body;

    // 1. Validation
    if (!appointmentId || !doctorId || !patientId) {
      throw new BadRequestError('Required fields missing: appointmentId, doctorId, patientId');
    }

    // 2. Check if a session already exists for this appointment
    const existingSession = await Consultation.findOne({ appointmentId });
    if (existingSession) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Session already exists for this appointment',
        data: existingSession,
      });
    }

    // 3. Generate Jitsi Meet link
    // Format: https://meet.jit.si/medilink-{appointmentId}
    // Note: No API key required for basic Jitsi Meet rooms.
    // Frontend should open this link in a new browser tab for the video call.
    const meetingLink = `https://meet.jit.si/medilink-${appointmentId}`;
    
    // 4. Create and Save to Database
    const newSession = await Consultation.create({
      appointmentId,
      doctorId,
      patientId,
      meetingLink,
      platform: 'JITSI',
      status: 'scheduled',
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Video consultation session created successfully',
      data: newSession,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a consultation session link by appointment ID
// @route   GET /api/doctors/consultations/:appointmentId
// @access  Doctor / Patient
export const getConsultationByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      throw new BadRequestError('Appointment ID is required');
    }

    const session = await Consultation.findOne({ appointmentId });

    if (!session) {
      throw new NotFoundError(`No video consultation found for appointment: ${appointmentId}`);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status
// @route   PATCH /api/doctors/consultations/:appointmentId/status
// @access  Doctor
export const updateConsultationStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'completed', 'active'].includes(status)) {
      throw new BadRequestError('Invalid status. Must be scheduled, completed, or active');
    }

    const session = await Consultation.findOneAndUpdate(
      { appointmentId },
      { status },
      { new: true, runValidators: true }
    );

    if (!session) {
      throw new NotFoundError(`No video consultation found for appointment: ${appointmentId}`);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Consultation status updated to ${status}`,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
