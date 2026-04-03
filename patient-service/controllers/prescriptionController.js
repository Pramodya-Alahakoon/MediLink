const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

/**
 * Create a new prescription
 * @route POST /api/prescriptions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.addPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medicines, notes, date, expiryDate, issuedBy } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: patientId, doctorId, medicines (non-empty array)'
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

    // Validate medicines array
    for (let medicine of medicines) {
      if (!medicine.name || !medicine.dosage || !medicine.frequency || !medicine.duration) {
        return res.status(400).json({
          success: false,
          message: 'Each medicine must have: name, dosage, frequency, duration'
        });
      }
    }

    // Validate dates if provided
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    }

    if (expiryDate) {
      const expiryDateObj = new Date(expiryDate);
      if (isNaN(expiryDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiry date format'
        });
      }
    }

    // Create new prescription
    const prescription = new Prescription({
      patientId,
      doctorId,
      medicines,
      notes: notes || '',
      date: date || Date.now(),
      expiryDate: expiryDate || null,
      issuedBy: issuedBy || '',
      status: 'Active'
    });

    const savedPrescription = await prescription.save();
    const populatedPrescription = await savedPrescription.populate('patientId');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: populatedPrescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating prescription',
      error: error.message
    });
  }
};

/**
 * Get prescription by ID
 * @route GET /api/prescriptions/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription ID format'
      });
    }

    const prescription = await Prescription.findById(id).populate('patientId');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription retrieved successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription',
      error: error.message
    });
  }
};

/**
 * Get all prescriptions for a patient
 * @route GET /api/prescriptions/patient/:patientId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPrescriptionsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

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

    // Build query filter
    let query = { patientId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Fetch prescriptions
    const prescriptions = await Prescription.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('patientId');

    // Get total count
    const totalCount = await Prescription.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Prescriptions retrieved successfully',
      patientInfo: {
        patientId: patient._id,
        name: patient.name,
        userId: patient.userId
      },
      data: prescriptions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount: totalCount,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient prescriptions',
      error: error.message
    });
  }
};

/**
 * Update prescription by ID
 * @route PUT /api/prescriptions/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription ID format'
      });
    }

    // Check if prescription exists
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Prevent patientId modification
    if (updateData.patientId && updateData.patientId !== prescription.patientId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify patient ID'
      });
    }

    // Validate medicines array if provided
    if (updateData.medicines && updateData.medicines.length > 0) {
      for (let medicine of updateData.medicines) {
        if (!medicine.name || !medicine.dosage || !medicine.frequency || !medicine.duration) {
          return res.status(400).json({
            success: false,
            message: 'Each medicine must have: name, dosage, frequency, duration'
          });
        }
      }
    }

    // Validate dates if provided
    if (updateData.date) {
      const dateObj = new Date(updateData.date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
    }

    if (updateData.expiryDate) {
      const expiryDateObj = new Date(updateData.expiryDate);
      if (isNaN(expiryDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiry date format'
        });
      }
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('patientId');

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: updatedPrescription
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating prescription',
      error: error.message
    });
  }
};

/**
 * Delete prescription by ID
 * @route DELETE /api/prescriptions/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription ID format'
      });
    }

    const prescription = await Prescription.findByIdAndDelete(id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting prescription',
      error: error.message
    });
  }
};

/**
 * Get active prescriptions for a patient
 * @route GET /api/prescriptions/patient/:patientId/active
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActivePrescriptions = async (req, res) => {
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

    const prescriptions = await Prescription.find({ 
      patientId,
      status: 'Active'
    }).sort({ date: -1 }).populate('patientId');

    res.status(200).json({
      success: true,
      message: 'Active prescriptions retrieved successfully',
      data: prescriptions,
      count: prescriptions.length
    });
  } catch (error) {
    console.error('Error fetching active prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active prescriptions',
      error: error.message
    });
  }
};