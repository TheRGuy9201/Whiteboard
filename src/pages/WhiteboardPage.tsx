import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Canvas from '../components/canvas/Canvas';
import WhiteboardToolbar from '../components/toolbar/WhiteboardToolbar';
import { useParams } from 'react-router-dom';
import { useWhiteboard } from '../context/WhiteboardContext';
import { useAuth } from '../context/AuthContext';

const WhiteboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loadWhiteboard, createWhiteboard, currentWhiteboard, loading, error } = useWhiteboard();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initWhiteboard = async () => {
      try {
        if (id === 'new') {
          // Create a new whiteboard
          const name = `Whiteboard ${new Date().toLocaleString()}`;
          await createWhiteboard(name);
        } else if (id) {
          // Load existing whiteboard
          await loadWhiteboard(id);
        }
      } catch (err) {
        console.error('Error initializing whiteboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      initWhiteboard();
    } else {
      setIsLoading(false);
    }
  }, [id, currentUser]);

  if (!currentUser) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        height="100vh"
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
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          {id === 'new' ? 'Creating new whiteboard...' : 'Loading whiteboard...'}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!currentWhiteboard) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        height="100vh"
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
    <Box className="h-screen flex flex-col">
      <WhiteboardToolbar />
      <Box className="flex-grow relative">
        <Canvas />
      </Box>
    </Box>
  );
};

export default WhiteboardPage;
