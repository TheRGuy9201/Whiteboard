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
