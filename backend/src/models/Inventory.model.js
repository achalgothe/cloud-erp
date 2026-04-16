import mongoose from 'mongoose';

// Product/Item Schema
const productSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  brand: String,
  unit: {
    type: String,
    default: 'piece'
  },
  costPrice: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  images: [String],
  specifications: {
    type: Map,
    of: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Inventory/Warehouse Schema
const inventorySchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  reservedQuantity: {
    type: Number,
    default: 0
  },
  availableQuantity: {
    type: Number,
    default: 0
  },
  location: {
    zone: String,
    aisle: String,
    rack: String,
    shelf: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Warehouse Schema
const warehouseSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['main', 'regional', 'local', 'cold_storage'],
    default: 'main'
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  contact: {
    manager: String,
    phone: String,
    email: String
  },
  capacity: {
    total: Number,
    used: Number,
    unit: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Stock Movement Schema
const stockMovementSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out', 'transfer', 'adjustment', 'return'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reference: {
    type: String
  },
  referenceType: {
    type: String,
    enum: ['purchase_order', 'sales_order', 'transfer', 'adjustment', 'return']
  },
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  toWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Purchase Order Schema
const purchaseOrderSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedDelivery: {
    type: Date,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    unitPrice: Number,
    amount: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'received', 'cancelled'],
    default: 'draft'
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  notes: String
}, {
  timestamps: true
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  contactPerson: String,
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  taxInfo: {
    gstin: String,
    pan: String
  },
  paymentTerms: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Warehouse = mongoose.model('Warehouse', warehouseSchema);
const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);

export { Product, Inventory, Warehouse, StockMovement, PurchaseOrder, Vendor };
