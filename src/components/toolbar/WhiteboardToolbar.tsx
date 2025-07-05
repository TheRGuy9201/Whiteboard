import { useState } from 'react';
import {
  Brush,
  Create,
  PanTool,
  Highlight,
  TextFields,
  Gesture,
  Delete,
  Circle,
  Square,
  LinearScale,
  Note,
  Image,
  Functions,
  GridOn,
  Tune,
  Download,
  Save,
  Undo,
  Redo,
  NightsStay,
  LightMode
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Box,
  Divider,
  Popover,
  Slider,
  Typography,
  Paper
} from '@mui/material';
import { useWhiteboard } from '../../context/WhiteboardContext';
import { useTheme } from '../../context/ThemeContext';
import { DrawingTool, BackgroundType } from '../../types';

const WhiteboardToolbar = () => {
  const {
    selectedTool,
    setSelectedTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    fillColor,
    setFillColor,
    opacity,
    setOpacity,
    setBackground,
    saveWhiteboard
  } = useWhiteboard();

  const { mode, toggleTheme } = useTheme();

  // State for color picker popover
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const [colorType, setColorType] = useState<'stroke' | 'fill'>('stroke');
  
  // State for stroke width popover
  const [strokeWidthAnchorEl, setStrokeWidthAnchorEl] = useState<HTMLElement | null>(null);
  
  // State for opacity popover
  const [opacityAnchorEl, setOpacityAnchorEl] = useState<HTMLElement | null>(null);
  
  // State for background popover
  const [backgroundAnchorEl, setBackgroundAnchorEl] = useState<HTMLElement | null>(null);

  const handleToolSelect = (tool: DrawingTool) => {
    setSelectedTool(tool);
  };

  const handleStrokeColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorType('stroke');
    setColorAnchorEl(event.currentTarget);
  };

  const handleFillColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorType('fill');
    setColorAnchorEl(event.currentTarget);
  };

  const handleStrokeWidthClick = (event: React.MouseEvent<HTMLElement>) => {
    setStrokeWidthAnchorEl(event.currentTarget);
  };

  const handleOpacityClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpacityAnchorEl(event.currentTarget);
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLElement>) => {
    setBackgroundAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleStrokeWidthClose = () => {
    setStrokeWidthAnchorEl(null);
  };

  const handleOpacityClose = () => {
    setOpacityAnchorEl(null);
  };

  const handleBackgroundClose = () => {
    setBackgroundAnchorEl(null);
  };

  const handleColorChange = (color: string) => {
    if (colorType === 'stroke') {
      setStrokeColor(color);
    } else {
      setFillColor(color);
    }
    handleColorClose();
  };

  const handleStrokeWidthChange = (_event: Event, newValue: number | number[]) => {
    setStrokeWidth(newValue as number);
  };

  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const handleBackgroundChange = (type: BackgroundType) => {
    setBackground(type);
    handleBackgroundClose();
  };

  const handleSave = async () => {
    try {
      await saveWhiteboard();
      // Could show a success toast here
      console.log('Whiteboard saved successfully');
    } catch (error) {
      // Could show an error toast here
      console.error('Error saving whiteboard:', error);
    }
  };

  // Common colors
  const colorOptions = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff'
  ];

  // Keyboard shortcuts
  const keyboardShortcuts: Record<string, DrawingTool> = {
    'p': DrawingTool.PENCIL,
    'l': DrawingTool.LINE,
    'r': DrawingTool.RECTANGLE,
    'c': DrawingTool.ELLIPSE,
    't': DrawingTool.TEXT,
    'n': DrawingTool.STICKY_NOTE,
    'h': DrawingTool.HIGHLIGHTER,
    'e': DrawingTool.ERASER,
    's': DrawingTool.SELECT,
    'v': DrawingTool.PAN,
  };

  // Set up keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return; // Don't trigger shortcuts when typing in inputs
    }
    
    const key = e.key.toLowerCase();
    if (keyboardShortcuts[key]) {
      setSelectedTool(keyboardShortcuts[key]);
      e.preventDefault();
    }
  });

  return (
    <AppBar position="static" color="default" elevation={1} className="whiteboard-toolbar">
      <Toolbar variant="dense" className="flex justify-between">
        {/* Drawing Tools */}
        <Box className="flex items-center space-x-1">
          <Tooltip title="Pencil (P)">
            <IconButton 
              color={selectedTool === DrawingTool.PENCIL ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.PENCIL)}
            >
              <Create />
            </IconButton>
          </Tooltip>
          <Tooltip title="Line (L)">
            <IconButton 
              color={selectedTool === DrawingTool.LINE ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.LINE)}
            >
              <LinearScale />
            </IconButton>
          </Tooltip>
          <Tooltip title="Rectangle (R)">
            <IconButton 
              color={selectedTool === DrawingTool.RECTANGLE ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.RECTANGLE)}
            >
              <Square />
            </IconButton>
          </Tooltip>
          <Tooltip title="Circle (C)">
            <IconButton 
              color={selectedTool === DrawingTool.ELLIPSE ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.ELLIPSE)}
            >
              <Circle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Text (T)">
            <IconButton 
              color={selectedTool === DrawingTool.TEXT ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.TEXT)}
            >
              <TextFields />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sticky Note (N)">
            <IconButton 
              color={selectedTool === DrawingTool.STICKY_NOTE ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.STICKY_NOTE)}
            >
              <Note />
            </IconButton>
          </Tooltip>
          <Tooltip title="Image">
            <IconButton 
              color={selectedTool === DrawingTool.IMAGE ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.IMAGE)}
            >
              <Image />
            </IconButton>
          </Tooltip>
          <Tooltip title="LaTeX">
            <IconButton 
              color={selectedTool === DrawingTool.LATEX ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.LATEX)}
            >
              <Functions />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          <Tooltip title="Highlighter (H)">
            <IconButton 
              color={selectedTool === DrawingTool.HIGHLIGHTER ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.HIGHLIGHTER)}
            >
              <Highlight />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eraser (E)">
            <IconButton 
              color={selectedTool === DrawingTool.ERASER ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.ERASER)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title="Select (S)">
            <IconButton 
              color={selectedTool === DrawingTool.SELECT ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.SELECT)}
            >
              <Gesture />
            </IconButton>
          </Tooltip>
          <Tooltip title="Pan (V)">
            <IconButton 
              color={selectedTool === DrawingTool.PAN ? 'primary' : 'default'}
              onClick={() => handleToolSelect(DrawingTool.PAN)}
            >
              <PanTool />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Style Controls */}
        <Box className="flex items-center space-x-1">
          <Tooltip title="Stroke Color">
            <IconButton onClick={handleStrokeColorClick}>
              <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: strokeColor }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fill Color">
            <IconButton onClick={handleFillColorClick}>
              <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: fillColor }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stroke Width">
            <IconButton onClick={handleStrokeWidthClick}>
              <Brush />
            </IconButton>
          </Tooltip>
          <Tooltip title="Opacity">
            <IconButton onClick={handleOpacityClick}>
              <Tune />
            </IconButton>
          </Tooltip>
          <Tooltip title="Background">
            <IconButton onClick={handleBackgroundClick}>
              <GridOn />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          <Tooltip title="Undo">
            <IconButton>
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton>
              <Redo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton onClick={handleSave}>
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton onClick={toggleTheme}>
              {mode === 'light' ? <NightsStay /> : <LightMode />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Color Picker Popover */}
        <Popover
          open={Boolean(colorAnchorEl)}
          anchorEl={colorAnchorEl}
          onClose={handleColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper className="p-4">
            <Typography variant="subtitle1" className="mb-2">
              {colorType === 'stroke' ? 'Stroke Color' : 'Fill Color'}
            </Typography>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </Paper>
        </Popover>

        {/* Stroke Width Popover */}
        <Popover
          open={Boolean(strokeWidthAnchorEl)}
          anchorEl={strokeWidthAnchorEl}
          onClose={handleStrokeWidthClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper className="p-4 w-64">
            <Typography variant="subtitle1" gutterBottom>
              Stroke Width
            </Typography>
            <Slider
              value={strokeWidth}
              min={1}
              max={20}
              step={1}
              onChange={handleStrokeWidthChange}
              valueLabelDisplay="auto"
            />
          </Paper>
        </Popover>

        {/* Opacity Popover */}
        <Popover
          open={Boolean(opacityAnchorEl)}
          anchorEl={opacityAnchorEl}
          onClose={handleOpacityClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper className="p-4 w-64">
            <Typography variant="subtitle1" gutterBottom>
              Opacity
            </Typography>
            <Slider
              value={opacity}
              min={0.1}
              max={1}
              step={0.1}
              onChange={handleOpacityChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            />
          </Paper>
        </Popover>

        {/* Background Popover */}
        <Popover
          open={Boolean(backgroundAnchorEl)}
          anchorEl={backgroundAnchorEl}
          onClose={handleBackgroundClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper className="p-4">
            <Typography variant="subtitle1" className="mb-2">
              Background
            </Typography>
            <div className="flex flex-col space-y-2">
              <button
                className="py-1 px-2 rounded hover:bg-gray-200"
                onClick={() => handleBackgroundChange(BackgroundType.PLAIN)}
              >
                Plain
              </button>
              <button
                className="py-1 px-2 rounded hover:bg-gray-200"
                onClick={() => handleBackgroundChange(BackgroundType.GRID)}
              >
                Grid
              </button>
              <button
                className="py-1 px-2 rounded hover:bg-gray-200"
                onClick={() => handleBackgroundChange(BackgroundType.RULED)}
              >
                Ruled
              </button>
              <button
                className="py-1 px-2 rounded hover:bg-gray-200"
                onClick={() => handleBackgroundChange(BackgroundType.DOTTED)}
              >
                Dotted
              </button>
            </div>
          </Paper>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default WhiteboardToolbar;
