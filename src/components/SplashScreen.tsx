import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SplashScreenProps {
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ duration = 2000 }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, duration / 10);
    
    // Redirect after duration
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, duration);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, navigate]);

  return (
    <Box 
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-dark to-primary-light"
    >
      <Box className="mb-8 text-center">
        <Typography variant="h1" className="text-white mb-4 text-6xl font-bold">
          EduBoard Pro
        </Typography>
        <Typography variant="h3" className="text-white mb-8 font-light">
          Interactive Collaborative Whiteboard
        </Typography>
        
        <Box className="relative h-4 w-64 bg-white bg-opacity-20 rounded-full overflow-hidden mt-8">
          <Box 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </Box>
        
        <Typography variant="body1" className="text-white mt-4">
          {progress < 100 ? 'Loading...' : 'Ready!'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SplashScreen;
