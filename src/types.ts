export interface User {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
}

export const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  GUEST: 'guest'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const DrawingTool = {
  PENCIL: 'pencil',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  TEXT: 'text',
  STICKY_NOTE: 'sticky_note',
  HIGHLIGHTER: 'highlighter',
  ERASER: 'eraser',
  SELECT: 'select',
  PAN: 'pan',
  POLYGON: 'polygon',
  IMAGE: 'image',
  LATEX: 'latex',
  RULER: 'ruler',
  COMPASS: 'compass',
  PROTRACTOR: 'protractor',
  FUNCTION_PLOT: 'function_plot',
  GEOMETRY: 'geometry',
} as const;

export type DrawingTool = typeof DrawingTool[keyof typeof DrawingTool];

export const BackgroundType = {
  PLAIN: 'plain',
  GRID: 'grid',
  RULED: 'ruled',
  DOTTED: 'dotted',
} as const;

export type BackgroundType = typeof BackgroundType[keyof typeof BackgroundType];

export interface WhiteboardObject {
  id: string;
  type: string;
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any; // Will contain fabric.js or Konva object data
}

export interface Whiteboard {
  id: string;
  name: string;
  ownerId: string;
  background: BackgroundType;
  objects: WhiteboardObject[];
  collaborators: {
    [userId: string]: {
      role: UserRole;
      lastActive: number;
    }
  };
  createdAt: number;
  updatedAt: number;
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  whiteboards: string[]; // Array of whiteboard IDs
  participants: {
    [userId: string]: {
      role: UserRole;
      joinedAt: number;
    }
  };
  createdAt: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface CursorPosition extends Position {
  userId: string;
  userName: string;
  color: string;
}

export interface CanvasAction {
  id: string;
  type: 'add' | 'modify' | 'delete';
  userId: string;
  timestamp: number;
  objectId: string;
  objectData: any; // For adding or modifying objects
}

export interface CanvasState {
  objects: WhiteboardObject[];
  actions: CanvasAction[];
  background: BackgroundType;
  zoom: number;
  pan: Position;
}

// New notebook structure interfaces
export interface NotebookSection {
  id: string;
  name: string;
  pages: string[]; // Array of whiteboard IDs that serve as pages
  createdAt: number;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  ownerId: string;
  sections: NotebookSection[];
  collaborators: {
    [userId: string]: {
      role: UserRole;
      lastActive: number;
    }
  };
  createdAt: number;
  updatedAt: number;
}

// Math-specific interfaces
export interface MathEquation {
  id: string;
  latex: string;
  position: Position;
}

export interface GraphPlot {
  id: string;
  function: string;
  xRange: [number, number];
  yRange: [number, number];
  position: Position;
  scale: number;
}

export interface GeometricTool {
  id: string;
  type: 'ruler' | 'compass' | 'protractor';
  position: Position;
  rotation: number;
  scale: number;
}

// Color palette for the app
export const ColorPalette = {
  // Light mode colors
  light: {
    background: '#F4F6F8',
    primary: '#1E88E5',
    secondary: '#7E57C2',
    error: '#E53935',
    success: '#43A047',
    warning: '#FDD835',
    text: '#212121',
    border: '#E0E0E0',
  },
  // Dark mode colors
  dark: {
    background: '#121212',
    primary: '#4FC3F7',
    secondary: '#B39DDB',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFEE58',
    text: '#FFFFFF',
    border: '#424242',
  },
  // Pen colors (same for both modes)
  pen: {
    blue: '#1E88E5',
    red: '#E53935',
    green: '#43A047',
    yellow: '#FDD835',
    black: '#212121',
    white: '#FFFFFF',
    purple: '#7E57C2',
  }
}
