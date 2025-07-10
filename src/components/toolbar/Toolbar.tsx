import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Pen, Highlighter, Eraser, Move, Undo, Redo, Trash2 } from 'lucide-react'
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
  const [showOptions, setShowOptions] = useState<string | null>(null)

  const handleToolChange = (tool: any) => {
    dispatch({ type: 'SET_TOOL', payload: tool })
    if (tool === 'pen' || tool === 'highlighter') {
      setShowOptions(tool)
    } else {
      setShowOptions(null)
    }
  }

  const handleColorChange = (color: string) => {
    dispatch({ type: 'SET_COLOR', payload: color })
    toast.success('Color changed', { icon: '🎨' })
  }

  const handleWidthChange = (width: number) => {
    dispatch({ type: 'SET_WIDTH', payload: width })
    toast.success(`Size: ${width}px`, { icon: '📏' })
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear this page? This action cannot be undone.')) {
      clearCanvas()
      toast.success('Page cleared', { icon: '🗑️' })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case 'p':
          handleToolChange('pen')
          break
        case 'h':
          handleToolChange('highlighter')
          break
        case 'e':
          handleToolChange('eraser')
          break
        case 's':
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
        case 'escape':
          setShowOptions(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showOptions && !(e.target as Element).closest('.options-panel') &&
          !(e.target as Element).closest('button')) {
        setShowOptions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showOptions])

  return (
    <>
      {/* Combined Toolbar and Tool Options */}
      <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div className="relative flex items-center">
          {/* Undo/Redo Bubble - Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-full mr-4 flex items-center space-x-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg px-2 py-2 pointer-events-auto"
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={undo}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={redo}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Main Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg px-3 py-2.5 pointer-events-auto"
          >
            {toolItems.map((tool) => (
              <motion.button
                key={tool.id}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleToolChange(tool.id)}
                className={`p-2.5 rounded-full transition-all duration-200 relative ${
                  state.currentTool === tool.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <tool.icon className="w-5 h-5" />
                {state.currentTool === tool.id && (
                  <motion.div
                    layoutId="active-tool-indicator"
                    className="absolute bottom-0.5 left-1/2 w-1 h-1 bg-white rounded-full"
                    style={{ translateX: '-50%' }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Clear Canvas Button - Right */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClearCanvas}
            className="absolute left-full ml-4 p-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 pointer-events-auto"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>

          {/* Tool Options Panel - Positioned Above Toolbar */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: -15, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 options-panel pointer-events-auto z-40"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-3 min-w-[220px]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      {showOptions === 'pen' ? 'Pen Options' : 'Highlighter Options'}
                    </span>
                    <button
                      onClick={() => setShowOptions(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Size Options */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-2">Size</label>
                    <div className="flex items-center justify-between">
                      {[1, 2, 4, 8].map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleWidthChange(size)}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                            state.currentWidth === size
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
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

                  {/* Color Options */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Color</label>
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleColorChange(color)}
                          className={`w-9 h-9 rounded-xl transition-all duration-200 ${
                            state.currentColor === color
                              ? 'ring-2 ring-blue-400 ring-offset-2'
                              : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Opacity - Only for Highlighter */}
                  {(showOptions === 'pen' || showOptions === 'highlighter') && (
  <div className="mt-4">
    <label className="block text-xs text-gray-500 mb-2">Opacity</label>
    <input
      type="range"
      min="10"
      max="100"
      value={state.currentOpacity ?? 100}
      step="10"
      onChange={(e) =>
        dispatch({
          type: 'SET_OPACITY',
          payload: parseInt(e.target.value, 10),
        })
      }
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
)}

                </div>

                {/* Arrow Pointer */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white/95" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
