import React from 'react'
import { useParams } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { WhiteboardCanvas } from '@/components/canvas/WhiteboardCanvas'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { PageNavigation } from '@/components/notebook/PageNavigation'
import { useWhiteboard } from '@/contexts/WhiteboardContext'

const WhiteboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { room, joinRoom, getCurrentPage } = useWhiteboard()
  const [isPageNavVisible, setIsPageNavVisible] = React.useState(true)

  const currentPage = getCurrentPage()

  React.useEffect(() => {
    if (id && !room) {
      joinRoom(id, 'User') // In a real app, this would be the actual user name
    }
  }, [id, room, joinRoom])

  const togglePageNavigation = () => {
    setIsPageNavVisible(!isPageNavVisible)
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePageNavigation}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isPageNavVisible ? "Hide Pages" : "Show Pages"}
          >
            {isPageNavVisible ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Whiteboard {id} {currentPage && `• ${currentPage.name}`}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Offline Mode</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden"> {/* No padding needed as toolbar is at bottom */}
        {/* Page Navigation - Toggleable */}
        {isPageNavVisible && <PageNavigation />}
        
        {/* Canvas Area */}
        <div className={`flex-1 relative bg-gray-100 overflow-hidden transition-all duration-300 ${!isPageNavVisible ? 'px-8' : 'px-2'}`}>
          <WhiteboardCanvas />
        </div>
      </div>
      
      {/* Toolbar rendered outside the flex container for proper positioning */}
      <Toolbar />
    </div>
  )
}

export default WhiteboardPage
