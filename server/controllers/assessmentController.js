const Assessment = require('../models/Assessment');
const User = require('../models/User');
const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

// @desc    Create new health assessment
// @route   POST /api/assessments
// @access  Private
exports.createAssessment = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { symptoms, voiceRecording, vitalSigns, language } = req.body;

    // Check if user has exceeded their plan limits
    const user = await User.findById(req.user._id);
    
    if (user.subscription.plan === 'free') {
      const currentMonth = new Date().getMonth();
      const assessmentCount = await Assessment.countDocuments({
        patient: req.user._id,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), currentMonth, 1)
        }
      });

      if (assessmentCount >= 5) {
        return res.status(403).json({
          status: 'error',
          message: 'Free plan limit reached. Upgrade to continue using TenaAI.',
          limitReached: true
        });
      }
    }

    // Check for emergency symptoms
    const isEmergency = aiService.identifyEmergencySignals(symptoms, vitalSigns);

    // Analyze symptoms with AI
    const aiAnalysisResult = await aiService.analyzeSymptoms({
      symptoms,
      vitalSigns,
      language: language || user.language,
      patientContext: {
        age: user.dateOfBirth ? 
          Math.floor((Date.now() - new Date(user.dateOfBirth)) / 31557600000) : null,
        gender: user.gender
      }
    });

    if (!aiAnalysisResult.success) {
      return res.status(500).json({
        status: 'error',
        message: 'AI analysis failed. Please try again.',
        error: aiAnalysisResult.error
      });
    }

    // Create assessment
    const assessment = await Assessment.create({
      patient: req.user._id,
      voiceRecording,
      symptoms,
      vitalSigns,
      aiAnalysis: aiAnalysisResult.data,
      status: 'analyzed',
      isEmergency
    });

    // Populate patient info
    await assessment.populate('patient', 'firstName lastName email');

    res.status(201).json({
      status: 'success',
      message: 'Assessment created successfully',
      data: {
        assessment: {
          id: assessment._id,
          assessmentId: assessment.assessmentId,
          symptoms: assessment.symptoms,
          aiAnalysis: assessment.aiAnalysis,
          vitalSigns: assessment.vitalSigns,
          status: assessment.status,
          isEmergency: assessment.isEmergency,
          createdAt: assessment.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Create Assessment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating assessment',
      error: error.message
    });
  }
};

// @desc    Get all assessments for logged-in user
// @route   GET /api/assessments
// @access  Private
exports.getMyAssessments = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const filter = { patient: req.user._id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.isEmergency) {
      filter.isEmergency = req.query.isEmergency === 'true';
    }

    // Get assessments
    const assessments = await Assessment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v');

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
        assessments
      }
    });

  } catch (error) {
    console.error('Get Assessments Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching assessments',
      error: error.message
    });
  }
};

// @desc    Get single assessment by ID
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('reviewedBy', 'firstName lastName role');

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    // Check if user owns this assessment or is a doctor/admin
    if (
      assessment.patient._id.toString() !== req.user._id.toString() &&
      !['doctor', 'admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this assessment'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        assessment
      }
    });

  } catch (error) {
    console.error('Get Assessment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching assessment',
      error: error.message
    });
  }
};

// @desc    Update assessment (add doctor notes, etc.)
// @route   PUT /api/assessments/:id
// @access  Private
exports.updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    // Check permissions
    const isOwner = assessment.patient.toString() === req.user._id.toString();
    const isDoctor = ['doctor', 'admin'].includes(req.user.role);

    if (!isOwner && !isDoctor) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this assessment'
      });
    }

    // Fields that can be updated
    const allowedUpdates = ['status', 'doctorNotes', 'requiresFollowUp', 'followUpDate'];

    // Doctors can add notes and mark as reviewed
    if (isDoctor) {
      if (req.body.doctorNotes) {
        assessment.doctorNotes = req.body.doctorNotes;
        assessment.reviewedBy = req.user._id;
        assessment.reviewedAt = Date.now();
        assessment.status = 'reviewed';
      }

      if (req.body.requiresFollowUp !== undefined) {
        assessment.requiresFollowUp = req.body.requiresFollowUp;
      }

      if (req.body.followUpDate) {
        assessment.followUpDate = req.body.followUpDate;
      }
    }

    // Patients can only update status (e.g., mark as archived)
    if (isOwner && req.body.status === 'archived') {
      assessment.status = 'archived';
    }

    await assessment.save();

    await assessment.populate('reviewedBy', 'firstName lastName role');

    res.status(200).json({
      status: 'success',
      message: 'Assessment updated successfully',
      data: {
        assessment
      }
    });

  } catch (error) {
    console.error('Update Assessment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating assessment',
      error: error.message
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    // Only owner or admin can delete
    if (
      assessment.patient.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this assessment'
      });
    }

    await Assessment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    console.error('Delete Assessment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting assessment',
      error: error.message
    });
  }
};

// @desc    Get assessment statistics for user
// @route   GET /api/assessments/stats/overview
// @access  Private
exports.getAssessmentStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total assessments
    const totalAssessments = await Assessment.countDocuments({ patient: userId });

    // Assessments this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAssessments = await Assessment.countDocuments({
      patient: userId,
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    // Emergency assessments
    const emergencyCount = await Assessment.countDocuments({
      patient: userId,
      isEmergency: true
    });

    // Recent assessments (last 5)
    const recentAssessments = await Assessment.find({ patient: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('assessmentId symptoms aiAnalysis.confidence status createdAt isEmergency');

    // Average confidence score
    const assessmentsWithConfidence = await Assessment.find({
      patient: userId,
      'aiAnalysis.confidence': { $exists: true }
    }).select('aiAnalysis.confidence');

    let avgConfidence = 0;
    if (assessmentsWithConfidence.length > 0) {
      const sum = assessmentsWithConfidence.reduce(
        (acc, curr) => acc + curr.aiAnalysis.confidence,
        0
      );
      avgConfidence = Math.round(sum / assessmentsWithConfidence.length);
    }

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalAssessments,
          thisMonthAssessments,
          emergencyCount,
          avgConfidence,
          recentAssessments
        }
      }
    });

  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
