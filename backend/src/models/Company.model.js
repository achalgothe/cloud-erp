import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Company code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  logo: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    enum: ['technology', 'manufacturing', 'retail', 'healthcare', 'finance', 'education', 'other'],
    default: 'other'
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  contact: {
    email: String,
    phone: String,
    website: String
  },
  taxInfo: {
    gstin: String,
    pan: String,
    cin: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    maxUsers: {
      type: Number,
      default: 5
    },
    features: [String]
  },
  settings: {
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    fiscalYearStart: {
      type: String,
      default: '01-01'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
