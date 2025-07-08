import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Line, Circle } from 'react-konva'
import { useWhiteboard } from '@/contexts/WhiteboardContext'
import { generateId } from '@/lib/utils'
import type { DrawingPath, Point } from '@/types'

export const WhiteboardCanvas: React.FC = () => {
  const { state, dispatch, sendDrawing, getCurrentPage } = useWhiteboard()
  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  const currentPage = getCurrentPage()
  const currentPaths = currentPage?.paths || []

  useEffect(() => {
    const updateSize = () => {
      // Use the container ref to get proper dimensions
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setStageSize({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Initial size setup with multiple attempts
    const setupSize = () => {
      updateSize()
      setTimeout(updateSize, 100)
      setTimeout(updateSize, 500)
    }
    
    setupSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const getCursorStyle = () => {
    switch (state.currentTool) {
      case 'pen':
        return 'cursor-crosshair'
      case 'highlighter':
        return 'cursor-crosshair'
      case 'eraser':
        return 'cursor-crosshair'
      case 'select':
        return 'cursor-move'
      default:
        return 'cursor-crosshair'
    }
  }

  const handleMouseDown = (e: any) => {
    if (state.currentTool === 'select' || !state.currentPageId) {
      return
    }

    const stage = stageRef.current
    if (!stage) {
      return
    }

    const point = stage.getPointerPosition()
    if (!point) {
      return
    }
    
    const newPath: DrawingPath = {
      id: generateId(),
      points: [{ x: point.x, y: point.y }],
      color: state.currentTool === 'eraser' ? '#FFFFFF' : state.currentColor,
      width: state.currentTool === 'eraser' ? state.currentWidth * 2 : state.currentWidth,
      tool: state.currentTool as any,
      timestamp: Date.now(),
      pageId: state.currentPageId!,
    }

    setCurrentPath(newPath)
    dispatch({ type: 'START_DRAWING' })
  }

  const handleMouseMove = (e: any) => {
    if (!state.isDrawing || !currentPath || state.currentTool === 'select') {
      return
    }

    const stage = stageRef.current
    const point = stage.getPointerPosition()
    
    if (!point) return
    
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, { x: point.x, y: point.y }],
    }

    setCurrentPath(updatedPath)
  }

  const handleMouseUp = () => {
    if (!currentPath) {
      return
    }

    dispatch({ type: 'ADD_PATH', payload: currentPath })
    dispatch({ type: 'STOP_DRAWING' })
    sendDrawing(currentPath)
    setCurrentPath(null)
  }

  const renderPath = (path: DrawingPath) => {
    if (path.points.length < 1) return null

    const points = path.points.flatMap(p => [p.x, p.y])
    
    return (
      <Line
        key={path.id}
        points={points}
        stroke={path.color}
        strokeWidth={path.width}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={path.tool === 'eraser' ? 'destination-out' : 'source-over'}
        opacity={path.tool === 'highlighter' ? 0.5 : 1}
      />
    )
  }

  const renderCurrentPath = () => {
    if (!currentPath || currentPath.points.length < 1) return null

    const points = currentPath.points.flatMap(p => [p.x, p.y])
    
    return (
      <Line
        points={points}
        stroke={currentPath.color}
        strokeWidth={currentPath.width}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={currentPath.tool === 'eraser' ? 'destination-out' : 'source-over'}
        opacity={currentPath.tool === 'highlighter' ? 0.5 : 1}
      />
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-white relative min-h-0" 
      style={{ pointerEvents: 'auto' }}
    >
      {stageSize.width > 0 && stageSize.height > 0 ? (
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className={getCursorStyle()}
          style={{ cursor: 'crosshair' }}
        >
          <Layer>            
            {/* Existing paths */}
            {currentPaths.map(renderPath)}
            
            {/* Current drawing path */}
            {renderCurrentPath()}
          </Layer>
        </Stage>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Loading canvas...
        </div>
      )}
    </div>
  )
}
