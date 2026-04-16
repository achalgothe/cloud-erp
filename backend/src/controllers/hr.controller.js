import { asyncHandler } from '../middleware/error.middleware.js';
import { Employee, Attendance, Leave, Payroll } from '../models/HR.model.js';

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private
export const getEmployees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, department, status, search } = req.query;

  const query = { company: req.user.company._id };

  if (department) query.department = department;
  if (status) query.status = status;
  if (search) {
    const employeeIds = await Employee.find({
      company: req.user.company._id,
      $or: [
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ]
    }).distinct('user');

    query.$or = [
      { employeeId: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
      { user: { $in: employeeIds } }
    ];
  }

  const employees = await Employee.find(query)
    .populate('user', 'firstName lastName email phone avatar')
    .populate('manager', 'employeeId')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Employee.countDocuments(query);

  res.json({
    success: true,
    data: {
      employees,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Create employee
// @route   POST /api/hr/employees
// @access  Private
export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create({
    ...req.body,
    company: req.user.company._id
  });

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: { employee }
  });
});

// @desc    Get employee by ID
// @route   GET /api/hr/employees/:id
// @access  Private
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('user', 'firstName lastName email phone')
    .populate('manager', 'employeeId user');

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.json({
    success: true,
    data: { employee }
  });
});

// @desc    Update employee
// @route   PUT /api/hr/employees/:id
// @access  Private
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: { employee }
  });
});

// @desc    Mark attendance
// @route   POST /api/hr/attendance/check-in
// @access  Private
export const checkIn = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employee = await Employee.findOne({ 
    company: req.user.company._id,
    user: req.user._id 
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee record not found'
    });
  }

  // Check if already checked in
  const existingAttendance = await Attendance.findOne({
    company: req.user.company._id,
    employee: employee._id,
    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
  });

  if (existingAttendance && existingAttendance.checkIn) {
    return res.status(400).json({
      success: false,
      message: 'Already checked in today'
    });
  }

  const attendance = await Attendance.findOneAndUpdate(
    {
      company: req.user.company._id,
      employee: employee._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    },
    {
      $set: {
        'checkIn.time': new Date(),
        'checkIn.location': location,
        status: 'present'
      }
    },
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    message: 'Check-in successful',
    data: { attendance }
  });
});

// @desc    Check out
// @route   POST /api/hr/attendance/check-out
// @access  Private
export const checkOut = asyncHandler(async (req, res) => {
  const { location } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employee = await Employee.findOne({ 
    company: req.user.company._id,
    user: req.user._id 
  });

  const attendance = await Attendance.findOne({
    company: req.user.company._id,
    employee: employee._id,
    date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
  });

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'No check-in found for today'
    });
  }

  attendance.checkOut = {
    time: new Date(),
    location
  };

  // Calculate working hours
  const checkInTime = new Date(attendance.checkIn.time);
  const checkOutTime = new Date();
  const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
  attendance.workingHours = parseFloat(hoursWorked.toFixed(2));

  await attendance.save();

  res.json({
    success: true,
    message: 'Check-out successful',
    data: { attendance }
  });
});

// @desc    Get attendance records
// @route   GET /api/hr/attendance
// @access  Private
export const getAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, employeeId, startDate, endDate } = req.query;

  const query = { company: req.user.company._id };

  if (employeeId) {
    const employee = await Employee.findOne({ employeeId });
    if (employee) query.employee = employee._id;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const attendance = await Attendance.find(query)
    .populate('employee', 'employeeId')
    .populate('employee.user', 'firstName lastName')
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Attendance.countDocuments(query);

  res.json({
    success: true,
    data: {
      attendance,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Apply for leave
// @route   POST /api/hr/leave
// @access  Private
export const applyLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.create({
    ...req.body,
    company: req.user.company._id,
    employee: req.body.employee
  });

  res.status(201).json({
    success: true,
    message: 'Leave application submitted',
    data: { leave }
  });
});

// @desc    Get leave requests
// @route   GET /api/hr/leave
// @access  Private
export const getLeaves = asyncHandler(async (req, res) => {
  const { status, employeeId } = req.query;

  const query = { company: req.user.company._id };
  if (status) query.status = status;
  if (employeeId) {
    const employee = await Employee.findOne({ employeeId });
    if (employee) query.employee = employee._id;
  }

  const leaves = await Leave.find(query)
    .populate('employee', 'employeeId')
    .populate('employee.user', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { leaves }
  });
});

// @desc    Approve/Reject leave
// @route   PATCH /api/hr/leave/:id
// @access  Private
export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    {
      status,
      approvedBy: req.body.approvedBy,
      approvedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: 'Leave request not found'
    });
  }

  res.json({
    success: true,
    message: `Leave ${status} successfully`,
    data: { leave }
  });
});

// @desc    Get payroll records
// @route   GET /api/hr/payroll
// @access  Private
export const getPayroll = asyncHandler(async (req, res) => {
  const { month, year, employeeId } = req.query;

  const query = { company: req.user.company._id };

  if (month && year) {
    query['period.month'] = parseInt(month);
    query['period.year'] = parseInt(year);
  }

  if (employeeId) {
    const employee = await Employee.findOne({ employeeId });
    if (employee) query.employee = employee._id;
  }

  const payroll = await Payroll.find(query)
    .populate('employee', 'employeeId')
    .populate('employee.user', 'firstName lastName')
    .sort({ 'period.year': -1, 'period.month': -1 });

  res.json({
    success: true,
    data: { payroll }
  });
});

// @desc    Generate payroll
// @route   POST /api/hr/payroll
// @access  Private
export const generatePayroll = asyncHandler(async (req, res) => {
  const { employee, period, earnings, deductions } = req.body;

  const totalEarnings = Object.values(earnings).reduce((sum, val) => sum + (val || 0), 0);
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
  const netSalary = totalEarnings - totalDeductions;

  const payroll = await Payroll.create({
    company: req.user.company._id,
    employee,
    period,
    earnings,
    deductions,
    netSalary
  });

  res.status(201).json({
    success: true,
    message: 'Payroll generated successfully',
    data: { payroll }
  });
});
