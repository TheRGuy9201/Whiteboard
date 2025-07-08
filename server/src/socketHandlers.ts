import { Server, Socket } from 'socket.io'

interface User {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
}

interface Room {
  id: string
  users: Map<string, User>
  paths: any[]
}

const rooms = new Map<string, Room>()

const generateUserColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const getOrCreateRoom = (roomId: string): Room => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      users: new Map(),
      paths: []
    })
  }
  return rooms.get(roomId)!
}

export const handleConnection = (io: Server, socket: Socket) => {
  let currentRoom: string | null = null
  let currentUser: User | null = null

  socket.on('join-room', ({ roomId, userName }: { roomId: string; userName: string }) => {
    console.log(`User ${userName} joining room ${roomId}`)
    
    const room = getOrCreateRoom(roomId)
    
    currentUser = {
      id: socket.id,
      name: userName,
      color: generateUserColor()
    }
    
    currentRoom = roomId
    room.users.set(socket.id, currentUser)
    
    socket.join(roomId)
    
    // Send current room state to the new user
    socket.emit('room-state', {
      users: Array.from(room.users.values()),
      paths: room.paths
    })
    
    // Notify other users in the room
    socket.to(roomId).emit('user-joined', currentUser)
    
    console.log(`Room ${roomId} now has ${room.users.size} users`)
  })

  socket.on('leave-room', (roomId: string) => {
    if (currentRoom && currentUser) {
      const room = rooms.get(currentRoom)
      if (room) {
        room.users.delete(socket.id)
        socket.to(currentRoom).emit('user-left', socket.id)
        
        if (room.users.size === 0) {
          rooms.delete(currentRoom)
          console.log(`Room ${currentRoom} deleted - no users remaining`)
        }
      }
    }
    
    socket.leave(roomId)
    currentRoom = null
    currentUser = null
  })

  socket.on('drawing-update', ({ roomId, path }: { roomId: string; path: any }) => {
    const room = rooms.get(roomId)
    if (room) {
      room.paths.push(path)
      socket.to(roomId).emit('drawing-update', path)
    }
  })

  socket.on('cursor-move', ({ roomId, cursor }: { roomId: string; cursor: { x: number; y: number } }) => {
    if (currentUser && currentRoom === roomId) {
      currentUser.cursor = cursor
      socket.to(roomId).emit('cursor-update', {
        userId: socket.id,
        cursor
      })
    }
  })

  socket.on('clear-canvas', (roomId: string) => {
    const room = rooms.get(roomId)
    if (room) {
      room.paths = []
      socket.to(roomId).emit('canvas-cleared')
    }
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    
    if (currentRoom && currentUser) {
      const room = rooms.get(currentRoom)
      if (room) {
        room.users.delete(socket.id)
        socket.to(currentRoom).emit('user-left', socket.id)
        
        if (room.users.size === 0) {
          rooms.delete(currentRoom)
          console.log(`Room ${currentRoom} deleted - no users remaining`)
        }
      }
    }
  })
}
