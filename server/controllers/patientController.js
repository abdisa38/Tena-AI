const User = require('../models/User');
const Assessment = require('../models/Assessment');

// @desc    Get all patients (Doctor/Admin only)
// @route   GET /api/patients
// @access  Private (Doctor/Admin)
exports.getAllPatients = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Search filter
    const filter = { role: 'patient', isActive: true };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex }
      ];
    }

    // Get patients
    const patients = await User.find(filter)
      .select('firstName lastName email phoneNumber language dateOfBirth gender createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get assessment counts for each patient
    const patientsWithCounts = await Promise.all(
      patients.map(async (patient) => {
        const assessmentCount = await Assessment.countDocuments({ patient: patient._id });
        const emergencyCount = await Assessment.countDocuments({ 
          patient: patient._id, 
          isEmergency: true 
        });

        return {
          ...patient.toObject(),
          stats: {
            totalAssessments: assessmentCount,
            emergencyAssessments: emergencyCount
          }
        };
      })
    );

    // Get total count
    const total = await User.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: patients.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        patients: patientsWithCounts
      }
    });

  } catch (error) {
    console.error('Get All Patients Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id)
      .select('-__v -subscription.stripeCustomerId -subscription.stripeSubscriptionId');

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check permissions
    const isSelf = req.user._id.toString() === patient._id.toString();
    const isDoctor = ['doctor', 'admin'].includes(req.user.role);

    if (!isSelf && !isDoctor) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this patient'
      });
    }

    // Get patient statistics
    const totalAssessments = await Assessment.countDocuments({ patient: patient._id });
    const emergencyCount = await Assessment.countDocuments({ 
      patient: patient._id, 
      isEmergency: true 
    });
    const pendingReview = await Assessment.countDocuments({ 
      patient: patient._id, 
      status: 'analyzed' 
    });

    // Get recent assessments
    const recentAssessments = await Assessment.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('assessmentId symptoms aiAnalysis.confidence status createdAt isEmergency');

    res.status(200).json({
      status: 'success',
      data: {
        patient: {
          ...patient.toObject(),
          stats: {
            totalAssessments,
            emergencyCount,
            pendingReview
          },
          recentAssessments
        }
      }
    });

  } catch (error) {
    console.error('Get Patient Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

// @desc    Get all assessments for a specific patient
// @route   GET /api/patients/:id/assessments
// @access  Private
exports.getPatientAssessments = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Check if patient exists
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check permissions
    const isSelf = req.user._id.toString() === patientId;
    const isDoctor = ['doctor', 'admin'].includes(req.user.role);

    if (!isSelf && !isDoctor) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these assessments'
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const filter = { patient: patientId };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.isEmergency) {
      filter.isEmergency = req.query.isEmergency === 'true';
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Get assessments
    const assessments = await Assessment.find(filter)
      .populate('reviewedBy', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count
    const total = await Assessment.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: assessments.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        patient: {
          id: patient._id,
          name: `${patient.firstName} ${patient.lastName}`,
          email: patient.email
        },
        assessments
      }
    });

  } catch (error) {
    console.error('Get Patient Assessments Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching patient assessments',
      error: error.message
    });
  }
};

// @desc    Get patient dashboard statistics (Doctor view)
// @route   GET /api/patients/stats/dashboard
// @access  Private (Doctor/Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Total patients
    const totalPatients = await User.countDocuments({ role: 'patient', isActive: true });

    // New patients this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newPatientsThisMonth = await User.countDocuments({
      role: 'patient',
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    // Total assessments
    const totalAssessments = await Assessment.countDocuments();

    // Pending reviews
    const pendingReviews = await Assessment.countDocuments({ status: 'analyzed' });

    // Emergency cases
    const emergencyCases = await Assessment.countDocuments({ 
      isEmergency: true,
      status: { $ne: 'archived' }
    });

    // Recent patients
    const recentPatients = await User.find({ role: 'patient', isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalPatients,
          newPatientsThisMonth,
          totalAssessments,
          pendingReviews,
          emergencyCases
        },
        recentPatients
      }
    });

  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
