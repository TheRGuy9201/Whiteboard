import React from 'react'
import { useParams } from 'react-router-dom'
import { WhiteboardCanvas } from '@/components/canvas/WhiteboardCanvas'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { UserCursors } from '@/components/collaboration/UserCursors'
import { useWhiteboard } from '@/contexts/WhiteboardContext'

const WhiteboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { room, joinRoom, users, isConnected } = useWhiteboard()

  React.useEffect(() => {
    if (id && !room) {
      joinRoom(id, 'User') // In a real app, this would be the actual user name
    }
  }, [id, room, joinRoom])

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">Whiteboard {id}</h1>
          {isConnected && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </span>
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: user.color, zIndex: users.length - index }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {users.length > 3 && (
              <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs font-medium">
                +{users.length - 3}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-16 border-r border-border bg-card">
          <Toolbar />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <WhiteboardCanvas />
          <UserCursors />
        </div>
      </div>
    </div>
  )
}

export default WhiteboardPage
