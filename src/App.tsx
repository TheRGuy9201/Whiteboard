import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { WhiteboardProvider } from './context/WhiteboardContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import DashboardPage from './pages/DashboardPage';
import WhiteboardPage from './pages/WhiteboardPage';

// App with context providers
const AppWithProviders = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WhiteboardProvider>
          <AppContent />
        </WhiteboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// App content with Material UI theme
const AppContent = () => {
  const { mode } = useTheme();
  
  // Create Material UI theme based on mode
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#5048E5',
      },
      secondary: {
        main: '#10B981',
      },
      background: {
        default: mode === 'light' ? '#F9FAFC' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            color: mode === 'light' ? '#111927' : '#FFFFFF',
          },
        },
      },
    },
  });

  // Apply theme class to body
  useEffect(() => {
    document.body.className = mode === 'dark' ? 'dark' : 'light';
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Direct access to dashboard without authentication */}
          <Route path="/" element={<DashboardPage />} />
          {/* Whiteboard page without protection */}
          <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
};

const App = () => {
  return <AppWithProviders />;
};

export default App;
