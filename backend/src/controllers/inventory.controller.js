import { asyncHandler } from '../middleware/error.middleware.js';
import { Product, Inventory, Warehouse, StockMovement, PurchaseOrder, Vendor } from '../models/Inventory.model.js';

// @desc    Get all products
// @route   GET /api/inventory/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search, lowStock } = req.query;

  const query = { company: req.user.company._id };

  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }

  let productsQuery = Product.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ name: 1 });

  if (lowStock) {
    const inventoryDocs = await Inventory.find({
      company: req.user.company._id,
      $expr: { $lte: ['$availableQuantity', '$reorderLevel'] }
    }).distinct('product');

    productsQuery = Product.find({ 
      _id: { $in: inventoryDocs }
    });
  }

  const products = await productsQuery;
  const count = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Create product
// @route   POST /api/inventory/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    company: req.user.company._id
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product }
  });
});

// @desc    Get product by ID
// @route   GET /api/inventory/products/:id
// @access  Private
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Get inventory across warehouses
  const inventory = await Inventory.find({ product: product._id })
    .populate('warehouse', 'name code');

  res.json({
    success: true,
    data: { product, inventory }
  });
});

// @desc    Update product
// @route   PUT /api/inventory/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product }
  });
});

// @desc    Get all warehouses
// @route   GET /api/inventory/warehouses
// @access  Private
export const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find({ 
    company: req.user.company._id,
    isActive: true 
  }).sort({ name: 1 });

  res.json({
    success: true,
    data: { warehouses }
  });
});

// @desc    Create warehouse
// @route   POST /api/inventory/warehouses
// @access  Private
export const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.create({
    ...req.body,
    company: req.user.company._id
  });

  res.status(201).json({
    success: true,
    message: 'Warehouse created successfully',
    data: { warehouse }
  });
});

// @desc    Get inventory levels
// @route   GET /api/inventory/levels
// @access  Private
export const getInventoryLevels = asyncHandler(async (req, res) => {
  const { warehouse, product } = req.query;

  const query = { company: req.user.company._id };
  if (warehouse) query.warehouse = warehouse;
  if (product) query.product = product;

  const inventory = await Inventory.find(query)
    .populate('product', 'name sku category')
    .populate('warehouse', 'name code');

  res.json({
    success: true,
    data: { inventory }
  });
});

// @desc    Update inventory
// @route   PUT /api/inventory/levels/:id
// @access  Private
export const updateInventory = asyncHandler(async (req, res) => {
  const { quantity, reservedQuantity } = req.body;

  const inventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    {
      quantity,
      reservedQuantity,
      availableQuantity: quantity - (reservedQuantity || 0),
      lastUpdated: new Date()
    },
    { new: true, runValidators: true }
  );

  if (!inventory) {
    return res.status(404).json({
      success: false,
      message: 'Inventory record not found'
    });
  }

  res.json({
    success: true,
    message: 'Inventory updated successfully',
    data: { inventory }
  });
});

// @desc    Record stock movement
// @route   POST /api/inventory/movements
// @access  Private
export const recordStockMovement = asyncHandler(async (req, res) => {
  const { type, product, warehouse, quantity, fromWarehouse, toWarehouse } = req.body;

  const movement = await StockMovement.create({
    ...req.body,
    company: req.user.company._id,
    performedBy: req.user._id
  });

  // Update inventory
  if (type === 'in') {
    await Inventory.findOneAndUpdate(
      { company: req.user.company._id, product, warehouse },
      { $inc: { quantity, availableQuantity: quantity } },
      { upsert: true }
    );
  } else if (type === 'out') {
    await Inventory.findOneAndUpdate(
      { company: req.user.company._id, product, warehouse },
      { $inc: { quantity: -quantity, availableQuantity: -quantity } }
    );
  } else if (type === 'transfer' && fromWarehouse && toWarehouse) {
    await Inventory.findOneAndUpdate(
      { company: req.user.company._id, product, warehouse: fromWarehouse },
      { $inc: { quantity: -quantity, availableQuantity: -quantity } }
    );
    await Inventory.findOneAndUpdate(
      { company: req.user.company._id, product, warehouse: toWarehouse },
      { $inc: { quantity, availableQuantity: quantity } },
      { upsert: true }
    );
  }

  res.status(201).json({
    success: true,
    message: 'Stock movement recorded successfully',
    data: { movement }
  });
});

// @desc    Get stock movements
// @route   GET /api/inventory/movements
// @access  Private
export const getStockMovements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, type, product, warehouse } = req.query;

  const query = { company: req.user.company._id };
  if (type) query.type = type;
  if (product) query.product = product;
  if (warehouse) query.warehouse = warehouse;

  const movements = await StockMovement.find(query)
    .populate('product', 'name sku')
    .populate('warehouse', 'name code')
    .populate('performedBy', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await StockMovement.countDocuments(query);

  res.json({
    success: true,
    data: {
      movements,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Get all vendors
// @route   GET /api/inventory/vendors
// @access  Private
export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({ 
    company: req.user.company._id,
    isActive: true 
  }).sort({ name: 1 });

  res.json({
    success: true,
    data: { vendors }
  });
});

// @desc    Create vendor
// @route   POST /api/inventory/vendors
// @access  Private
export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.create({
    ...req.body,
    company: req.user.company._id
  });

  res.status(201).json({
    success: true,
    message: 'Vendor created successfully',
    data: { vendor }
  });
});

// @desc    Get all purchase orders
// @route   GET /api/inventory/purchase-orders
// @access  Private
export const getPurchaseOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = { company: req.user.company._id };
  if (status) query.status = status;

  const orders = await PurchaseOrder.find(query)
    .populate('vendor', 'name email phone')
    .populate('items.product', 'name sku')
    .sort({ orderDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await PurchaseOrder.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

// @desc    Create purchase order
// @route   POST /api/inventory/purchase-orders
// @access  Private
export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { items, ...orderData } = req.body;

  const order = await PurchaseOrder.create({
    ...orderData,
    company: req.user.company._id,
    items
  });

  res.status(201).json({
    success: true,
    message: 'Purchase order created successfully',
    data: { order }
  });
});

// @desc    Update purchase order status
// @route   PATCH /api/inventory/purchase-orders/:id
// @access  Private
export const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Purchase order not found'
    });
  }

  res.json({
    success: true,
    message: 'Purchase order updated successfully',
    data: { order }
  });
});
