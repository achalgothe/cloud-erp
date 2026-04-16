import { asyncHandler } from '../middleware/error.middleware.js';
import Company from '../models/Company.model.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/Super Admin
export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ isActive: true });

  res.json({
    success: true,
    data: { companies }
  });
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  res.json({
    success: true,
    data: { company }
  });
});

// @desc    Get current user's company
// @route   GET /api/companies/me/company
// @access  Private
export const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.user.company._id);

  res.json({
    success: true,
    data: { company }
  });
});

// @desc    Create company
// @route   POST /api/companies
// @access  Private/Super Admin
export const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Company created successfully',
    data: { company }
  });
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  res.json({
    success: true,
    message: 'Company updated successfully',
    data: { company }
  });
});

// @desc    Update company settings
// @route   PUT /api/companies/:id/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  const { currency, timezone, dateFormat, fiscalYearStart } = req.body;

  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { 
      'settings.currency': currency,
      'settings.timezone': timezone,
      'settings.dateFormat': dateFormat,
      'settings.fiscalYearStart': fiscalYearStart
    },
    { new: true, runValidators: true }
  );

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: { company }
  });
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Super Admin
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  res.json({
    success: true,
    message: 'Company deactivated successfully'
  });
});
