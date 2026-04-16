import { Router } from 'express';
import { protect, checkPermission } from '../middleware/auth.middleware.js';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  getWarehouses,
  createWarehouse,
  getInventoryLevels,
  updateInventory,
  recordStockMovement,
  getStockMovements,
  getVendors,
  createVendor,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder
} from '../controllers/inventory.controller.js';

const router = Router();

router.use(protect);

// Product routes
router.route('/products')
  .get(checkPermission('inventory', 'view'), getProducts)
  .post(checkPermission('inventory', 'create'), createProduct);

router.route('/products/:id')
  .get(checkPermission('inventory', 'view'), getProductById)
  .put(checkPermission('inventory', 'edit'), updateProduct);

// Warehouse routes
router.route('/warehouses')
  .get(checkPermission('inventory', 'view'), getWarehouses)
  .post(checkPermission('inventory', 'create'), createWarehouse);

// Inventory levels routes
router.route('/levels')
  .get(checkPermission('inventory', 'view'), getInventoryLevels);

router.route('/levels/:id')
  .put(checkPermission('inventory', 'edit'), updateInventory);

// Stock movement routes
router.route('/movements')
  .get(checkPermission('inventory', 'view'), getStockMovements)
  .post(checkPermission('inventory', 'create'), recordStockMovement);

// Vendor routes
router.route('/vendors')
  .get(checkPermission('inventory', 'view'), getVendors)
  .post(checkPermission('inventory', 'create'), createVendor);

// Purchase order routes
router.route('/purchase-orders')
  .get(checkPermission('inventory', 'view'), getPurchaseOrders)
  .post(checkPermission('inventory', 'create'), createPurchaseOrder);

router.route('/purchase-orders/:id')
  .patch(checkPermission('inventory', 'edit'), updatePurchaseOrder);

export default router;
