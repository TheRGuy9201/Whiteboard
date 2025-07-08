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
    <div className="flex items-center justify-between px-6 py-3">
      {/* Left Section - Tools */}
      <div className="flex items-center space-x-4">
        {/* Drawing Tools */}
        <div className="flex items-center space-x-2">
          {toolItems.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolChange(tool.id)}
              className={`p-3 rounded-lg transition-colors ${
                state.currentTool === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={`${tool.name} (${tool.shortcut})`}
            >
              <tool.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Brush Sizes */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Size:</span>
          {[1, 2, 4, 8].map((size) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleWidthChange(size)}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                state.currentWidth === size
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className="rounded-full bg-gray-800"
                style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Center Section - Colors */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 font-medium">Color:</span>
        <div className="flex items-center space-x-2">
          {colors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorChange(color)}
              className={`w-10 h-10 rounded-full border-3 ${
                state.currentColor === color
                  ? 'border-gray-800 ring-2 ring-blue-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={undo}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={redo}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="p-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
          title="Clear Page"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}
