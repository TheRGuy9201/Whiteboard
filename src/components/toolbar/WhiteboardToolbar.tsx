import { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Popover,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Typography
} from '@mui/material';
import {
  Create,           // Pencil
  Brush,            // Pen
  Highlight,        // Highlighter
  PanTool,          // Hand/Pan tool
  TextFields,       // Text
  Circle,           // Circle shape
  Square,           // Rectangle shape
  LinearScale,      // Line shape
  Delete,           // Eraser
  Image,            // Image insertion
  Note,             // Sticky note
  Functions,        // Math functions
  Undo,             // Undo
  Redo,             // Redo
  ColorLens,        // Color picker
  LineWeight,       // Stroke width
  MoreVert,         // More options
} from '@mui/icons-material';
import { useWhiteboard } from '../../context/WhiteboardContext';
import { DrawingTool } from '../../types';

// Colors for the color picker
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', 
  '#f3f3f3', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', 
  '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
];

const STROKE_WIDTHS = [1, 2, 3, 5, 8, 12];

const WhiteboardToolbar = () => {
  const {
    selectedTool,
    setSelectedTool,
    strokeColor,
    setStrokeColor,
    setStrokeWidth,
  } = useWhiteboard();

  // State for color picker popover
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  
  // State for stroke width popover
  const [strokeWidthAnchorEl, setStrokeWidthAnchorEl] = useState<HTMLElement | null>(null);
  
  // State for more tools menu
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | null>(null);

  // Handle tool selection
  const handleToolSelect = (tool: DrawingTool) => {
    setSelectedTool(tool);
  };

  // Handle color picker click
  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  // Handle stroke width click
  const handleStrokeWidthClick = (event: React.MouseEvent<HTMLElement>) => {
    setStrokeWidthAnchorEl(event.currentTarget);
  };

  // Handle more tools menu click
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setStrokeColor(color);
    setColorAnchorEl(null);
  };

  // Handle stroke width selection
  const handleStrokeWidthSelect = (width: number) => {
    setStrokeWidth(width);
    setStrokeWidthAnchorEl(null);
  };

  // Close color picker popover
  const handleCloseColorPicker = () => {
    setColorAnchorEl(null);
  };

  // Close stroke width popover
  const handleCloseStrokeWidthPicker = () => {
    setStrokeWidthAnchorEl(null);
  };

  // Close more tools menu
  const handleCloseMoreMenu = () => {
    setMoreAnchorEl(null);
  };

  // Check if a tool is currently selected
  const isSelected = (tool: DrawingTool) => selectedTool === tool;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Undo & Redo */}
      <Box sx={{ mr: 2, display: 'flex' }}>
        <Tooltip title="Undo">
          <IconButton size="medium">
            <Undo fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton size="medium">
            <Redo fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Main Tools */}
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Pen">
          <IconButton 
            size="medium" 
            onClick={() => handleToolSelect(DrawingTool.PENCIL)}
            color={isSelected(DrawingTool.PENCIL) ? 'primary' : 'default'}
            sx={{ 
              bgcolor: isSelected(DrawingTool.PENCIL) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              mr: 1
            }}
          >
            <Create fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Brush">
          <IconButton 
            size="medium" 
            onClick={() => handleToolSelect(DrawingTool.LINE)}
            color={isSelected(DrawingTool.LINE) ? 'primary' : 'default'}
            sx={{ 
              bgcolor: isSelected(DrawingTool.LINE) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              mr: 1
            }}
          >
            <Brush fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Highlighter">
          <IconButton 
            size="medium" 
            onClick={() => handleToolSelect(DrawingTool.HIGHLIGHTER)}
            color={isSelected(DrawingTool.HIGHLIGHTER) ? 'primary' : 'default'}
            sx={{ 
              bgcolor: isSelected(DrawingTool.HIGHLIGHTER) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              mr: 1
            }}
          >
            <Highlight fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Eraser">
          <IconButton 
            size="medium" 
            onClick={() => handleToolSelect(DrawingTool.ERASER)}
            color={isSelected(DrawingTool.ERASER) ? 'primary' : 'default'}
            sx={{ 
              bgcolor: isSelected(DrawingTool.ERASER) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              mr: 1
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* Style Tools */}
      <Box sx={{ display: 'flex' }}>
        {/* Color Picker */}
        <Tooltip title="Color">
          <IconButton 
            size="medium" 
            onClick={handleColorClick}
            sx={{ 
              mr: 1,
              position: 'relative'
            }}
          >
            <ColorLens fontSize="small" />
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                backgroundColor: strokeColor,
                position: 'absolute',
                bottom: 6,
                right: 6,
                border: '1px solid #ddd'
              }}
            />
          </IconButton>
        </Tooltip>
        
        {/* Stroke Width */}
        <Tooltip title="Stroke Width">
          <IconButton 
            size="medium" 
            onClick={handleStrokeWidthClick}
          >
            <LineWeight fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      {/* More Options Button */}
      <Tooltip title="More Tools">
        <IconButton 
          size="medium"
          onClick={handleMoreClick}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={handleCloseColorPicker}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 1, width: 220 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, px: 1 }}>
            Colors
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {COLORS.map((color) => (
              <Box 
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: color,
                  border: color === '#ffffff' ? '1px solid #ddd' : 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  '&:hover': {
                    opacity: 0.8,
                    transform: 'scale(1.1)',
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      </Popover>

      {/* Stroke Width Popover */}
      <Popover
        open={Boolean(strokeWidthAnchorEl)}
        anchorEl={strokeWidthAnchorEl}
        onClose={handleCloseStrokeWidthPicker}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Stroke Width
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {STROKE_WIDTHS.map((width) => (
              <Box 
                key={width}
                onClick={() => handleStrokeWidthSelect(width)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: width, 
                    backgroundColor: 'black', 
                    flex: 1,
                    borderRadius: width / 2
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1, minWidth: 20 }}>
                  {width}px
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Popover>

      {/* More Tools Menu */}
      <Menu
        anchorEl={moreAnchorEl}
        open={Boolean(moreAnchorEl)}
        onClose={handleCloseMoreMenu}
      >
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.TEXT);
          handleCloseMoreMenu();
        }}>
          <TextFields sx={{ mr: 1 }} fontSize="small" />
          Text
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.RECTANGLE);
          handleCloseMoreMenu();
        }}>
          <Square sx={{ mr: 1 }} fontSize="small" />
          Rectangle
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.ELLIPSE);
          handleCloseMoreMenu();
        }}>
          <Circle sx={{ mr: 1 }} fontSize="small" />
          Circle
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.LINE);
          handleCloseMoreMenu();
        }}>
          <LinearScale sx={{ mr: 1 }} fontSize="small" />
          Line
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.STICKY_NOTE);
          handleCloseMoreMenu();
        }}>
          <Note sx={{ mr: 1 }} fontSize="small" />
          Sticky Note
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.IMAGE);
          handleCloseMoreMenu();
        }}>
          <Image sx={{ mr: 1 }} fontSize="small" />
          Image
        </MenuItem>
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.LATEX);
          handleCloseMoreMenu();
        }}>
          <Functions sx={{ mr: 1 }} fontSize="small" />
          Math Formula
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleToolSelect(DrawingTool.PAN);
          handleCloseMoreMenu();
        }}>
          <PanTool sx={{ mr: 1 }} fontSize="small" />
          Pan
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default WhiteboardToolbar;
