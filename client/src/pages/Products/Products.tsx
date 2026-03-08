import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DataTable, Column } from '../../components/Table';
import { Breadcrumb } from '../../components/Breadcrumb';
import { IProduct } from '../../types/product.types';
import * as productService from '../../services/product.service';
import CreateProductDialog from './CreateProductDialog';

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productService.listProducts({
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder,
        search: search || undefined,
        filters,
      });
      if (response.success && response.data) {
        setProducts(response.data.items);
        setTotalItems(response.data.totalItems);
      }
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, search, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleActive = useCallback(
    async (product: IProduct) => {
      try {
        if (product.isActive) {
          await productService.deactivateProduct(product.productId);
        } else {
          await productService.activateProduct(product.productId);
        }
        fetchProducts();
      } catch {
        // Error handled silently
      }
    },
    [fetchProducts],
  );

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
    },
    [sortField],
  );

  const columns: Column<IProduct>[] = [
    { id: 'name', label: 'Name', filterable: true, filterType: 'text', minWidth: 150 },
    { id: 'description', label: 'Description', sortable: false, minWidth: 200 },
    { id: 'vendorName', label: 'Vendor', sortable: false, minWidth: 120 },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
      render: (row) => (
        <Chip
          label={row.isActive ? 'Active' : 'Inactive'}
          color={row.isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      minWidth: 80,
      render: (row) => (
        <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
          <IconButton size="small" onClick={() => handleToggleActive(row)}>
            {row.isActive ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Products & Services</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add Product
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={products}
        totalItems={totalItems}
        page={page}
        rowsPerPage={rowsPerPage}
        sortField={sortField}
        sortOrder={sortOrder}
        searchValue={search}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setPage(0);
        }}
        onSortChange={handleSortChange}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(0);
        }}
        filters={filters}
        onFiltersChange={(f) => {
          setFilters(f);
          setPage(0);
        }}
        isLoading={isLoading}
        getRowKey={(row) => row.productId}
      />
      <CreateProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchProducts}
      />
    </Box>
  );
};

export default Products;
