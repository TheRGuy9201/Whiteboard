import React from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronDown, ChevronRight, Trash2, Copy } from 'lucide-react'
import { useWhiteboard } from '@/contexts/WhiteboardContext'
import { cn } from '@/lib/utils'

export const PageNavigation: React.FC = () => {
  const { 
    state, 
    addNewPage, 
    setCurrentPage, 
    togglePageExpanded, 
    deletePage, 
    clearPage 
  } = useWhiteboard()

  const insertPageAfter = (pageId: string) => {
    addNewPage()
  }

  const insertPageBefore = (pageId: string) => {
    addNewPage()
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Pages</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addNewPage}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Page</span>
          </motion.button>
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        {state.pages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "border-b border-gray-100 relative group",
              page.id === state.currentPageId && "bg-blue-50 border-blue-200"
            )}
          >
            {/* Page Header */}
            <div className="flex items-center p-3 hover:bg-gray-50 transition-colors">
              <button
                onClick={() => togglePageExpanded(page.id)}
                className="mr-2 p-1 rounded hover:bg-gray-200 transition-colors"
              >
                {page.isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              <div
                className="flex-1 cursor-pointer"
                onClick={() => setCurrentPage(page.id)}
              >
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "font-medium",
                    page.id === state.currentPageId ? "text-blue-600" : "text-gray-800"
                  )}>
                    {page.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({page.paths.length} drawing{page.paths.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {/* Page Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                <button
                  onClick={() => insertPageBefore(page.id)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Insert page above"
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </button>
                <button
                  onClick={() => clearPage(page.id)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Clear page"
                >
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
                {state.pages.length > 1 && (
                  <button
                    onClick={() => deletePage(page.id)}
                    className="p-1 rounded hover:bg-red-100 transition-colors"
                    title="Delete page"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Page Content Preview */}
            {page.isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-3"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-3 relative">
                  <div className="aspect-video bg-gray-50 rounded border flex items-center justify-center">
                    {page.paths.length > 0 ? (
                      <div className="text-sm text-gray-600">
                        ✏️ {page.paths.length} drawing{page.paths.length !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Empty page</div>
                    )}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => insertPageAfter(page.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add below</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(page.id)}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-colors",
                        page.id === state.currentPageId
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {page.id === state.currentPageId ? "Current" : "Switch to"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
