import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import type { WhiteboardContextType, WhiteboardState, WhiteboardAction, DrawingPath, User, Room, WhiteboardPage } from '@/types'
import { generateId } from '@/lib/utils'

const generateInitialState = (): WhiteboardState => {
  const firstPageId = generateId()
  return {
    pages: [{
      id: firstPageId,
      name: 'Page 1',
      paths: [],
      isExpanded: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }],
    currentPageId: firstPageId,
    currentTool: 'select',
    currentColor: '#000000',
    currentWidth: 2,
    currentOpacity: 80, // Better default for highlighter transparency
    eraserMode: 'stroke', // Default eraser mode
    isDrawing: false,
    currentPath: null,
    canvasSize: { width: 1920, height: 1080 },
    zoom: 1,
    offset: { x: 0, y: 0 }
  }
}

const initialState = generateInitialState()

const whiteboardReducer = (state: WhiteboardState, action: WhiteboardAction): WhiteboardState => {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload }
    case 'SET_COLOR':
      return { ...state, currentColor: action.payload }
    case 'SET_WIDTH':
      return { ...state, currentWidth: action.payload }
    case 'SET_OPACITY':
      return { ...state, currentOpacity: action.payload } // ✅ Added
    case 'SET_ERASER_MODE':
      return { ...state, eraserMode: action.payload }
    case 'START_DRAWING':
      return { ...state, isDrawing: true }
    case 'STOP_DRAWING':
      return { ...state, isDrawing: false, currentPath: null }
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload }
    case 'UPDATE_CURRENT_PATH':
      return { ...state, currentPath: action.payload }
    case 'ADD_PATH':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.pageId
            ? { ...page, paths: [...page.paths, action.payload] }
            : page
        )
      }
    case 'UPDATE_PATH':
      return {
        ...state,
        pages: state.pages.map(page => ({
          ...page,
          paths: page.paths.map(path =>
            path.id === action.payload.id
              ? { ...path, points: action.payload.points }
              : path
          )
        }))
      }
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload }
    case 'SET_OFFSET':
      return { ...state, offset: action.payload }
    case 'CLEAR_CANVAS':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === state.currentPageId
            ? { ...page, paths: [] }
            : page
        )
      }
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, action.payload],
        currentPageId: action.payload.id
      }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageId: action.payload }
    case 'TOGGLE_PAGE_EXPANDED':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload
            ? { ...page, isExpanded: !page.isExpanded }
            : page
        )
      }
    case 'DELETE_PAGE':
      const filteredPages = state.pages.filter(page => page.id !== action.payload)
      return {
        ...state,
        pages: filteredPages,
        currentPageId: filteredPages.length > 0 ? filteredPages[0].id : null
      }
    case 'CLEAR_PAGE':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload
            ? { ...page, paths: [] }
            : page
        )
      }
    case 'UNDO':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === state.currentPageId
            ? { ...page, paths: page.paths.slice(0, -1) }
            : page
        )
      }
    case 'REDO':
      // TODO: Implement redo functionality with history
      return state
    case 'LOAD_WHITEBOARD':
      return { 
        ...state, 
        pages: action.payload.pages,
        currentPageId: action.payload.currentPageId || (action.payload.pages?.[0]?.id || state.currentPageId)
      }
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
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const savedWhiteboard = localStorage.getItem('whiteboard-data')
    if (savedWhiteboard) {
      try {
        const parsed = JSON.parse(savedWhiteboard)
        if (parsed.pages && parsed.pages.length > 0) {
          const currentPageId = parsed.currentPageId && parsed.pages.find((p: any) => p.id === parsed.currentPageId) 
            ? parsed.currentPageId 
            : parsed.pages[0].id
          dispatch({ 
            type: 'LOAD_WHITEBOARD', 
            payload: { 
              pages: parsed.pages, 
              currentPageId: currentPageId 
            } 
          })
        }
      } catch (error) {
        console.error('Error loading whiteboard data:', error)
      }
    }
  }, [])

  useEffect(() => {
    const dataToSave = {
      pages: state.pages,
      currentPageId: state.currentPageId
    }
    localStorage.setItem('whiteboard-data', JSON.stringify(dataToSave))
  }, [state.pages, state.currentPageId])

  const addNewPage = () => {
    const newPage: WhiteboardPage = {
      id: generateId(),
      name: `Page ${state.pages.length + 1}`,
      paths: [],
      isExpanded: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    dispatch({ type: 'ADD_PAGE', payload: newPage })
  }

  const setCurrentPage = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId })
  }

  const togglePageExpanded = (pageId: string) => {
    dispatch({ type: 'TOGGLE_PAGE_EXPANDED', payload: pageId })
  }

  const deletePage = (pageId: string) => {
    if (state.pages.length > 1) {
      dispatch({ type: 'DELETE_PAGE', payload: pageId })
    }
  }

  const clearPage = (pageId: string) => {
    dispatch({ type: 'CLEAR_PAGE', payload: pageId })
  }

  const getCurrentPage = () => {
    return state.pages.find(page => page.id === state.currentPageId)
  }

  const joinRoom = (roomId: string, _userName: string) => {
    // userName is intentionally prefixed with _ as it's not used in offline mode
    setRoom({ id: roomId, name: `Room ${roomId}`, users: [], createdAt: new Date(), updatedAt: new Date() })
    setIsConnected(true)
  }

  const leaveRoom = () => {
    setRoom(null)
    setUsers([])
    setIsConnected(false)
  }

  const sendDrawing = (_path: DrawingPath) => {
    // path is intentionally prefixed with _ as it's not used in offline mode
    // No-op in offline mode
  }

  const clearCanvas = () => {
    dispatch({ type: 'CLEAR_CANVAS' })
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
    redo,
    addNewPage,
    setCurrentPage,
    togglePageExpanded,
    deletePage,
    clearPage,
    getCurrentPage
  }

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  )
}
