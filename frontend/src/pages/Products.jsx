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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Add as AddIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { inventoryAPI } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    taxRate: '',
    reorderLevel: '10',
    unit: 'piece'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await inventoryAPI.getProducts();
      setProducts(response.data.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.createProduct({
        ...formData,
        costPrice: parseFloat(formData.costPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        taxRate: parseFloat(formData.taxRate) || 0,
        reorderLevel: parseInt(formData.reorderLevel) || 10
      });
      setOpenDialog(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      category: '',
      costPrice: '',
      sellingPrice: '',
      taxRate: '',
      reorderLevel: '10',
      unit: 'piece'
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
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Product
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Products</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {products.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>SKU</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Cost Price</strong></TableCell>
              <TableCell><strong>Selling Price</strong></TableCell>
              <TableCell><strong>Tax Rate</strong></TableCell>
              <TableCell><strong>Unit</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No products found. Click "Add Product" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
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
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      color={product.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., PROD-001"
              required
            />
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., Electronics, Furniture"
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cost Price"
                  name="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Selling Price"
                  name="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tax Rate (%)"
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  name="reorderLevel"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  margin="normal"
                  SelectProps={{ native: true }}
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram</option>
                  <option value="g">Gram</option>
                  <option value="l">Liter</option>
                  <option value="ml">Milliliter</option>
                  <option value="m">Meter</option>
                  <option value="cm">Centimeter</option>
                  <option value="box">Box</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Product</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products;
