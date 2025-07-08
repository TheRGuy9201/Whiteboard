import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
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
    console.log('Tool changing to:', tool)
    dispatch({ type: 'SET_TOOL', payload: tool })
    const toolName = toolItems.find(t => t.id === tool)?.name || tool
    toast.success(`${toolName} selected`, { icon: '🎨' })
  }

  const handleColorChange = (color: string) => {
    dispatch({ type: 'SET_COLOR', payload: color })
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear this page? This action cannot be undone.')) {
      clearCanvas()
      toast.success('Page cleared', { icon: '🗑️' })
    }
  }

  const handleWidthChange = (width: number) => {
    dispatch({ type: 'SET_WIDTH', payload: width })
    toast.success(`Brush size: ${width}px`, { icon: '📏' })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'p':
          e.preventDefault()
          handleToolChange('pen')
          break
        case 'h':
          e.preventDefault()
          handleToolChange('highlighter')
          break
        case 'e':
          e.preventDefault()
          handleToolChange('eraser')
          break
        case 's':
          e.preventDefault()
          handleToolChange('select')
          break
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
          }
          break
        case '1':
          e.preventDefault()
          handleWidthChange(1)
          break
        case '2':
          e.preventDefault()
          handleWidthChange(2)
          break
        case '3':
          e.preventDefault()
          handleWidthChange(4)
          break
        case '4':
          e.preventDefault()
          handleWidthChange(8)
          break
        case 'delete':
        case 'backspace':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleClearCanvas()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleToolChange, handleWidthChange, undo, redo, handleClearCanvas])

  return (
    <div className="flex items-center justify-center px-2 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-3 sm:space-x-6 bg-white rounded-2xl shadow-lg border border-gray-200 px-3 sm:px-6 py-2 sm:py-3 max-w-full overflow-x-auto"
      >
        {/* Drawing Tools */}
        <div className="flex items-center space-x-2">
          {toolItems.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToolChange(tool.id)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                state.currentTool === tool.id
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-sm'
              }`}
              title={`${tool.name} (${tool.shortcut})`}
            >
              <tool.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Brush Sizes */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Size</span>
          {[1, 2, 4, 8].map((size, index) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleWidthChange(size)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                state.currentWidth === size
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
              }`}
              title={`Size ${size}px (${index + 1})`}
            >
              <div
                className={`rounded-full ${
                  state.currentWidth === size ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                style={{ width: `${Math.min(size * 1.5, 12)}px`, height: `${Math.min(size * 1.5, 12)}px` }}
              />
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Color</span>
          <div className="flex items-center space-x-1.5">
            {colors.slice(0, 6).map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorChange(color)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                  state.currentColor === color
                    ? 'border-gray-800 ring-2 ring-blue-400 shadow-md'
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
            <div className="flex flex-col space-y-1">
              {colors.slice(6).map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleColorChange(color)}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    state.currentColor === color
                      ? 'border-gray-800 ring-1 ring-blue-400 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Actions */}
        <div className="flex items-center space-x-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearCanvas}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 hover:shadow-sm"
            title="Clear Page (Ctrl+Delete)"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
