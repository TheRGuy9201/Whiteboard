import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { WhiteboardContextType, WhiteboardState, WhiteboardAction, DrawingPath, User, Room } from '@/types'

const initialState: WhiteboardState = {
  paths: [],
  currentTool: 'pen',
  currentColor: '#000000',
  currentWidth: 2,
  isDrawing: false,
  canvasSize: { width: 1920, height: 1080 },
  zoom: 1,
  offset: { x: 0, y: 0 }
}

const whiteboardReducer = (state: WhiteboardState, action: WhiteboardAction): WhiteboardState => {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload }
    case 'SET_COLOR':
      return { ...state, currentColor: action.payload }
    case 'SET_WIDTH':
      return { ...state, currentWidth: action.payload }
    case 'START_DRAWING':
      return { ...state, isDrawing: true }
    case 'STOP_DRAWING':
      return { ...state, isDrawing: false }
    case 'ADD_PATH':
      return { ...state, paths: [...state.paths, action.payload] }
    case 'UPDATE_PATH':
      return {
        ...state,
        paths: state.paths.map(path =>
          path.id === action.payload.id
            ? { ...path, points: action.payload.points }
            : path
        )
      }
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload }
    case 'SET_OFFSET':
      return { ...state, offset: action.payload }
    case 'CLEAR_CANVAS':
      return { ...state, paths: [] }
    case 'UNDO':
      return { ...state, paths: state.paths.slice(0, -1) }
    case 'REDO':
      // TODO: Implement redo functionality with history
      return state
    case 'LOAD_WHITEBOARD':
      return { ...state, paths: action.payload }
    default:
      return state
  }
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined)

export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext)
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider')
  }
  return context
}

export const WhiteboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(whiteboardReducer, initialState)
  const [users, setUsers] = useState<User[]>([])
  const [room, setRoom] = useState<Room | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('user-joined', (user: User) => {
      setUsers(prev => [...prev, user])
    })

    newSocket.on('user-left', (userId: string) => {
      setUsers(prev => prev.filter(user => user.id !== userId))
    })

    newSocket.on('drawing-update', (path: DrawingPath) => {
      dispatch({ type: 'ADD_PATH', payload: path })
    })

    newSocket.on('canvas-cleared', () => {
      dispatch({ type: 'CLEAR_CANVAS' })
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const joinRoom = (roomId: string, userName: string) => {
    if (socket) {
      socket.emit('join-room', { roomId, userName })
      setRoom({ id: roomId, name: `Room ${roomId}`, users: [], createdAt: new Date(), updatedAt: new Date() })
    }
  }

  const leaveRoom = () => {
    if (socket && room) {
      socket.emit('leave-room', room.id)
      setRoom(null)
      setUsers([])
    }
  }

  const sendDrawing = (path: DrawingPath) => {
    if (socket && room) {
      socket.emit('drawing-update', { roomId: room.id, path })
    }
  }

  const clearCanvas = () => {
    dispatch({ type: 'CLEAR_CANVAS' })
    if (socket && room) {
      socket.emit('clear-canvas', room.id)
    }
  }

  const undo = () => {
    dispatch({ type: 'UNDO' })
  }

  const redo = () => {
    dispatch({ type: 'REDO' })
  }

  const value: WhiteboardContextType = {
    state,
    dispatch,
    users,
    room,
    isConnected,
    joinRoom,
    leaveRoom,
    sendDrawing,
    clearCanvas,
    undo,
    redo
  }

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  )
}
