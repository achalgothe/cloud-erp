import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import { Add as AddIcon, Visibility, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { financeAPI } from '../services/api';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 0,
    status: 'draft'
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await financeAPI.getInvoices();
      setInvoices(response.data.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await financeAPI.createInvoice(formData);
      setOpenDialog(false);
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      customer: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 0,
      status: 'draft'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = parseFloat(newItems[index].quantity) * parseFloat(newItems[index].unitPrice);
    }
    
    const subtotal = newItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount - formData.discount;
    
    setFormData({
      ...formData,
      items: newItems,
      subtotal,
      taxAmount,
      total
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      sent: 'info',
      paid: 'success',
      overdue: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Invoices Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Invoice #</strong></TableCell>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Issue Date</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No invoices found. Click "Create Invoice" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customer?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ${invoice.total?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Invoice Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Invoice</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              {/* Line Items */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Line Items
                </Typography>
                {formData.items.map((item, index) => (
                  <Grid container spacing={1} key={index} mb={1}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        size="small"
                        value={`$${item.amount?.toFixed(2)}`}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button onClick={addItem} size="small" variant="outlined">
                  + Add Item
                </Button>
              </Grid>

              {/* Totals */}
              <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Subtotal"
                      value={`$${formData.subtotal?.toFixed(2)}`}
                      InputProps={{ readOnly: true }}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Tax Rate (%)"
                      name="taxRate"
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 0;
                        const taxAmount = (formData.subtotal * rate) / 100;
                        const total = formData.subtotal + taxAmount - formData.discount;
                        setFormData({ ...formData, taxRate: rate, taxAmount, total });
                      }}
                      margin="normal"
                      inputProps={{ min: 0, step: 0.1 }}
                    />
                    <TextField
                      fullWidth
                      label="Discount"
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const total = formData.subtotal + formData.taxAmount - discount;
                        setFormData({ ...formData, discount, total });
                      }}
                      margin="normal"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField
                      fullWidth
                      label="Total"
                      value={`$${formData.total?.toFixed(2)}`}
                      InputProps={{ readOnly: true }}
                      margin="normal"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Invoice</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Invoices;
