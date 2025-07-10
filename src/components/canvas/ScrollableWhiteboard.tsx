import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWhiteboard } from '@/contexts/WhiteboardContext'
import { WhiteboardCanvas } from './WhiteboardCanvas'

export const ScrollableWhiteboard: React.FC = () => {
  const { state, setCurrentPage } = useWhiteboard()
  const [showPagination, setShowPagination] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Find current page index
  const currentPageIndex = state.pages.findIndex(page => page.id === state.currentPageId)
  
  const handleScrollLeft = () => {
    if (currentPageIndex > 0) {
      const prevPage = state.pages[currentPageIndex - 1]
      setCurrentPage(prevPage.id)
    }
  }
  
  const handleScrollRight = () => {
    if (currentPageIndex < state.pages.length - 1) {
      const nextPage = state.pages[currentPageIndex + 1]
      setCurrentPage(nextPage.id)
    }
  }
  
  // Show pagination controls when hovering over the canvas
  const handleMouseEnter = () => {
    setShowPagination(true)
  }
  
  const handleMouseLeave = () => {
    setShowPagination(false)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault()
        handleScrollLeft()
      } else if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault()
        handleScrollRight()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPageIndex, state.pages])
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current Canvas */}
      <WhiteboardCanvas />
      
      {/* Pagination Controls */}
      <div className={`absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 transition-opacity duration-200 ${showPagination ? 'opacity-100' : 'opacity-0'}`}>
        {currentPageIndex > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollLeft}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 hover:bg-white transition-all"
            title="Previous Page (Alt+Left)"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}
        
        {currentPageIndex < state.pages.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollRight}
            className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 hover:bg-white transition-all ml-auto"
            title="Next Page (Alt+Right)"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
      
      {/* Page Indicator */}
      {state.pages.length > 1 && (
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md transition-opacity duration-200 ${showPagination ? 'opacity-100' : 'opacity-0'}`}>
          {state.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`w-2 h-2 rounded-full transition-all ${
                page.id === state.currentPageId 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              title={`Go to ${page.name}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
