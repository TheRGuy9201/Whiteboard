import { useEffect, useRef, useState } from 'react';
import { useWhiteboard } from '../../context/WhiteboardContext';
import { DrawingTool } from '../../types';

// Add type definitions to the fabric namespace
declare global {
  interface Window {
    fabric?: any;
  }
}

// Define WhiteboardObject interface locally to avoid import issues
interface WhiteboardObject {
  id: string;
  type: string;
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any; // Will contain fabric.js or Konva object data
}

// Define Position interface locally to avoid import issues
interface Position {
  x: number;
  y: number;
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState<Position | null>(null);
  
  const {
    currentWhiteboard,
    selectedTool,
    strokeColor,
    strokeWidth,
    fillColor,
    opacity,
    addObject,
    updateObject,
    updateCursorPosition,
  } = useWhiteboard();

  // Initialize fabric canvas on mount
  useEffect(() => {
    if (canvasRef.current && !fabricCanvas && window.fabric) {
      const canvas = new window.fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
        width: window.innerWidth,
        height: window.innerHeight - 64, // Subtract toolbar height
        backgroundColor: '#ffffff'
      });

      // Set up canvas for free drawing
      const freeDrawingBrush = canvas.freeDrawingBrush;
      freeDrawingBrush.color = strokeColor;
      freeDrawingBrush.width = strokeWidth;

      // Event listeners for canvas resize
      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 64
        });
        canvas.renderAll();
      };

      window.addEventListener('resize', handleResize);
      setFabricCanvas(canvas);

      // Update cursor position on mouse move
      canvas.on('mouse:move', (options: {e: MouseEvent; pointer: Position}) => {
        const pointer = canvas.getPointer(options.e);
        updateCursorPosition({ x: pointer.x, y: pointer.y });
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.dispose();
      };
    }
  }, [canvasRef]);

  // Update canvas settings when selectedTool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    // Reset canvas mode
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    
    // Configure based on selected tool
    switch (selectedTool) {
      case DrawingTool.PENCIL:
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = strokeColor;
        fabricCanvas.freeDrawingBrush.width = strokeWidth;
        break;
      case DrawingTool.HIGHLIGHTER:
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = `${strokeColor}80`; // 50% opacity
        fabricCanvas.freeDrawingBrush.width = strokeWidth * 3; // Wider for highlighter
        break;
      case DrawingTool.ERASER:
        // TODO: Implement eraser logic
        break;
      case DrawingTool.SELECT:
        fabricCanvas.selection = true;
        break;
      case DrawingTool.PAN:
        fabricCanvas.selection = false;
        // Pan tool will be handled in mouse events
        break;
      default:
        break;
    }
    
    fabricCanvas.renderAll();
  }, [selectedTool, strokeColor, strokeWidth, fabricCanvas]);

  // Handle mouse down event
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!fabricCanvas || selectedTool === DrawingTool.PENCIL || selectedTool === DrawingTool.HIGHLIGHTER) {
      return; // Fabric.js handles these modes internally
    }

    setIsDrawing(true);
    const pointer = fabricCanvas.getPointer(e.nativeEvent);
    setLastPointerPosition({ x: pointer.x, y: pointer.y });

    if (selectedTool === DrawingTool.RECTANGLE) {
      const rect = new window.fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        fill: fillColor,
        opacity: opacity,
        selectable: true
      });
      
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (selectedTool === DrawingTool.ELLIPSE) {
      const circle = new window.fabric.Ellipse({
        left: pointer.x,
        top: pointer.y,
        rx: 0,
        ry: 0,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        fill: fillColor,
        opacity: opacity,
        selectable: true
      });
      
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (selectedTool === DrawingTool.LINE) {
      const line = new window.fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        opacity: opacity,
        selectable: true
      });
      
      fabricCanvas.add(line);
      fabricCanvas.setActiveObject(line);
    } else if (selectedTool === DrawingTool.PAN) {
      fabricCanvas.setCursor('grab');
      fabricCanvas.renderAll();
    }
  };

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!fabricCanvas || !isDrawing || !lastPointerPosition) {
      return;
    }

    const pointer = fabricCanvas.getPointer(e.nativeEvent);
    const activeObject = fabricCanvas.getActiveObject();

    if (selectedTool === DrawingTool.RECTANGLE && window.fabric && activeObject instanceof window.fabric.Rect) {
      const width = pointer.x - lastPointerPosition.x;
      const height = pointer.y - lastPointerPosition.y;
      
      // Handle negative dimensions (when drawing from right to left or bottom to top)
      if (width < 0) {
        activeObject.set({ left: pointer.x });
      }
      if (height < 0) {
        activeObject.set({ top: pointer.y });
      }
      
      activeObject.set({
        width: Math.abs(width),
        height: Math.abs(height)
      });
      activeObject.setCoords();
    } else if (selectedTool === DrawingTool.ELLIPSE && window.fabric && activeObject instanceof window.fabric.Ellipse) {
      const rx = Math.abs(pointer.x - lastPointerPosition.x) / 2;
      const ry = Math.abs(pointer.y - lastPointerPosition.y) / 2;
      
      if (rx > 0) {
        activeObject.set({
          rx: rx,
          left: lastPointerPosition.x - rx + (pointer.x > lastPointerPosition.x ? rx : -rx)
        });
      }
      
      if (ry > 0) {
        activeObject.set({
          ry: ry,
          top: lastPointerPosition.y - ry + (pointer.y > lastPointerPosition.y ? ry : -ry)
        });
      }
      
      activeObject.setCoords();
    } else if (selectedTool === DrawingTool.LINE && window.fabric && activeObject instanceof window.fabric.Line) {
      activeObject.set({
        x2: pointer.x,
        y2: pointer.y
      });
      activeObject.setCoords();
    } else if (selectedTool === DrawingTool.PAN) {
      const vpt = fabricCanvas.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += pointer.x - lastPointerPosition.x;
      vpt[5] += pointer.y - lastPointerPosition.y;
      
      fabricCanvas.requestRenderAll();
      setLastPointerPosition({ x: pointer.x, y: pointer.y });
    }

    fabricCanvas.renderAll();
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPointerPosition(null);

    if (fabricCanvas) {
      fabricCanvas.setCursor('default');
      const activeObject = fabricCanvas.getActiveObject();
      
      if (activeObject && !activeObject.data?.saved) {
        // Save the object to our state
        const objectJSON = activeObject.toJSON();
        const objectData: Omit<WhiteboardObject, 'id' | 'createdBy' | 'createdAt'> = {
          type: activeObject.type || 'unknown',
          properties: objectJSON
        };

        addObject(objectData).then(id => {
          // Mark the object as saved in the canvas to avoid duplicating it
          activeObject.data = { ...activeObject.data, id, saved: true };
        });
      }
    }
  };

  // Load objects from whiteboard state
  useEffect(() => {
    if (!fabricCanvas || !currentWhiteboard) return;

    // Clear canvas
    fabricCanvas.clear();
    
    // Load all objects from whiteboard data
    currentWhiteboard.objects.forEach(obj => {
      if (obj.properties) {
        try {
          window.fabric && window.fabric.util.enlivenObjects([obj.properties], (enlivenedObjects: any[]) => {
            const canvasObject = enlivenedObjects[0];
            
            // Store the object ID for later updating
            canvasObject.data = { id: obj.id, saved: true };
            
            fabricCanvas.add(canvasObject);
          });
        } catch (error) {
          console.error('Error loading object:', error);
        }
      }
    });
    
    fabricCanvas.renderAll();
  }, [currentWhiteboard, fabricCanvas]);

  // Setup object modification event handlers
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectModified = (e: any) => {
      const target = e.target;
      if (target && target.data?.id) {
        const objectId = target.data.id;
        const objectJSON = target.toJSON();
        updateObject(objectId, objectJSON);
      }
    };

    fabricCanvas.on('object:modified', handleObjectModified);
    
    return () => {
      fabricCanvas.off('object:modified', handleObjectModified);
    };
  }, [fabricCanvas, updateObject]);

  return (
    <div className="canvas-container w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full"
      />
    </div>
  );
};

export default Canvas;
