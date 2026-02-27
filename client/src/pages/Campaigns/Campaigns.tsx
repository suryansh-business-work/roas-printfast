import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataTable, Column } from '../../components/Table';
import { ICampaignListItem } from '../../types/campaign.types';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import * as campaignService from '../../services/campaign.service';
import CreateCampaignDialog from './CreateCampaignDialog';

const Campaigns = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canManage = hasRole(UserRole.GOD_USER, UserRole.ADMIN_USER);

  const [rows, setRows] = useState<ICampaignListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const columns: Column<ICampaignListItem>[] = [
    { id: 'name', label: 'Campaign Name', minWidth: 180 },
    { id: 'vendorName', label: 'Vendor', minWidth: 150 },
    { id: 'currentProduct', label: 'Product', minWidth: 180 },
    { id: 'totalMailingQuantity', label: 'Total Qty', minWidth: 100 },
    { id: 'totalWeeks', label: 'Weeks', minWidth: 80 },
    {
      id: 'startDate',
      label: 'Start Date',
      minWidth: 120,
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
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
      minWidth: 80,
      render: (row) => (
        <Tooltip title="View Details">
          <IconButton size="small" onClick={() => navigate(`/campaigns/${row.campaignId}`)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await campaignService.listCampaigns({
        page: page + 1,
        limit: rowsPerPage,
        sort: sortField,
        order: sortOrder,
        search: search || undefined,
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
  }, [page, rowsPerPage, sortField, sortOrder, search]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

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
    setSnackbar({ open: true, message: 'Campaign created successfully', severity: 'success' });
    fetchCampaigns();
  };

  return (
    <Box>
      <Breadcrumb />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Campaigns</Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Campaign
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
        isLoading={isLoading}
        getRowKey={(row) => row.campaignId}
      />

      {canManage && (
        <CreateCampaignDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Campaigns;
