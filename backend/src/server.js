import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (demo ke liye)
const db = {
  users: [],
  companies: [],
  employees: [],
  attendance: [],
  transactions: [],
  products: [],
  invoices: [],
  warehouses: []
};

// Helper Functions
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = db.users.find(u => u.id === decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get employee by user ID
const getEmployeeByUserId = (userId) => {
  return db.employees.find(e => e.userId === userId);
};

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cloud ERP System is running',
    timestamp: new Date().toISOString()
  });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, company, department, designation } = req.body;

    // Check if user exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create company if not exists
    let companyObj = db.companies.find(c => c.code === company.toUpperCase());
    if (!companyObj) {
      companyObj = {
        id: db.companies.length + 1,
        name: company,
        code: company.toUpperCase(),
        subscription: { plan: 'starter', maxUsers: 10 }
      };
      db.companies.push(companyObj);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: db.users.length + 1,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company: companyObj.id,
      companyName: companyObj.name,
      department,
      designation: designation || 'Employee',
      role: department === 'admin' ? 'admin' : 'employee',
      isActive: true,
      createdAt: new Date()
    };

    db.users.push(user);

    // Auto-create employee record
    const employee = {
      id: db.employees.length + 1,
      userId: user.id,
      employeeId: `EMP${String(db.employees.length + 1).padStart(4, '0')}`,
      department: user.department,
      designation: user.designation,
      dateOfJoining: new Date().toISOString(),
      employmentType: 'full-time',
      status: 'active',
      company: companyObj.id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    };
    db.employees.push(employee);

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          company: user.companyName
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          company: user.companyName
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Current User
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        company: req.user.companyName
      }
    }
  });
});

