import mongoose from 'mongoose';

// Employee Schema
const employeeSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'intern'],
    default: 'full-time'
  },
  workLocation: {
    type: String,
    default: 'office'
  },
  salary: {
    basic: Number,
    allowances: [{
      name: String,
      amount: Number
    }],
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifsc: String,
    branch: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date
  }],
  status: {
    type: String,
    enum: ['active', 'on_leave', 'suspended', 'terminated', 'resigned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  checkOut: {
    time: Date,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day', 'leave', 'holiday', 'work_from_home'],
    default: 'present'
  },
  workingHours: {
    type: Number,
    default: 0
  },
  overtime: {
    type: Number,
    default: 0
  },
  remarks: String
}, {
  timestamps: true
});

// Leave Schema
const leaveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  type: {
    type: String,
    enum: ['sick', 'casual', 'annual', 'maternity', 'paternity', 'unpaid', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvedAt: Date,
  attachments: [String]
}, {
  timestamps: true
});

// Payroll Schema
const payrollSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  period: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  earnings: {
    basic: Number,
    allowances: [{
      name: String,
      amount: Number
    }],
    overtime: Number,
    bonus: Number,
    other: Number
  },
  deductions: {
    tax: Number,
    insurance: Number,
    providentFund: Number,
    other: Number
  },
  netSalary: {
    type: Number,
    required: true
  },
  paymentDate: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending'
  },
  payslipUrl: String,
  notes: String
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);

export { Employee, Attendance, Leave, Payroll };
