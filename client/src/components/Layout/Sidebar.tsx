import { useLocation, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: [UserRole.GOD_USER, UserRole.ADMIN_USER, UserRole.VENDOR_USER],
  },
  {
    label: 'Users',
    icon: <PeopleIcon />,
    path: '/users',
    roles: [UserRole.GOD_USER, UserRole.ADMIN_USER],
  },
  {
    label: 'Vendors',
    icon: <StoreIcon />,
    path: '/vendors',
    roles: [UserRole.GOD_USER, UserRole.ADMIN_USER],
  },
  {
    label: 'Reports',
    icon: <AssessmentIcon />,
    path: '/reports',
    roles: [UserRole.GOD_USER, UserRole.ADMIN_USER, UserRole.VENDOR_USER],
  },
  {
    label: 'Profile',
    icon: <PersonIcon />,
    path: '/profile',
    roles: [UserRole.GOD_USER, UserRole.ADMIN_USER, UserRole.VENDOR_USER],
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: [UserRole.GOD_USER],
  },
];

interface SidebarProps {
  drawerWidth: number;
  collapsedWidth: number;
  mobileOpen: boolean;
  collapsed: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar = ({
  drawerWidth,
  collapsedWidth,
  mobileOpen,
  collapsed,
  isMobile,
  onClose,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const filteredItems = menuItems.filter((item) => hasRole(...item.roles));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar>
        {!collapsed && (
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.main' }}>
            ROAS PrintFast
          </Typography>
        )}
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {filteredItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { backgroundColor: 'primary.main' },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
