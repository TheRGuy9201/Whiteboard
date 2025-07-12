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
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB',
  '#FFD700', '#32CD32', '#FF69B4', '#87CEEB', '#DDA0DD'
]

export const Toolbar: React.FC<{ isPageNavVisible?: boolean }> = ({ isPageNavVisible = false }) => {
  const { state, dispatch, clearCanvas, undo, redo } = useWhiteboard()
  const [showPenOptions, setShowPenOptions] = useState(false)
  const [showHighlighterOptions, setShowHighlighterOptions] = useState(false)
  const [showEraserOptions, setShowEraserOptions] = useState(false)

  // Calculate toolbar position based on sidebar state
  const getToolbarPosition = () => {
    if (isPageNavVisible) {
      // When sidebar is open, move toolbar to center of remaining canvas area
      // Sidebar width is 320px (w-80), so center the toolbar in the remaining space
      return {
        left: '50%',
        transform: 'translateX(calc(-50% + 160px))' // Move right by half the sidebar width (160px)
      }
    } else {
      // When sidebar is closed, center in full window
      return {
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }
  }

  const handleToolChange = (tool: any) => {
    // Set the new tool
    dispatch({ type: 'SET_TOOL', payload: tool })
    
    // Handle individual tool popups
    if (tool === 'pen') {
      setShowPenOptions(!showPenOptions)
      setShowHighlighterOptions(false)
      setShowEraserOptions(false)
    } else if (tool === 'highlighter') {
      setShowHighlighterOptions(!showHighlighterOptions)
      setShowPenOptions(false)
      setShowEraserOptions(false)
      // Auto-adjust settings for highlighter
      if (state.currentColor === '#000000') {
        dispatch({ type: 'SET_COLOR', payload: '#FFFF00' }) // Yellow for highlighting
      }
      if (state.currentOpacity > 60) {
        dispatch({ type: 'SET_OPACITY', payload: 40 }) // More transparent for highlighting
      }
    } else if (tool === 'eraser') {
      setShowEraserOptions(!showEraserOptions)
      setShowPenOptions(false)
      setShowHighlighterOptions(false)
    } else {
      // Close all popups for other tools
      setShowPenOptions(false)
      setShowHighlighterOptions(false)
      setShowEraserOptions(false)
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
          setShowPenOptions(false)
          setShowHighlighterOptions(false)
          setShowEraserOptions(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((showPenOptions || showHighlighterOptions || showEraserOptions) && 
          !(e.target as Element).closest('.options-panel') &&
          !(e.target as Element).closest('button')) {
        setShowPenOptions(false)
        setShowHighlighterOptions(false)
        setShowEraserOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPenOptions, showHighlighterOptions, showEraserOptions])

  return (
    <>
      {/* Combined Toolbar and Tool Options */}
      <div 
        className="fixed bottom-6 z-30 flex justify-center pointer-events-none transition-all duration-300"
        style={getToolbarPosition()}
      >
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

          {/* Individual Tool Options Panels */}
          {toolItems.map((tool, index) => (
            <AnimatePresence key={tool.id}>
              {((tool.id === 'pen' && showPenOptions) ||
                (tool.id === 'highlighter' && showHighlighterOptions) ||
                (tool.id === 'eraser' && showEraserOptions)) && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: -15, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute bottom-full mb-2 options-panel pointer-events-auto z-40"
                  style={{
                    left: `${(index - 1.5) * 60}px`, // Position above each tool button
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-3 min-w-[200px]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        {tool.name} Options
                      </span>
                      <button
                        onClick={() => {
                          if (tool.id === 'pen') setShowPenOptions(false)
                          else if (tool.id === 'highlighter') setShowHighlighterOptions(false)
                          else if (tool.id === 'eraser') setShowEraserOptions(false)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    {/* Size Options - For all tools */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-500 mb-2">Size</label>
                      <div className="flex items-center justify-between">
                        {(tool.id === 'eraser' ? [5, 10, 15, 20] : [1, 2, 4, 8]).map((size) => (
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
                              className={`rounded-full ${tool.id === 'eraser' ? 'bg-red-400' : 'bg-gray-800'}`}
                              style={{ width: `${tool.id === 'eraser' ? size : size * 2}px`, height: `${tool.id === 'eraser' ? size : size * 2}px` }}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Color Options - Only for pen and highlighter */}
                    {(tool.id === 'pen' || tool.id === 'highlighter') && (
                      <div className="mb-4">
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
                    )}

                    {/* Opacity - For pen and highlighter */}
                    {(tool.id === 'pen' || tool.id === 'highlighter') && (
                      <div className="mb-4">
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

                    {/* Eraser Mode - Only for eraser */}
                    {tool.id === 'eraser' && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Erase Mode</label>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch({ type: 'SET_ERASER_MODE', payload: 'stroke' })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              state.eraserMode === 'stroke'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Full Stroke
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch({ type: 'SET_ERASER_MODE', payload: 'partial' })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              state.eraserMode === 'partial'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Partial
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrow Pointer */}
                  <div 
                    className="absolute bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white/95"
                    style={{ left: '50%' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>
    </>
  )
}
