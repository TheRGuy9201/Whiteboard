import { useEffect, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  useTheme,
  Drawer,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Button,
  Paper
} from '@mui/material';
import {
  MenuOutlined,
  MoreVert,
  Share,
  PictureAsPdf,
  ChatBubbleOutline,
  Close,
  LightMode,
  DarkMode,
  Add
} from '@mui/icons-material';
import Canvas from '../components/canvas/Canvas';
import WhiteboardToolbar from '../components/toolbar/WhiteboardToolbar';
import { useParams } from 'react-router-dom';
import { useWhiteboard } from '../context/WhiteboardContext';
import { useAuth } from '../context/AuthContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { ColorPalette } from '../types';
import NotebookSidebar from '../components/notebook/NotebookSidebar';
import PageNavigation from '../components/notebook/PageNavigation';

const WhiteboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loadWhiteboard, createWhiteboard, currentWhiteboard, loading, error } = useWhiteboard();
  const { currentUser } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme();
  const colors = theme.palette.mode === 'dark' ? ColorPalette.dark : ColorPalette.light;
  
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(5); // Placeholder for demo
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  
  // Width of the chat sidebar
  const chatWidth = 300;

  // Page dimensions
  const pageWidth = 850; // Standard A4 width ratio
  const pageHeight = 1100; // Standard A4 height ratio

  useEffect(() => {
    const initWhiteboard = async () => {
      try {
        if (id === 'new') {
          // Create a new whiteboard
          const name = `Notebook ${new Date().toLocaleString()}`;
          await createWhiteboard(name);
        } else if (id) {
          // Load existing whiteboard
          await loadWhiteboard(id);
        }
      } catch (err) {
        console.error('Error initializing whiteboard:', err);
        showAlert('Failed to initialize whiteboard', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      initWhiteboard();
    } else {
      setIsLoading(false);
    }
  }, [id, currentUser, createWhiteboard, loadWhiteboard]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handlePageChange = (index: number) => {
    setCurrentPageIndex(index);
    showAlert(`Navigated to Page ${index + 1}`, 'info');
  };

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleExportPDF = () => {
    showAlert('Exporting PDF...', 'info');
    handleMenuClose();
    // Implementation would go here
  };

  const handleExportImage = () => {
    showAlert('Exporting image...', 'info');
    handleMenuClose();
    // Implementation would go here
  };

  const handleShare = () => {
    showAlert('Generating share link...', 'info');
    // Implementation would go here
  };

  const handleAddPage = () => {
    setTotalPages(totalPages + 1);
    setCurrentPageIndex(totalPages);
    showAlert('Added new page', 'success');
  };

  if (!currentUser) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh' 
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body1">
          Please sign in to access the whiteboard.
        </Typography>
      </Box>
    );
  }

  if (isLoading || loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh' 
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {id === 'new' ? 'Creating new whiteboard...' : 'Loading whiteboard...'}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh',
          p: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Whiteboard
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button variant="contained" href="/dashboard">
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  if (!currentWhiteboard) {
    return (
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Whiteboard Not Found
        </Typography>
        <Typography variant="body1">
          The requested whiteboard does not exist or you don't have access to it.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      {/* Notebook Sidebar */}
      <NotebookSidebar
        open={sidebarOpen}
        onClose={toggleSidebar}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && {
            marginLeft: '280px',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          ...(chatOpen && {
            marginRight: `${chatWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        {/* Top AppBar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            backgroundColor: '#ffffff',
            borderBottom: `1px solid ${colors.border}` 
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={toggleSidebar}>
              <MenuOutlined />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ ml: 2, flexGrow: 1 }}>
              {currentWhiteboard?.name || 'Untitled Notebook'}
            </Typography>
            
            <Box sx={{ display: 'flex', ml: 2 }}>
              <Tooltip title="Share">
                <IconButton onClick={handleShare}>
                  <Share />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Toggle Chat">
                <IconButton onClick={toggleChat}>
                  <ChatBubbleOutline />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleTheme}>
                  {mode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="More Options">
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleExportPDF}>
                  <PictureAsPdf sx={{ mr: 1 }} />
                  Export as PDF
                </MenuItem>
                <MenuItem onClick={handleExportImage}>
                  <PictureAsPdf sx={{ mr: 1 }} />
                  Export as Image
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Canvas Content Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#f5f5f5',
            padding: 2,
            overflow: 'auto'
          }}
        >
          {/* Page Navigation */}
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            display: 'flex', 
            alignItems: 'center', 
            zIndex: 2
          }}>
            <PageNavigation
              currentPageIndex={currentPageIndex}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <Tooltip title="Add Page">
              <IconButton onClick={handleAddPage}>
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Centered Page Canvas */}
          <Paper 
            elevation={3}
            sx={{
              width: pageWidth,
              height: pageHeight,
              backgroundColor: '#ffffff',
              boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <Canvas />
          </Paper>
        </Box>

        {/* Bottom Toolbar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={3}
          sx={{ 
            top: 'auto', 
            bottom: 0,
            backgroundColor: '#ffffff'
          }}
        >
          <Toolbar sx={{ justifyContent: 'center', minHeight: '64px' }}>
            <WhiteboardToolbar />
          </Toolbar>
        </AppBar>
      </Box>

      {/* Chat Drawer */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={chatOpen}
        sx={{
          width: chatWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: chatWidth,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          borderBottom: `1px solid ${colors.border}` 
        }}>
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={toggleChat}>
            <Close />
          </IconButton>
        </Box>
        
        {/* Chat content would go here */}
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            Collaborate with others in real-time
          </Typography>
          {/* Chat messages would go here */}
        </Box>
      </Drawer>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WhiteboardPage;
