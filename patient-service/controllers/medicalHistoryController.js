const MedicalHistory = require('../models/MedicalHistory');
const Patient = require('../models/Patient');

/**
 * Create a new medical history record
 * @route POST /api/medical-history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createMedicalHistory = async (req, res) => {
  try {
    const { patientId, diagnosis, treatment, doctorNotes, date, doctorName, specialization, status } = req.body;

    // Validate required fields
    if (!patientId || !diagnosis || !treatment) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: patientId, diagnosis, treatment'
      });
    }

    // Validate patientId format
    if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Validate date if provided
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    }

    // Create new medical history record
    const medicalHistory = new MedicalHistory({
      patientId,
      diagnosis,
      treatment,
      doctorNotes: doctorNotes || '',
      date: date || Date.now(),
      doctorName: doctorName || '',
      specialization: specialization || 'General Practice',
      status: status || 'Active'
    });

    const savedHistory = await medicalHistory.save();
    const populatedHistory = await savedHistory.populate('patientId');

    res.status(201).json({
      success: true,
      message: 'Medical history record created successfully',
      data: populatedHistory
    });
  } catch (error) {
    console.error('Error creating medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medical history',
      error: error.message
    });
  }
};

/**
 * Get medical history by ID
 * @route GET /api/medical-history/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMedicalHistoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid medical history ID format'
      });
    }

    const medicalHistory = await MedicalHistory.findById(id).populate('patientId');

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Medical history record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical history retrieved successfully',
      data: medicalHistory
    });
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical history',
      error: error.message
    });
  }
};

/**
 * Get all medical history records for a patient
 * @route GET /api/medical-history/patient/:patientId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMedicalHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate if patientId is a valid MongoDB ObjectId
    if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID format'
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const medicalHistories = await MedicalHistory.find({ patientId })
      .sort({ date: -1 })
      .populate('patientId');

    res.status(200).json({
      success: true,
      message: 'Medical history records retrieved successfully',
      patientInfo: {
        patientId: patient._id,
        name: patient.name,
        userId: patient.userId
      },
      data: medicalHistories,
      count: medicalHistories.length
    });
  } catch (error) {
    console.error('Error fetching patient medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient medical history',
      error: error.message
    });
  }
};

/**
 * Update medical history record by ID
 * @route PUT /api/medical-history/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid medical history ID format'
      });
    }

    // Check if medical history record exists
    const medicalHistory = await MedicalHistory.findById(id);
    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Medical history record not found'
      });
    }

    // Prevent patientId modification
    if (updateData.patientId && updateData.patientId !== medicalHistory.patientId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify patient ID'
      });
    }

    // Validate date if provided in update
    if (updateData.date) {
      const dateObj = new Date(updateData.date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    }

    const updatedHistory = await MedicalHistory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('patientId');

    res.status(200).json({
      success: true,
      message: 'Medical history updated successfully',
      data: updatedHistory
    });
  } catch (error) {
    console.error('Error updating medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medical history',
      error: error.message
    });
  }
};

/**
 * Delete medical history record by ID
 * @route DELETE /api/medical-history/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid medical history ID format'
      });
    }

    const medicalHistory = await MedicalHistory.findByIdAndDelete(id);

    if (!medicalHistory) {
      return res.status(404).json({
        success: false,
        message: 'Medical history record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical history deleted successfully',
      data: medicalHistory
    });
  } catch (error) {
    console.error('Error deleting medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medical history',
      error: error.message
    });
  }
};