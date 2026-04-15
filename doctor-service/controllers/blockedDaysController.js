import BlockedDay from '../models/BlockedDay.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, BadRequestError } from '../errors/customErrors.js';
import Doctor from '../models/Doctor.js';

// @desc    Get all blocked days for a doctor
// @route   GET /api/availability/blocked-days/:doctorId
// @access  Doctor/Admin
export const getBlockedDays = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { activeOnly = true } = req.query;

    let query = { doctorId };
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    const blockedDays = await BlockedDay.find(query).sort({ startDate: 1 });

    res.status(StatusCodes.OK).json({
      success: true,
      count: blockedDays.length,
      data: blockedDays,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block a date range
// @route   POST /api/availability/blocked-days
// @access  Doctor/Admin
export const blockDateRange = async (req, res, next) => {
  try {
    const { doctorId, startDate, endDate, reason, type } = req.body;

    if (!doctorId || !startDate || !endDate) {
      throw new BadRequestError('Required fields: doctorId, startDate, endDate');
    }

    // Verify doctor exists
    let doctor;
    if (doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      doctor = await Doctor.findById(doctorId);
    } else {
      doctor = await Doctor.findOne({ doctorId: doctorId });
    }

    if (!doctor) {
      throw new NotFoundError(`No doctor found with id: ${doctorId}`);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new BadRequestError('End date must be greater than or equal to start date');
    }

    // Check for overlapping blocks
    const existingBlock = await BlockedDay.findOne({
      doctorId,
      isActive: true,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (existingBlock) {
      throw new BadRequestError('Date range overlaps with existing blocked period');
    }

    const blockedDay = await BlockedDay.create({
      doctorId,
      startDate: start,
      endDate: end,
      reason,
      type: type || 'other',
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Date range blocked successfully',
      data: blockedDay,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blocked date range
// @route   PUT /api/availability/blocked-days/:id
// @access  Doctor/Admin
export const updateBlockedDay = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, reason, type, isActive } = req.body;

    const blockedDay = await BlockedDay.findById(id);
    if (!blockedDay) {
      throw new NotFoundError(`No blocked day found with id: ${id}`);
    }

    const updateData = {};
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (reason !== undefined) updateData.reason = reason;
    if (type) updateData.type = type;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Validate dates if both are provided
    if (updateData.startDate && updateData.endDate) {
      if (updateData.endDate < updateData.startDate) {
        throw new BadRequestError('End date must be greater than or equal to start date');
      }
    }

    const updatedBlockedDay = await BlockedDay.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blocked day updated successfully',
      data: updatedBlockedDay,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/unblock a date range
// @route   DELETE /api/availability/blocked-days/:id
// @access  Doctor/Admin
export const deleteBlockedDay = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blockedDay = await BlockedDay.findById(id);
    if (!blockedDay) {
      throw new NotFoundError(`No blocked day found with id: ${id}`);
    }

    await BlockedDay.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Blocked day removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a date is blocked for a doctor
// @route   GET /api/availability/blocked-days/:doctorId/check
// @access  Public
export const checkDateBlocked = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      throw new BadRequestError('Date query parameter is required');
    }

    const checkDate = new Date(date);
    const startOfDay = new Date(checkDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(checkDate.setHours(23, 59, 59, 999));

    const blockedDay = await BlockedDay.findOne({
      doctorId,
      isActive: true,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      isBlocked: !!blockedDay,
      blockedPeriod: blockedDay || null,
    });
  } catch (error) {
    next(error);
  }
};
