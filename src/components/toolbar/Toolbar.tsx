import React from 'react'
import { motion } from 'framer-motion'
import { Pen, Highlighter, Eraser, Move, Undo, Redo, Trash2, Download, Settings } from 'lucide-react'
import { useWhiteboard } from '@/contexts/WhiteboardContext'

const toolItems = [
  { id: 'pen', icon: Pen, name: 'Pen', shortcut: 'P' },
  { id: 'highlighter', icon: Highlighter, name: 'Highlighter', shortcut: 'H' },
  { id: 'eraser', icon: Eraser, name: 'Eraser', shortcut: 'E' },
  { id: 'select', icon: Move, name: 'Select', shortcut: 'S' },
]

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
]

export const Toolbar: React.FC = () => {
  const { state, dispatch, clearCanvas, undo, redo } = useWhiteboard()

  const handleToolChange = (tool: any) => {
    dispatch({ type: 'SET_TOOL', payload: tool })
  }

  const handleColorChange = (color: string) => {
    dispatch({ type: 'SET_COLOR', payload: color })
  }

  const handleWidthChange = (width: number) => {
    dispatch({ type: 'SET_WIDTH', payload: width })
  }

  return (
    <div className="flex flex-col items-center py-4 space-y-4">
      {/* Tools */}
      <div className="flex flex-col space-y-2">
        {toolItems.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToolChange(tool.id)}
            className={`p-3 rounded-lg transition-colors ${
              state.currentTool === tool.id
                ? 'bg-primary text-white'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
            title={`${tool.name} (${tool.shortcut})`}
          >
            <tool.icon className="w-5 h-5" />
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-border" />

      {/* Colors */}
      <div className="flex flex-col space-y-2">
        {colors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              state.currentColor === color
                ? 'border-primary'
                : 'border-border'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-border" />

      {/* Brush Size */}
      <div className="flex flex-col space-y-2">
        {[1, 2, 4, 8].map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWidthChange(size)}
            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
              state.currentWidth === size
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary'
            }`}
          >
            <div
              className="rounded-full bg-foreground"
              style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
            />
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-border" />

      {/* Actions */}
      <div className="flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={undo}
          className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={redo}
          className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="p-3 rounded-lg bg-destructive hover:bg-destructive/80 text-white transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}
