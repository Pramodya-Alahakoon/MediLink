import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import Consultation from '../models/Consultation.js';

/**
 * VIDEO CONSULTATION CONTROLLER — Telemedicine Service
 *
 * Handles Jitsi Meet video session creation, retrieval, and status management.
 * Frontend should open meetingLink in browser for video call — no app required.
 *
 * Routes are mounted at /api/consultations in app.js
 */

// ─────────────────────────────────────────────────────────────────
// @desc    Create a new Jitsi Meet video consultation session
// @route   POST /api/consultations/create-session
// @access  Doctor / Admin (Private)
// ─────────────────────────────────────────────────────────────────
export const createConsultationSession = async (req, res, next) => {
  try {
    const { appointmentId, doctorId, patientId, notes } = req.body;

    if (!appointmentId || !doctorId || !patientId) {
      throw new BadRequestError('Required fields missing: appointmentId, doctorId, patientId');
    }

    // Return existing session if already created for this appointment (idempotent)
    const existingSession = await Consultation.findOne({ appointmentId });
    if (existingSession) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Session already exists — returning existing link',
        data: existingSession,
      });
    }

    // Generate Jitsi room name — unique per appointment, no API key required
    // Frontend should open meetingLink in browser for video call
    const meetingLink = `https://meet.jit.si/medilink-${appointmentId}`;

    const newSession = await Consultation.create({
      appointmentId,
      doctorId,
      patientId,
      meetingLink,
      platform: 'JITSI',
      status: 'scheduled',
      notes: notes || null,
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

// ─────────────────────────────────────────────────────────────────
// @desc    Get all consultations for a specific doctor
// @route   GET /api/consultations/doctor/:doctorId
// @access  Doctor / Admin (Private)
// ─────────────────────────────────────────────────────────────────
export const getConsultationsByDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { doctorId };
    if (status) filter.status = status;

    const [consultations, total] = await Promise.all([
      Consultation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Consultation.countDocuments(filter),
    ]);

    res.status(StatusCodes.OK).json({ success: true, count: consultations.length, total, data: consultations });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    Get all consultations for a specific patient
// @route   GET /api/consultations/patient/:patientId
// @access  Patient / Doctor / Admin (Private)
// ─────────────────────────────────────────────────────────────────
export const getConsultationsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { patientId };
    if (status) filter.status = status;

    const [consultations, total] = await Promise.all([
      Consultation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Consultation.countDocuments(filter),
    ]);

    res.status(StatusCodes.OK).json({ success: true, count: consultations.length, total, data: consultations });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    Get a consultation session by appointment ID
// @route   GET /api/consultations/:appointmentId
// @access  Doctor / Patient (Private)
// ─────────────────────────────────────────────────────────────────
export const getConsultationByAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const session = await Consultation.findOne({ appointmentId });
    if (!session) {
      throw new NotFoundError(`No video consultation found for appointment: ${appointmentId}`);
    }

    res.status(StatusCodes.OK).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    Update consultation status
// @route   PATCH /api/consultations/:appointmentId/status
// @access  Doctor / Admin (Private)
// ─────────────────────────────────────────────────────────────────
export const updateConsultationStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    const VALID = ['scheduled', 'active', 'completed', 'cancelled'];
    if (!VALID.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${VALID.join(', ')}`);
    }

    const updateData = { status };
    if (notes !== undefined) updateData.notes = notes;

    // Auto-set timestamps based on status transitions
    if (status === 'active')                              updateData.startedAt = new Date();
    if (status === 'completed' || status === 'cancelled') updateData.endedAt   = new Date();

    const session = await Consultation.findOneAndUpdate({ appointmentId }, updateData, {
      new: true, runValidators: true,
    });

    if (!session) throw new NotFoundError(`No consultation found for appointment: ${appointmentId}`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Consultation status updated to '${status}'`,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// @desc    Add/update clinical notes
// @route   PATCH /api/consultations/:appointmentId/notes
// @access  Doctor / Admin (Private)
// ─────────────────────────────────────────────────────────────────
export const updateConsultationNotes = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    if (notes === undefined) throw new BadRequestError('notes field is required');

    const session = await Consultation.findOneAndUpdate(
      { appointmentId },
      { notes },
      { new: true }
    );

    if (!session) throw new NotFoundError(`No consultation found for appointment: ${appointmentId}`);

    res.status(StatusCodes.OK).json({ success: true, message: 'Notes updated', data: session });
  } catch (error) {
    next(error);
  }
};
