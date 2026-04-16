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
  Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { inventoryAPI } from '../services/api';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'main',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    manager: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await inventoryAPI.getWarehouses();
      setWarehouses(response.data.data.warehouses || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.createWarehouse({
        ...formData,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        },
        contact: {
          manager: formData.manager,
          phone: formData.phone,
          email: formData.email
        }
      });
      setOpenDialog(false);
      fetchWarehouses();
      resetForm();
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'main',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      manager: '',
      phone: '',
      email: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Warehouses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Warehouses Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>City</strong></TableCell>
              <TableCell><strong>Country</strong></TableCell>
              <TableCell><strong>Manager</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No warehouses found. Click "Add Warehouse" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>{warehouse.code}</TableCell>
                  <TableCell>{warehouse.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={warehouse.type}
                      size="small"
                      color={warehouse.type === 'main' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{warehouse.address?.city || 'N/A'}</TableCell>
                  <TableCell>{warehouse.address?.country || 'N/A'}</TableCell>
                  <TableCell>{warehouse.contact?.manager || 'N/A'}</TableCell>
                  <TableCell>
                    {warehouse.contact?.phone || 'N/A'}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {warehouse.contact?.email || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={warehouse.isActive ? 'Active' : 'Inactive'}
                      color={warehouse.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Warehouse Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Warehouse</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Warehouse Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Warehouse Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g., WH-001"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                >
                  <option value="main">Main Warehouse</option>
                  <option value="regional">Regional</option>
                  <option value="local">Local</option>
                  <option value="cold_storage">Cold Storage</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manager Name"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                />
              </Grid>

              {/* Address Fields */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>

              {/* Contact Fields */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Warehouse</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Warehouses;
