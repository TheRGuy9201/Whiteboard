import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Paper,
  Typography,
  Grid,
  useTheme
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  GridView,
} from '@mui/icons-material';
import { ColorPalette } from '../../types';

interface PageNavigationProps {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (index: number) => void;
}

interface ThumbnailProps {
  pageIndex: number;
  isSelected: boolean;
  onClick: () => void;
}

const PageThumbnail = ({ pageIndex, isSelected, onClick }: ThumbnailProps) => {
  const theme = useTheme();
  const colors = theme.palette.mode === 'dark' ? ColorPalette.dark : ColorPalette.light;
  
  return (
    <Paper
      onClick={onClick}
      elevation={isSelected ? 4 : 1}
      sx={{
        width: '100%',
        aspectRatio: '4/3',
        cursor: 'pointer',
        border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected ? `${colors.primary}10` : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Placeholder for the page thumbnail */}
      <Box 
        sx={{ 
          height: '70%', 
          width: '85%', 
          backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
          border: `1px solid ${colors.border}`
        }} 
      />
      <Typography variant="caption" sx={{ mt: 1 }}>
        Page {pageIndex + 1}
      </Typography>
    </Paper>
  );
};

const PageNavigation = ({ currentPageIndex, totalPages, onPageChange }: PageNavigationProps) => {
  const [thumbnailDialogOpen, setThumbnailDialogOpen] = useState(false);

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      onPageChange(currentPageIndex + 1);
    }
  };

  const toggleThumbnailDialog = () => {
    setThumbnailDialogOpen(!thumbnailDialogOpen);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Previous Page">
        <span>
          <IconButton 
            onClick={handlePreviousPage} 
            disabled={currentPageIndex === 0}
            size="small"
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title="Page Overview">
        <IconButton onClick={toggleThumbnailDialog} size="small">
          <GridView fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Typography variant="body2">
        Page {currentPageIndex + 1} of {totalPages}
      </Typography>
      
      <Tooltip title="Next Page">
        <span>
          <IconButton 
            onClick={handleNextPage} 
            disabled={currentPageIndex === totalPages - 1}
            size="small"
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Page Thumbnails Dialog */}
      <Dialog 
        open={thumbnailDialogOpen} 
        onClose={() => setThumbnailDialogOpen(false)}
        maxWidth="md"
      >
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Page Overview</Typography>
          <Grid container spacing={2}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <PageThumbnail
                  pageIndex={index}
                  isSelected={index === currentPageIndex}
                  onClick={() => {
                    onPageChange(index);
                    setThumbnailDialogOpen(false);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PageNavigation;
