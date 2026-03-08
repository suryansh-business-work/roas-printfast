import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataTable, Column } from '../../components/Table';
import { IVendor } from '../../types/vendor.types';
import * as vendorService from '../../services/vendor.service';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import CreateVendorDialog from './CreateVendorDialog';

const Vendors = () => {
  const { user } = useAuth();
  const canManage = user?.role === UserRole.GOD_USER || user?.role === UserRole.ADMIN_USER;

  const [rows, setRows] = useState<IVendor[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [shownPassword, setShownPassword] = useState('');
  const [shownVendorName, setShownVendorName] = useState('');

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSendCredentials = useCallback(
    async (vendor: IVendor) => {
      try {
        const response = await vendorService.sendCredentials(vendor.vendorId);
        if (response.success) {
          showSnackbar(`Credentials sent to ${vendor.email}`, 'success');
        }
      } catch {
        showSnackbar('Failed to send credentials', 'error');
      }
    },
    [showSnackbar],
  );

  const handleShowPassword = useCallback(async (vendor: IVendor) => {
    try {
      const response = await vendorService.getVendorPassword(vendor.vendorId);
      if (response.success && response.data) {
        setShownPassword(response.data.password);
        setShownVendorName(vendor.name);
        setPasswordDialogOpen(true);
      }
    } catch {
      setShownPassword('');
      setShownVendorName(vendor.name);
      setPasswordDialogOpen(true);
    }
  }, []);

  const columns: Column<IVendor>[] = [
    { id: 'name', label: 'Name', minWidth: 150, filterable: true, filterType: 'text' },
    { id: 'email', label: 'Email', minWidth: 200, filterable: true, filterType: 'text' },
    { id: 'phone', label: 'Phone', minWidth: 130, filterable: true, filterType: 'text' },
    {
      id: 'contactPerson',
      label: 'Contact Person',
      minWidth: 150,
      filterable: true,
      filterType: 'text',
    },
    { id: 'city', label: 'City', minWidth: 120, filterable: true, filterType: 'text' },
    { id: 'state', label: 'State', minWidth: 100, filterable: true, filterType: 'text' },
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
          size="small"
          color={row.isActive ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      minWidth: 120,
      render: (row) =>
        canManage ? (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Send Credentials">
              <IconButton size="small" onClick={() => handleSendCredentials(row)}>
                <SendIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Show Password">
              <IconButton size="small" onClick={() => handleShowPassword(row)}>
                <VisibilityIcon fontSize="small" color="info" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null,
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await vendorService.listVendors({
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder,
        search: search || undefined,
        filters,
      });
      if (response.success && response.data) {
        setRows(response.data.items);
        setTotalItems(response.data.totalItems);
      }
    } catch {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, sortField, sortOrder, search, filters]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    showSnackbar('Vendor created successfully', 'success');
    fetchVendors();
  };

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Vendors</Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Vendor
          </Button>
        )}
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
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
        getRowKey={(row) => row.vendorId}
      />

      {canManage && (
        <CreateVendorDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Vendor Password - {shownVendorName}</DialogTitle>
        <DialogContent>
          {shownPassword ? (
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace',
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                textAlign: 'center',
                mt: 1,
              }}
            >
              {shownPassword}
            </Typography>
          ) : (
            <Typography color="error" sx={{ mt: 1 }}>
              No stored credentials found for this vendor.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Vendors;