// Logout
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = db.users.find(u => u.email === email);
    
    // Always return success to prevent email enumeration
    // In production, send email with reset token
    const resetToken = jwt.sign({ email, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    
    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset token: ${resetToken}`);
    console.log(`Reset link: http://localhost:5173/reset-password/${resetToken}`);

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      data: {
        // Demo ke liye token bhej rahe hain (production mein nahi bhejna)
        resetToken,
        resetLink: `http://localhost:5173/reset-password/${resetToken}`
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    // Find user by email from token
    const user = db.users.find(u => u.email === decoded.email);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ ATTENDANCE ROUTES ============

// Check In
app.post('/api/hr/attendance/check-in', authMiddleware, (req, res) => {
  try {
    const { location } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get employee record for this user
    const employee = getEmployeeByUserId(req.user.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee record not found. Please contact admin.' 
      });
    }

    // Check if already checked in today
    const existingAttendance = db.attendance.find(a => {
      const attendanceDate = new Date(a.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return a.employeeId === employee.id && attendanceDate.getTime() === today.getTime();
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: `You already checked in today at ${new Date(existingAttendance.checkIn.time).toLocaleTimeString()}` 
      });
    }

    // Create or update attendance record
    let attendanceRecord;
    if (existingAttendance) {
      attendanceRecord = existingAttendance;
      attendanceRecord.checkIn = {
        time: new Date().toISOString(),
        location: location || { latitude: 0, longitude: 0 }
      };
      attendanceRecord.status = 'present';
    } else {
      attendanceRecord = {
        id: db.attendance.length + 1,
        company: req.user.company,
        employeeId: employee.id,
        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          user: {
            firstName: req.user.firstName,
            lastName: req.user.lastName
          }
        },
        date: new Date().toISOString(),
        checkIn: {
          time: new Date().toISOString(),
          location: location || { latitude: 0, longitude: 0 }
        },
        checkOut: null,
        status: 'present',
        workingHours: 0,
        createdAt: new Date().toISOString()
      };
      db.attendance.push(attendanceRecord);
    }

    res.json({
      success: true,
      message: 'Check-in successful! Have a great day!',
      data: { 
        attendance: attendanceRecord,
        checkInTime: new Date(attendanceRecord.checkIn.time).toLocaleTimeString()
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check Out
app.post('/api/hr/attendance/check-out', authMiddleware, (req, res) => {
  try {
    const { location } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get employee record for this user
    const employee = getEmployeeByUserId(req.user.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee record not found' 
      });
    }

    // Find today's attendance record
    const attendanceRecord = db.attendance.find(a => {
      const attendanceDate = new Date(a.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return a.employeeId === employee.id && attendanceDate.getTime() === today.getTime();
    });

    if (!attendanceRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'No check-in found for today. Please check in first.' 
      });
    }

    if (!attendanceRecord.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: 'No check-in found for today' 
      });
    }

    if (attendanceRecord.checkOut) {
      return res.status(400).json({ 
        success: false, 
        message: `You already checked out today at ${new Date(attendanceRecord.checkOut.time).toLocaleTimeString()}` 
      });
    }

    // Calculate working hours
    const checkInTime = new Date(attendanceRecord.checkIn.time);
    const checkOutTime = new Date();
    const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);

    // Update attendance record
    attendanceRecord.checkOut = {
      time: new Date().toISOString(),
      location: location || { latitude: 0, longitude: 0 }
    };
    attendanceRecord.workingHours = parseFloat(hoursWorked.toFixed(2));

    res.json({
      success: true,
      message: 'Check-out successful! Have a great evening!',
      data: { 
        attendance: attendanceRecord,
        checkOutTime: new Date(attendanceRecord.checkOut.time).toLocaleTimeString(),
        workingHours: attendanceRecord.workingHours
      }
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Attendance Records
app.get('/api/hr/attendance', authMiddleware, (req, res) => {
  try {
    const { limit = 30, employeeId } = req.query;

    // Get employee record for this user
    const employee = getEmployeeByUserId(req.user.id);
    
    let attendanceRecords = db.attendance.filter(a => a.company === req.user.company);
    
    if (employeeId) {
      const emp = db.employees.find(e => e.employeeId === employeeId);
      if (emp) {
        attendanceRecords = attendanceRecords.filter(a => a.employeeId === emp.id);
      }
    } else if (employee) {
      // Show own attendance if not admin
      if (req.user.role !== 'admin') {
        attendanceRecords = attendanceRecords.filter(a => a.employeeId === employee.id);
      }
    }

    // Sort by date descending
    attendanceRecords = attendanceRecords.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Limit results
    attendanceRecords = attendanceRecords.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        attendance: attendanceRecords,
        pagination: {
          total: attendanceRecords.length,
          page: 1,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ EMPLOYEE ROUTES ============

app.get('/api/hr/employees', authMiddleware, (req, res) => {
  try {
    const employees = db.employees.filter(e => e.company === req.user.company);
    res.json({
      success: true,
      data: {
        employees,
        pagination: { total: employees.length, page: 1, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/hr/employees', authMiddleware, (req, res) => {
  try {
    const employee = {
      id: db.employees.length + 1,
      ...req.body,
      company: req.user.company,
      createdAt: new Date().toISOString()
    };
    db.employees.push(employee);
    res.status(201).json({ success: true, data: { employee } });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ FINANCE ROUTES ============

app.get('/api/finance/transactions', authMiddleware, (req, res) => {
  try {
    const transactions = db.transactions.filter(t => t.company === req.user.company);
    
    // Calculate totals
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      data: {
        transactions,
        totals: { income, expense },
        pagination: { total: transactions.length, page: 1, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/finance/transactions', authMiddleware, (req, res) => {
  try {
    const transaction = {
      id: db.transactions.length + 1,
      ...req.body,
      company: req.user.company,
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };
    db.transactions.push(transaction);
    res.status(201).json({ success: true, data: { transaction } });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ INVENTORY ROUTES ============

app.get('/api/inventory/products', authMiddleware, (req, res) => {
  try {
    const products = db.products.filter(p => p.company === req.user.company);
    res.json({
      success: true,
      data: {
        products,
        pagination: { total: products.length, page: 1, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/inventory/products', authMiddleware, (req, res) => {
  try {
    const product = {
      id: db.products.length + 1,
      ...req.body,
      company: req.user.company,
      createdAt: new Date().toISOString()
    };
    db.products.push(product);
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/inventory/warehouses', authMiddleware, (req, res) => {
  try {
    const warehouses = db.warehouses.filter(w => w.company === req.user.company);
    res.json({
      success: true,
      data: {
        warehouses,
        pagination: { total: warehouses.length, page: 1, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/inventory/warehouses', authMiddleware, (req, res) => {
  try {
    const warehouse = {
      id: db.warehouses.length + 1,
      ...req.body,
      company: req.user.company,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    db.warehouses.push(warehouse);
    res.status(201).json({ success: true, data: { warehouse } });
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============ INVOICES ROUTES ============

app.get('/api/finance/invoices', authMiddleware, (req, res) => {
  try {
    const invoices = db.invoices.filter(i => i.company === req.user.company);
    res.json({
      success: true,
      data: {
        invoices,
        pagination: { total: invoices.length, page: 1, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/finance/invoices', authMiddleware, (req, res) => {
  try {
    const invoice = {
      id: db.invoices.length + 1,
      ...req.body,
      company: req.user.company,
      createdAt: new Date().toISOString()
    };
    db.invoices.push(invoice);
    res.status(201).json({ success: true, data: { invoice } });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     Cloud ERP System - Backend Server          ║
║     Running on port ${PORT}                      ║
║     Mode: DEMO (In-Memory Database)            ║
║     API: http://localhost:${PORT}/api           ║
╚════════════════════════════════════════════════╝
  `);
});
