const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user (called from Clerk webhook or sync)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
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

    const { clerkId, email, firstName, lastName, profileImage, phoneNumber } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ clerkId }, { email }] });

    if (user) {
      // User exists, update their information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.profileImage = profileImage || user.profileImage;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.lastLogin = Date.now();
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
          user: {
            id: user._id,
            clerkId: user.clerkId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            language: user.language,
            subscription: user.subscription
          },
          token
        }
      });
    }

    // Create new user
    user = await User.create({
      clerkId,
      email,
      firstName,
      lastName,
      profileImage,
      phoneNumber,
      role: 'patient', // Default role
      language: 'english' // Default language
    });

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          language: user.language,
          subscription: user.subscription
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Sync user data with Clerk
// @route   POST /api/auth/sync
// @access  Private
exports.syncUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update last login
    await user.updateLastLogin();

    res.status(200).json({
      status: 'success',
      message: 'User synced successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          language: user.language,
          profileImage: user.profileImage,
          phoneNumber: user.phoneNumber,
          subscription: user.subscription,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error syncing user',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profileImage: user.profileImage,
          language: user.language,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          subscription: user.subscription,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
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

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'language',
      'profileImage'
    ];

    // Update only allowed fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          language: user.language,
          profileImage: user.profileImage,
          role: user.role,
          subscription: user.subscription
        }
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Soft delete - deactivate account instead of removing
    user.isActive = false;
    await user.save();

    // TODO: Also deactivate/cancel Stripe subscription if exists
    // TODO: Delete or archive associated assessments

    res.status(200).json({
      status: 'success',
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting account',
      error: error.message
    });
  }
};
