import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import logger from '../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password').populate('company');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      next();
    } catch (error) {
      logger.error('JWT verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check module permissions
export const checkPermission = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Super admin and admin have all permissions
    if (['super_admin', 'admin'].includes(req.user.role)) {
      return next();
    }

    const permission = req.user.permissions?.find(p => p.module === module);

    if (!permission) {
      return res.status(403).json({
        success: false,
        message: `No permission for module: ${module}`
      });
    }

    const actionMap = {
      'view': permission.canView,
      'create': permission.canCreate,
      'edit': permission.canEdit,
      'delete': permission.canDelete
    };

    if (!actionMap[action]) {
      return res.status(403).json({
        success: false,
        message: `No ${action} permission for module: ${module}`
      });
    }

    next();
  };
};
