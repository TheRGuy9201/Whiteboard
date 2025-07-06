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
      <AppBar position="static" color="default" elevation={1} className="whiteboard-toolbar">
        <Toolbar>
          <Box className="flex items-center">
            <Typography variant="h5" component="div" className="font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              EduBoard Pro
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box className="flex items-center gap-2">
            <IconButton onClick={toggleTheme} color="inherit" className="transition-transform hover:rotate-12">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            {currentUser ? (
              <>
                <Button 
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  className="mr-4"
                >
                  New Whiteboard
                </Button>
              
                <IconButton
                  onClick={handleUserMenuOpen}
                  color="inherit"
                  className="transition-transform hover:scale-105"
                >
                  {currentUser.photoURL ? (
                    <Avatar src={currentUser.photoURL} alt={currentUser.displayName || 'User'} sx={{ width: 40, height: 40 }} />
                  ) : (
                    <Avatar className="bg-primary-light">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    className: 'mt-2'
                  }}
                >
                  <MenuItem disabled className="bg-gray-50">
                    <Typography variant="body2">
                      Signed in as <strong>{currentUser.displayName || currentUser.email}</strong>
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} className="text-error">Logout</MenuItem>
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
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="py-12">
        <Box className="flex justify-between items-center mb-8">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800 dark:text-gray-100">
            My Whiteboards
          </Typography>
        </Box>

        {loading ? (
          <Box className="flex items-center justify-center p-12">
            <Typography>Loading whiteboards...</Typography>
          </Box>
        ) : (
          <>
            {Object.keys(groupedWhiteboards).length === 0 ? (
              <Card className="p-12 text-center bg-white dark:bg-gray-800 shadow-lg rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Box className="mb-6 flex justify-center">
                  <Box className="w-24 h-24 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
                    <AddIcon style={{ fontSize: 48 }} className="text-primary" />
                  </Box>
                </Box>
                <Typography variant="h5" gutterBottom className="font-bold">
                  Create your first whiteboard
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph className="mb-8 max-w-md mx-auto">
                  Start collaborating with your team by creating a whiteboard. You can draw, add shapes, text, and more.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  className="py-3 px-6"
                >
                  Create Whiteboard
                </Button>
              </Card>
            ) : (
              <>
                {Object.entries(groupedWhiteboards).map(([month, boards]) => (
                  <Box key={month} className="mb-12">
                    <Typography variant="h6" gutterBottom className="border-b pb-3 text-gray-700 dark:text-gray-300">
                      {month}
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
                      {boards.map((whiteboard) => (
                        <Box key={whiteboard.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
                          <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl overflow-hidden">
                            <Box 
                              className="h-24 bg-gradient-to-r from-primary-dark to-primary-light p-4 flex items-end"
                            >
                              <Typography variant="h6" component="h2" className="font-bold text-white">
                                {whiteboard.name}
                              </Typography>
                            </Box>
                            <CardContent className="flex-grow">
                              <Box className="flex justify-between items-center mb-2">
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                  Created
                                </Typography>
                                <Typography variant="body2" className="font-medium">
                                  {formatDate(whiteboard.createdAt)}
                                </Typography>
                              </Box>
                              <Box className="flex justify-between items-center">
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                                  Last edited
                                </Typography>
                                <Typography variant="body2" className="font-medium">
                                  {formatDate(whiteboard.updatedAt)}
                                </Typography>
                              </Box>
                              
                              <Box className="flex items-center mt-4">
                                <Typography variant="caption" className="text-gray-500 dark:text-gray-400 mr-2">
                                  Objects:
                                </Typography>
                                <Typography variant="body2" className="font-medium">
                                  {whiteboard.objects.length}
                                </Typography>
                              </Box>
                            </CardContent>
                            <CardActions className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                              <Button 
                                variant="contained"
                                color="primary"
                                className="flex-grow"
                                onClick={() => handleOpenWhiteboard(whiteboard.id)}
                              >
                                Open
                              </Button>
                              <IconButton size="small" className="text-gray-600 hover:text-primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" className="text-gray-600 hover:text-error">
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
        PaperProps={{
          className: 'rounded-xl'
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-primary-dark to-primary-light text-white">
          <Typography variant="h6" className="font-bold">
            Create New Whiteboard
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-6 pb-4">
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
            Give your whiteboard a descriptive name so you can easily find it later.
          </Typography>
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
            placeholder="e.g. Project Brainstorm, Math Lesson, Team Planning"
          />
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50 dark:bg-gray-900">
          <Button 
            onClick={() => setCreateDialogOpen(false)}
            className="text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateWhiteboard} 
            variant="contained" 
            color="primary"
            disabled={!newWhiteboardName.trim()}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
