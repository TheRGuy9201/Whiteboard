import React, { useRef } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import type { DrawingPath } from '@/types'

interface PageThumbnailProps {
  paths: DrawingPath[]
  currentPath?: DrawingPath | null
  width?: number
  height?: number
  className?: string
}

export const PageThumbnail: React.FC<PageThumbnailProps> = ({ 
  paths, 
  currentPath = null,
  width = 240, 
  height = 135,
  className = ""
}) => {
  const stageRef = useRef<any>(null)
  
  // Calculate fixed scale based on a standard canvas size
  const calculateTransform = () => {
    // Use a fixed reference canvas size (typical whiteboard dimensions)
    const referenceWidth = 1200
    const referenceHeight = 800
    
    // Calculate scale to fit reference canvas in thumbnail
    const scaleX = width / referenceWidth
    const scaleY = height / referenceHeight
    
    // Use the smaller scale to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY)
    
    // Center the scaled canvas in the thumbnail
    const scaledWidth = referenceWidth * scale
    const scaledHeight = referenceHeight * scale
    const offsetX = (width - scaledWidth) / 2
    const offsetY = (height - scaledHeight) / 2
    
    return { scale, offsetX, offsetY }
  }
  
  const { scale, offsetX, offsetY } = calculateTransform()
  
  const renderPath = (path: DrawingPath) => {
    if (path.points.length < 1) return null

    const points = path.points.flatMap(p => [p.x * scale + offsetX, p.y * scale + offsetY])
    
    return (
      <Line
        key={path.id}
        points={points}
        stroke={path.color}
        strokeWidth={Math.max(0.5, path.width * scale)} // Minimum width for visibility
        tension={0.5}
        lineCap={path.tool === 'highlighter' ? 'butt' : 'round'}
        lineJoin={path.tool === 'highlighter' ? 'miter' : 'round'}
        globalCompositeOperation={path.tool === 'eraser' ? 'destination-out' : 'source-over'}
        opacity={path.tool === 'eraser' ? 1 : (path.opacity !== undefined ? path.opacity : (path.tool === 'highlighter' ? 0.4 : 1))}
      />
    )
  }

  return (
    <div className={`bg-white border rounded overflow-hidden ${className}`}>
      {(paths.length > 0 || currentPath) ? (
        <Stage
          ref={stageRef}
          width={width}
          height={height}
        >
          <Layer>
            {/* Existing paths */}
            {paths.map(renderPath)}
            {/* Current drawing path */}
            {currentPath && renderPath(currentPath)}
          </Layer>
        </Stage>
      ) : (
        <div 
          className="flex items-center justify-center text-gray-400 text-sm"
          style={{ width, height }}
        >
          Empty page
        </div>
      )}
    </div>
  )
}
