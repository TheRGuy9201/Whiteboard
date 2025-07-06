import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { WhiteboardProvider } from './context/WhiteboardContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ColorPalette } from './types';
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
  const colors = mode === 'light' ? ColorPalette.light : ColorPalette.dark;
  
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      error: {
        main: colors.error,
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
      background: {
        default: colors.background,
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
          {/* Splash screen at the root path */}
          <Route path="/" element={<SplashScreen />} />
          {/* Dashboard page */}
          <Route path="/dashboard" element={<DashboardPage />} />
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
