import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updatePermissions: (id, permissions) => api.put(`/users/${id}/permissions`, permissions)
};

// Company API
export const companyAPI = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  getMyCompany: () => api.get('/companies/me/company'),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  updateSettings: (id, data) => api.put(`/companies/${id}/settings`, data),
  delete: (id) => api.delete(`/companies/${id}`)
};

// Finance API
export const financeAPI = {
  // Transactions
  getTransactions: (params) => api.get('/finance/transactions', { params }),
  createTransaction: (data) => api.post('/finance/transactions', data),
  getTransaction: (id) => api.get(`/finance/transactions/${id}`),
  updateTransaction: (id, data) => api.put(`/finance/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/finance/transactions/${id}`),
  
  // Accounts
  getAccounts: () => api.get('/finance/accounts'),
  createAccount: (data) => api.post('/finance/accounts', data),
  getAccountSummary: () => api.get('/finance/accounts/summary'),
  
  // Invoices
  getInvoices: (params) => api.get('/finance/invoices', { params }),
  createInvoice: (data) => api.post('/finance/invoices', data),
  getInvoice: (id) => api.get(`/finance/invoices/${id}`),
  updateInvoiceStatus: (id, data) => api.patch(`/finance/invoices/${id}/status`, data)
};

// HR API
export const hrAPI = {
  // Employees
  getEmployees: (params) => api.get('/hr/employees', { params }),
  createEmployee: (data) => api.post('/hr/employees', data),
  getEmployee: (id) => api.get(`/hr/employees/${id}`),
  updateEmployee: (id, data) => api.put(`/hr/employees/${id}`, data),
  
  // Attendance
  checkIn: (data) => api.post('/hr/attendance/check-in', data),
  checkOut: (data) => api.post('/hr/attendance/check-out', data),
  getAttendance: (params) => api.get('/hr/attendance', { params }),
  
  // Leave
  getLeaves: (params) => api.get('/hr/leave', { params }),
  applyLeave: (data) => api.post('/hr/leave', data),
  updateLeave: (id, data) => api.patch(`/hr/leave/${id}`, data),
  
  // Payroll
  getPayroll: (params) => api.get('/hr/payroll', { params }),
  generatePayroll: (data) => api.post('/hr/payroll', data)
};

// Inventory API
export const inventoryAPI = {
  // Products
  getProducts: (params) => api.get('/inventory/products', { params }),
  createProduct: (data) => api.post('/inventory/products', data),
  getProduct: (id) => api.get(`/inventory/products/${id}`),
  updateProduct: (id, data) => api.put(`/inventory/products/${id}`, data),
  
  // Warehouses
  getWarehouses: () => api.get('/inventory/warehouses'),
  createWarehouse: (data) => api.post('/inventory/warehouses', data),
  
  // Inventory Levels
  getInventoryLevels: (params) => api.get('/inventory/levels', { params }),
  updateInventory: (id, data) => api.put(`/inventory/levels/${id}`, data),
  
  // Stock Movements
  getStockMovements: (params) => api.get('/inventory/movements', { params }),
  recordMovement: (data) => api.post('/inventory/movements', data),
  
  // Vendors
  getVendors: () => api.get('/inventory/vendors'),
  createVendor: (data) => api.post('/inventory/vendors', data),
  
  // Purchase Orders
  getPurchaseOrders: (params) => api.get('/inventory/purchase-orders', { params }),
  createPurchaseOrder: (data) => api.post('/inventory/purchase-orders', data),
  updatePurchaseOrder: (id, data) => api.patch(`/inventory/purchase-orders/${id}`, data)
};

export default api;
