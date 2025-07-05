import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';
import { useWhiteboard } from '../context/WhiteboardContext';
import { useTheme } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { BackgroundType, UserRole } from '../types';

// Define the WhiteboardObject interface locally to avoid import issues
interface WhiteboardObject {
  id: string;
  type: string;
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any; // Will contain fabric.js or Konva object data
}

// Define the Whiteboard interface locally to avoid import issues
interface Whiteboard {
  id: string;
  name: string;
  ownerId: string;
  background: BackgroundType;
  objects: WhiteboardObject[];
  collaborators: {
    [userId: string]: {
      role: UserRole;
      lastActive: number;
    }
  };
  createdAt: number;
  updatedAt: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { whiteboards, createWhiteboard, loading } = useWhiteboard();
  const { mode, toggleTheme } = useTheme();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newWhiteboardName, setNewWhiteboardName] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleCreateWhiteboard = async () => {
    if (newWhiteboardName.trim() === '') return;
    
    try {
      const whiteboardId = await createWhiteboard(newWhiteboardName);
      setCreateDialogOpen(false);
      setNewWhiteboardName('');
      navigate(`/whiteboard/${whiteboardId}`);
    } catch (err) {
      console.error('Error creating whiteboard:', err);
    }
  };

  const handleOpenWhiteboard = (id: string) => {
    navigate(`/whiteboard/${id}`);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await signOut();
    navigate('/login');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Group whiteboards by month
  const getGroupedWhiteboards = (): Record<string, Whiteboard[]> => {
    const grouped: Record<string, Whiteboard[]> = {};
    
    whiteboards.forEach(whiteboard => {
      const date = new Date(whiteboard.createdAt);
      const month = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!grouped[month]) {
        grouped[month] = [];
      }
      
      grouped[month].push(whiteboard);
    });
    
    return grouped;
  };

  const groupedWhiteboards = getGroupedWhiteboards();

  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EduBoard Pro
          </Typography>
          
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          
          {currentUser ? (
            <>
              <IconButton
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                {currentUser.photoURL ? (
                  <Avatar src={currentUser.photoURL} alt={currentUser.displayName || 'User'} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as <strong>{currentUser.displayName || currentUser.email}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="primary"
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h1" className="font-bold">
            My Whiteboards
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Whiteboard
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading whiteboards...</Typography>
        ) : (
          <>
            {Object.keys(groupedWhiteboards).length === 0 ? (
              <Card className="p-8 text-center">
                <Typography variant="h6" gutterBottom>
                  You don't have any whiteboards yet
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Create your first whiteboard to get started.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create Whiteboard
                </Button>
              </Card>
            ) : (
              <>
                {Object.entries(groupedWhiteboards).map(([month, boards]) => (
                  <Box key={month} className="mb-8">
                    <Typography variant="h6" gutterBottom className="border-b pb-2">
                      {month}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                      {boards.map((whiteboard) => (
                        <Box key={whiteboard.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                            <CardContent className="flex-grow">
                              <Typography variant="h6" component="h2" noWrap>
                                {whiteboard.name}
                              </Typography>
                              <Typography color="textSecondary" variant="body2">
                                Created: {formatDate(whiteboard.createdAt)}
                              </Typography>
                              <Typography color="textSecondary" variant="body2">
                                Last edited: {formatDate(whiteboard.updatedAt)}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button 
                                size="small" 
                                onClick={() => handleOpenWhiteboard(whiteboard.id)}
                              >
                                Open
                              </Button>
                              <IconButton size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </Container>

      {/* Create Whiteboard Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Whiteboard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Whiteboard Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newWhiteboardName}
            onChange={(e) => setNewWhiteboardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateWhiteboard} 
            variant="contained" 
            color="primary"
            disabled={!newWhiteboardName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
