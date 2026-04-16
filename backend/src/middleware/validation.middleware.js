import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Login validation
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Register validation
export const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('company').notEmpty().withMessage('Company is required'),
  body('department').notEmpty().withMessage('Department is required'),
  validate
];

// User update validation
export const userUpdateValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().trim().isEmail(),
  body('phone').optional().trim(),
  body('designation').optional().trim(),
  body('department').optional().isIn(['finance', 'hr', 'inventory', 'sales', 'operations', 'admin']),
  validate
];

// Transaction validation
export const transactionValidation = [
  body('type').isIn(['income', 'expense', 'transfer']).withMessage('Invalid transaction type'),
  body('category').notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('date').optional().isISO8601(),
  body('description').optional().trim(),
  validate
];

// Employee validation
export const employeeValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dateOfJoining').isISO8601().withMessage('Invalid joining date'),
  validate
];

// Product validation
export const productValidation = [
  body('sku').notEmpty().withMessage('SKU is required'),
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('sellingPrice').optional().isFloat({ min: 0 }),
  validate
];

// Pagination validation
export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().trim(),
  query('order').optional().isIn(['asc', 'desc']),
  validate
];

// ID validation
export const idValidation = [
  param('id').notEmpty().withMessage('ID is required'),
  validate
];
