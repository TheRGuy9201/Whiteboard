import { useEffect, useRef } from 'react';
import { useWhiteboard } from '../../context/WhiteboardContext';
import { DrawingTool } from '../../types';

// This component handles the geometric tools functionality on the canvas
// It works with the existing Canvas component

const GeometricTools = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedTool, strokeColor, strokeWidth } = useWhiteboard();
  
  useEffect(() => {
    // Initialize the canvas with Fabric.js
    if (!canvasRef.current || !window.fabric) return;
    
    const canvas = new window.fabric.Canvas(canvasRef.current);
    
    // Different tool initializers
    const initRuler = () => {
      // Create ruler object
      const rulerWidth = 300;
      const rulerHeight = 40;
      
      const ruler = new window.fabric.Group([], {
        left: 100,
        top: 100,
        hasControls: true,
        hasBorders: true,
        selectable: true,
      });
      
      // Create ruler base
      const base = new window.fabric.Rect({
        width: rulerWidth,
        height: rulerHeight,
        fill: 'rgba(255, 255, 255, 0.8)',
        stroke: strokeColor,
        strokeWidth: 1,
        rx: 4,
        ry: 4,
      });
      
      ruler.addWithUpdate(base);
      
      // Add measurement marks
      for (let i = 0; i <= rulerWidth; i += 10) {
        let height = 10;
        if (i % 50 === 0) height = 20;
        
        const mark = new window.fabric.Line([i, 0, i, height], {
          stroke: strokeColor,
          strokeWidth: i % 50 === 0 ? 1.5 : 1,
        });
        
        ruler.addWithUpdate(mark);
        
        // Add numbers every 50 pixels
        if (i % 50 === 0) {
          const text = new window.fabric.Text(`${i / 10}`, {
            left: i - 5,
            top: 25,
            fontSize: 10,
            fill: strokeColor,
          });
          
          ruler.addWithUpdate(text);
        }
      }
      
      canvas.add(ruler);
      canvas.setActiveObject(ruler);
    };
    
    const initProtractor = () => {
      // Create protractor (semi-circle with angle markings)
      const radius = 150;
      const protractor = new window.fabric.Group([], {
        left: 100,
        top: 100,
        hasControls: true,
        hasBorders: true,
        selectable: true,
      });
      
      // Create protractor base (semi-circle)
      const base = new window.fabric.Circle({
        radius,
        startAngle: 0,
        endAngle: Math.PI,
        fill: 'rgba(255, 255, 255, 0.8)',
        stroke: strokeColor,
        strokeWidth: 1,
      });
      
      protractor.addWithUpdate(base);
      
      // Add degree markings
      for (let angle = 0; angle <= 180; angle += 5) {
        const radian = (angle * Math.PI) / 180;
        const length = angle % 10 === 0 ? 20 : 10;
        
        const startX = radius * Math.cos(radian);
        const startY = radius * Math.sin(radian);
        const endX = (radius - length) * Math.cos(radian);
        const endY = (radius - length) * Math.sin(radian);
        
        const mark = new window.fabric.Line([startX, startY, endX, endY], {
          stroke: strokeColor,
          strokeWidth: angle % 10 === 0 ? 1.5 : 1,
        });
        
        // Add degree number every 10 degrees
        if (angle % 10 === 0) {
          const textX = (radius - 35) * Math.cos(radian);
          const textY = (radius - 35) * Math.sin(radian);
          
          const text = new window.fabric.Text(`${angle}°`, {
            left: textX - 10,
            top: textY - 10,
            fontSize: 10,
            fill: strokeColor,
          });
          
          protractor.addWithUpdate(text);
        }
        
        protractor.addWithUpdate(mark);
      }
      
      // Add baseline
      const baseline = new window.fabric.Line([-radius, 0, radius, 0], {
        stroke: strokeColor,
        strokeWidth: 1.5,
      });
      
      protractor.addWithUpdate(baseline);
      
      canvas.add(protractor);
      canvas.setActiveObject(protractor);
    };
    
    const initCompass = () => {
      // Create compass (circle drawing tool)
      const radius = 100;
      const compass = new window.fabric.Group([], {
        left: 100,
        top: 100,
        hasControls: true,
        hasBorders: true,
        selectable: true,
      });
      
      // Create compass legs
      const centerPoint = new window.fabric.Circle({
        radius: 5,
        fill: strokeColor,
        left: -5,
        top: -5,
      });
      
      const pencilPoint = new window.fabric.Circle({
        radius: 4,
        fill: 'rgba(100, 100, 100, 0.8)',
        left: radius - 4,
        top: -4,
      });
      
      const leg1 = new window.fabric.Line([0, 0, 0, -50], {
        stroke: strokeColor,
        strokeWidth: 2,
      });
      
      const leg2 = new window.fabric.Line([0, 0, radius, 0], {
        stroke: strokeColor,
        strokeWidth: 2,
      });
      
      compass.addWithUpdate(leg1);
      compass.addWithUpdate(leg2);
      compass.addWithUpdate(centerPoint);
      compass.addWithUpdate(pencilPoint);
      
      // Add drawing functionality
      let isDrawing = false;
      
      compass.on('mousedown', () => {
        isDrawing = true;
        const circle = new window.fabric.Circle({
          radius,
          left: compass.left,
          top: compass.top,
          fill: 'transparent',
          stroke: strokeColor,
          strokeWidth,
        });
        canvas.add(circle);
      });
      
      compass.on('mouseup', () => {
        isDrawing = false;
      });
      
      canvas.add(compass);
      canvas.setActiveObject(compass);
    };
    
    // Handle tool selection
    switch (selectedTool) {
      case DrawingTool.RULER:
        initRuler();
        break;
      case DrawingTool.PROTRACTOR:
        initProtractor();
        break;
      case DrawingTool.COMPASS:
        initCompass();
        break;
      default:
        break;
    }
    
    // Cleanup function
    return () => {
      canvas.dispose();
    };
  }, [selectedTool, strokeColor, strokeWidth]);
  
  // This component doesn't render anything on its own
  // It just attaches functionality to the main canvas
  return null;
};

export default GeometricTools;
