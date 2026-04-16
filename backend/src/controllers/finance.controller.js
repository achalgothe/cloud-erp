import { asyncHandler } from '../middleware/error.middleware.js';
import { Transaction, Account, Invoice } from '../models/Finance.model.js';

// @desc    Get all transactions
// @route   GET /api/finance/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, category, startDate, endDate } = req.query;

  const query = { company: req.user.company._id };

  if (type) query.type = type;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const transactions = await Transaction.find(query)
    .populate('createdBy', 'firstName lastName')
    .populate('account', 'name')
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Transaction.countDocuments(query);

  // Calculate totals
  const incomeTotal = await Transaction.aggregate([
    { $match: { ...query, type: 'income' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const expenseTotal = await Transaction.aggregate([
    { $match: { ...query, type: 'expense' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    success: true,
    data: {
      transactions,
      totals: {
        income: incomeTotal[0]?.total || 0,
        expense: expenseTotal[0]?.total || 0
      },
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Create transaction
// @route   POST /api/finance/transactions
// @access  Private
export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    company: req.user.company._id,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: { transaction }
  });
});

// @desc    Get transaction by ID
// @route   GET /api/finance/transactions/:id
// @access  Private
export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('createdBy', 'firstName lastName email')
    .populate('account', 'name code')
    .populate('vendor', 'name')
    .populate('customer', 'name');

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }

  res.json({
    success: true,
    data: { transaction }
  });
});

// @desc    Update transaction
// @route   PUT /api/finance/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: { transaction }
  });
});

// @desc    Delete transaction
// @route   DELETE /api/finance/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found'
    });
  }

  res.json({
    success: true,
    message: 'Transaction deleted successfully'
  });
});

// @desc    Get all accounts
// @route   GET /api/finance/accounts
// @access  Private
export const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ 
    company: req.user.company._id,
    isActive: true 
  }).sort({ name: 1 });

  res.json({
    success: true,
    data: { accounts }
  });
});

// @desc    Create account
// @route   POST /api/finance/accounts
// @access  Private
export const createAccount = asyncHandler(async (req, res) => {
  const account = await Account.create({
    ...req.body,
    company: req.user.company._id
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { account }
  });
});

// @desc    Get account balance summary
// @route   GET /api/finance/accounts/summary
// @access  Private
export const getAccountSummary = asyncHandler(async (req, res) => {
  const summary = await Account.aggregate([
    { $match: { company: req.user.company._id, isActive: true } },
    {
      $group: {
        _id: '$type',
        totalBalance: { $sum: '$balance' },
        accountCount: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: { summary }
  });
});

// @desc    Get all invoices
// @route   GET /api/finance/invoices
// @access  Private
export const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = { company: req.user.company._id };
  if (status) query.status = status;

  const invoices = await Invoice.find(query)
    .populate('customer', 'name email')
    .sort({ issueDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Invoice.countDocuments(query);

  res.json({
    success: true,
    data: {
      invoices,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Create invoice
// @route   POST /api/finance/invoices
// @access  Private
export const createInvoice = asyncHandler(async (req, res) => {
  const { items, ...invoiceData } = req.body;

  const invoice = await Invoice.create({
    ...invoiceData,
    company: req.user.company._id,
    items
  });

  res.status(201).json({
    success: true,
    message: 'Invoice created successfully',
    data: { invoice }
  });
});

// @desc    Get invoice by ID
// @route   GET /api/finance/invoices/:id
// @access  Private
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('customer', 'name email phone address');

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  res.json({
    success: true,
    data: { invoice }
  });
});

// @desc    Update invoice status
// @route   PATCH /api/finance/invoices/:id/status
// @access  Private
export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { status, amountPaid } = req.body;

  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { status, amountPaid },
    { new: true, runValidators: true }
  );

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  res.json({
    success: true,
    message: 'Invoice status updated successfully',
    data: { invoice }
  });
});
