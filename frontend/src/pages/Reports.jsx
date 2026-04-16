import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  AttachMoney,
  ShoppingCart
} from '@mui/icons-material';
import { financeAPI, hrAPI, inventoryAPI } from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('summary');
  const [reportData, setReportData] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    transactions: [],
    employees: [],
    products: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [financeRes, hrRes, inventoryRes] = await Promise.all([
        financeAPI.getTransactions({ limit: 50 }),
        hrAPI.getEmployees({ limit: 50 }),
        inventoryAPI.getProducts({ limit: 50 })
      ]);

      const transactions = financeRes.data.data.transactions || [];
      const employees = hrRes.data.data.employees || [];
      const products = inventoryRes.data.data.products || [];
      const totals = financeRes.data.data.totals || { income: 0, expense: 0 };

      setReportData({
        totalEmployees: employees.length,
        totalProducts: products.length,
        totalRevenue: totals.income || 0,
        totalExpenses: totals.expense || 0,
        transactions,
        employees,
        products
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfit = () => {
    return reportData.totalRevenue - reportData.totalExpenses;
  };

  const getProfitMargin = () => {
    if (reportData.totalRevenue === 0) return 0;
    return ((getProfit() / reportData.totalRevenue) * 100).toFixed(2);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          📊 Reports & Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            label="Report Type"
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="summary">Summary Report</MenuItem>
            <MenuItem value="finance">Finance Report</MenuItem>
            <MenuItem value="hr">HR Report</MenuItem>
            <MenuItem value="inventory">Inventory Report</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : (
        <>
          {/* Summary Report */}
          {reportType === 'summary' && (
            <>
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'primary.lighter' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <People sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Total Employees</Typography>
                          <Typography variant="h3" fontWeight="bold">
                            {reportData.totalEmployees}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'success.lighter' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                          <Typography variant="h3" fontWeight="bold" color="success.main">
                            ${reportData.totalRevenue.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: 'error.lighter' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingDown sx={{ fontSize: 40, color: 'error.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
                          <Typography variant="h3" fontWeight="bold" color="error.main">
                            ${reportData.totalExpenses.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: getProfit() >= 0 ? 'info.lighter' : 'warning.lighter' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingUp sx={{ fontSize: 40, color: getProfit() >= 0 ? 'info.main' : 'warning.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Profit</Typography>
                          <Typography variant="h3" fontWeight="bold" color={getProfit() >= 0 ? 'info.main' : 'warning.main'}>
                            ${getProfit().toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Margin: {getProfitMargin()}%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      📦 Inventory Summary
                    </Typography>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {reportData.totalProducts} Products
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Total products in inventory
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      👥 Workforce Summary
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {reportData.totalEmployees} Employees
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Active team members
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Finance Report */}
          {reportType === 'finance' && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                💰 Transaction Report
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportData.transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Typography
                              color={tx.type === 'income' ? 'success.main' : 'error.main'}
                              fontWeight="bold"
                            >
                              {tx.type.toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>{tx.category}</TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">
                              ${tx.amount?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{tx.status}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* HR Report */}
          {reportType === 'hr' && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                👥 Employee Report
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportData.employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell>{emp.employeeId || `EMP${emp.id}`}</TableCell>
                          <TableCell>
                            {emp.user?.firstName || 'N/A'} {emp.user?.lastName || ''}
                          </TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell>{emp.designation}</TableCell>
                          <TableCell>{emp.employmentType}</TableCell>
                          <TableCell>
                            <Typography
                              color={emp.status === 'active' ? 'success.main' : 'text.secondary'}
                              fontWeight="bold"
                            >
                              {emp.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Inventory Report */}
          {reportType === 'inventory' && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                📦 Product Inventory Report
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Cost Price</TableCell>
                      <TableCell>Selling Price</TableCell>
                      <TableCell>Tax</TableCell>
                      <TableCell>Profit Margin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportData.products.map((product) => {
                        const profit = (product.sellingPrice - product.costPrice) || 0;
                        const margin = product.costPrice > 0 
                          ? ((profit / product.costPrice) * 100).toFixed(2) 
                          : 0;
                        return (
                          <TableRow key={product.id}>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.costPrice?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Typography fontWeight="bold" color="success.main">
                                ${product.sellingPrice?.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell>{product.taxRate || 0}%</TableCell>
                            <TableCell>
                              <Typography
                                color={profit >= 0 ? 'success.main' : 'error.main'}
                                fontWeight="bold"
                              >
                                ${profit.toFixed(2)} ({margin}%)
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default Reports;
