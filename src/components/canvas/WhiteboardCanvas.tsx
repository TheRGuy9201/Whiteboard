import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Line, Circle } from 'react-konva'
import { useWhiteboard } from '@/contexts/WhiteboardContext'
import { generateId } from '@/lib/utils'
import type { DrawingPath, Point } from '@/types'

export const WhiteboardCanvas: React.FC = () => {
  const { state, dispatch, sendDrawing } = useWhiteboard()
  const stageRef = useRef<any>(null)
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container()
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleMouseDown = (e: any) => {
    if (state.currentTool === 'select') return

    const stage = stageRef.current
    const point = stage.getPointerPosition()
    
    const newPath: DrawingPath = {
      id: generateId(),
      points: [{ x: point.x, y: point.y }],
      color: state.currentColor,
      width: state.currentWidth,
      tool: state.currentTool as any,
      timestamp: Date.now(),
    }

    setCurrentPath(newPath)
    dispatch({ type: 'START_DRAWING' })
  }

  const handleMouseMove = (e: any) => {
    if (!state.isDrawing || !currentPath) return

    const stage = stageRef.current
    const point = stage.getPointerPosition()
    
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, { x: point.x, y: point.y }],
    }

    setCurrentPath(updatedPath)
  }

  const handleMouseUp = () => {
    if (!currentPath) return

    dispatch({ type: 'ADD_PATH', payload: currentPath })
    dispatch({ type: 'STOP_DRAWING' })
    sendDrawing(currentPath)
    setCurrentPath(null)
  }

  const renderPath = (path: DrawingPath) => {
    if (path.points.length < 2) return null

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
    if (!currentPath || currentPath.points.length < 2) return null

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
    <div className="w-full h-full bg-white dark:bg-gray-900 relative">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="cursor-crosshair"
      >
        <Layer>
          {/* Grid background */}
          {Array.from({ length: Math.ceil(stageSize.width / 20) }).map((_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 20, 0, i * 20, stageSize.height]}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: Math.ceil(stageSize.height / 20) }).map((_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * 20, stageSize.width, i * 20]}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
            />
          ))}
          
          {/* Existing paths */}
          {state.paths.map(renderPath)}
          
          {/* Current drawing path */}
          {renderCurrentPath()}
        </Layer>
      </Stage>
    </div>
  )
}
