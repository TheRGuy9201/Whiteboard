import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Functions,
  ShowChart,
  Speed,
  Straighten,
  Circle as CircleIcon,
  Grid3x3,
  LineAxis,
} from '@mui/icons-material';
import { useWhiteboard } from '../../context/WhiteboardContext';
import { DrawingTool } from '../../types';

// Simple LaTeX preview component
const LaTeXPreview = ({ equation }: { equation: string }) => {
  return (
    <Typography sx={{ fontFamily: 'math, serif' }}>
      {equation}
    </Typography>
  );
};

const MathTools = () => {
  const { setSelectedTool } = useWhiteboard();
  const [latexDialogOpen, setLatexDialogOpen] = useState(false);
  const [functionDialogOpen, setFunctionDialogOpen] = useState(false);
  const [latexEquation, setLatexEquation] = useState('f(x) = x^2 + 2x + 1');
  const [functionExpression, setFunctionExpression] = useState('x^2');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [yMin, setYMin] = useState('-10');
  const [yMax, setYMax] = useState('10');

  const handleLatexSubmit = () => {
    // In a real implementation, we would add the LaTeX equation to the canvas
    console.log('Adding LaTeX equation:', latexEquation);
    setLatexDialogOpen(false);
    setSelectedTool(DrawingTool.LATEX);
    // Additional code to add the equation to the canvas would go here
  };

  const handleFunctionSubmit = () => {
    // In a real implementation, we would plot the function on the canvas
    console.log('Plotting function:', functionExpression, 'with range:', { xMin, xMax, yMin, yMax });
    setFunctionDialogOpen(false);
    setSelectedTool(DrawingTool.FUNCTION_PLOT);
    // Additional code to plot the function on the canvas would go here
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 1, mb: 2, borderRadius: '8px' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Math Tools
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="LaTeX Equation">
            <IconButton 
              onClick={() => setLatexDialogOpen(true)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Functions fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Function Plot">
            <IconButton 
              onClick={() => setFunctionDialogOpen(true)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <ShowChart fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Ruler">
            <IconButton 
              onClick={() => setSelectedTool(DrawingTool.RULER)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Straighten fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Protractor">
            <IconButton 
              onClick={() => setSelectedTool(DrawingTool.PROTRACTOR)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Speed fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Compass">
            <IconButton 
              onClick={() => setSelectedTool(DrawingTool.COMPASS)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <CircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Coordinate Grid">
            <IconButton 
              onClick={() => setSelectedTool(DrawingTool.GEOMETRY)} 
              size="small"
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <Grid3x3 fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* LaTeX Equation Dialog */}
      <Dialog open={latexDialogOpen} onClose={() => setLatexDialogOpen(false)}>
        <DialogTitle>Insert LaTeX Equation</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="LaTeX Equation"
              value={latexEquation}
              onChange={(e) => setLatexEquation(e.target.value)}
              multiline
              rows={2}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Typography variant="subtitle1">Preview:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <LaTeXPreview equation={latexEquation} />
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLatexDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLatexSubmit} color="primary">Insert</Button>
        </DialogActions>
      </Dialog>

      {/* Function Plot Dialog */}
      <Dialog open={functionDialogOpen} onClose={() => setFunctionDialogOpen(false)}>
        <DialogTitle>Plot Function</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Function (e.g., x^2, sin(x), etc.)"
              value={functionExpression}
              onChange={(e) => setFunctionExpression(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Range</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="x min"
                value={xMin}
                onChange={(e) => setXMin(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label="x max"
                value={xMax}
                onChange={(e) => setXMax(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="y min"
                value={yMin}
                onChange={(e) => setYMin(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label="y max"
                value={yMax}
                onChange={(e) => setYMax(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFunctionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFunctionSubmit} color="primary">Plot</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MathTools;
