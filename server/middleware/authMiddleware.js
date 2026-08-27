const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-__v');

      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Account is deactivated'
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error'
    });
  }
};

// Restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Check subscription status
exports.checkSubscription = (requiredPlan) => {
  return (req, res, next) => {
    const planHierarchy = { free: 0, basic: 1, premium: 2 };
    
    const userPlanLevel = planHierarchy[req.user.subscription.plan];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        status: 'error',
        message: `This feature requires ${requiredPlan} subscription or higher`
      });
    }

    if (req.user.subscription.status !== 'active' && req.user.subscription.plan !== 'free') {
      return res.status(403).json({
        status: 'error',
        message: 'Your subscription is not active. Please renew to continue.'
      });
    }

    next();
  };
};
