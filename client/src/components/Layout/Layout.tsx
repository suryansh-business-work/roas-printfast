import { useState } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(isTablet);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const currentDrawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header drawerWidth={isMobile ? 0 : currentDrawerWidth} onMenuClick={handleDrawerToggle} />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        isMobile={isMobile}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: isMobile ? 0 : `${currentDrawerWidth}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: isMobile ? '100%' : `calc(100% - ${currentDrawerWidth}px)`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
