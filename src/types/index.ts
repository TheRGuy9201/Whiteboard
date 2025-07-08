export interface Point {
  x: number
  y: number
}

export interface DrawingPath {
  id: string
  points: Point[]
  color: string
  width: number
  tool: 'pen' | 'highlighter' | 'eraser'
  timestamp: number
}

export interface WhiteboardState {
  paths: DrawingPath[]
  currentTool: 'pen' | 'highlighter' | 'eraser' | 'select'
  currentColor: string
  currentWidth: number
  isDrawing: boolean
  canvasSize: { width: number; height: number }
  zoom: number
  offset: Point
}

export interface User {
  id: string
  name: string
  avatar?: string
  cursor?: Point
  color: string
}

export interface Room {
  id: string
  name: string
  users: User[]
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
}

export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    accent: string
    muted: string
    border: string
  }
}

export interface ToolbarItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  shortcut?: string
  isActive?: boolean
  onClick: () => void
}

export interface ColorPalette {
  name: string
  colors: string[]
}

export interface WhiteboardContextType {
  state: WhiteboardState
  dispatch: React.Dispatch<WhiteboardAction>
  users: User[]
  room: Room | null
  isConnected: boolean
  joinRoom: (roomId: string, userName: string) => void
  leaveRoom: () => void
  sendDrawing: (path: DrawingPath) => void
  clearCanvas: () => void
  undo: () => void
  redo: () => void
}

export type WhiteboardAction =
  | { type: 'SET_TOOL'; payload: WhiteboardState['currentTool'] }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_WIDTH'; payload: number }
  | { type: 'START_DRAWING' }
  | { type: 'STOP_DRAWING' }
  | { type: 'ADD_PATH'; payload: DrawingPath }
  | { type: 'UPDATE_PATH'; payload: { id: string; points: Point[] } }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_OFFSET'; payload: Point }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_WHITEBOARD'; payload: DrawingPath[] }
