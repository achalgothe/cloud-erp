import { Router } from 'express';
import { protect, checkPermission } from '../middleware/auth.middleware.js';
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAccounts,
  createAccount,
  getAccountSummary,
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoiceStatus
} from '../controllers/finance.controller.js';

const router = Router();

router.use(protect);

// Transactions routes
router.route('/transactions')
  .get(checkPermission('finance', 'view'), getTransactions)
  .post(checkPermission('finance', 'create'), createTransaction);

router.route('/transactions/:id')
  .get(checkPermission('finance', 'view'), getTransactionById)
  .put(checkPermission('finance', 'edit'), updateTransaction)
  .delete(checkPermission('finance', 'delete'), deleteTransaction);

// Accounts routes
router.route('/accounts')
  .get(checkPermission('finance', 'view'), getAccounts)
  .post(checkPermission('finance', 'create'), createAccount);

router.get('/accounts/summary', checkPermission('finance', 'view'), getAccountSummary);

// Invoices routes
router.route('/invoices')
  .get(checkPermission('finance', 'view'), getInvoices)
  .post(checkPermission('finance', 'create'), createInvoice);

router.route('/invoices/:id')
  .get(checkPermission('finance', 'view'), getInvoiceById)
  .patch(checkPermission('finance', 'edit'), updateInvoiceStatus);

export default router;
