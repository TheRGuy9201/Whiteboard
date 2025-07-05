import { io, Socket } from 'socket.io-client';
import { CursorPosition, WhiteboardObject } from '../types';

// Types for socket events
interface ServerToClientEvents {
  objectAdded: (object: WhiteboardObject) => void;
  objectModified: (objectId: string, properties: any) => void;
  objectDeleted: (objectId: string) => void;
  cursorMoved: (cursor: CursorPosition) => void;
  userJoined: (userId: string, userName: string) => void;
  userLeft: (userId: string) => void;
  error: (message: string) => void;
}

interface ClientToServerEvents {
  joinWhiteboard: (whiteboardId: string, userId: string, userName: string) => void;
  leaveWhiteboard: (whiteboardId: string, userId: string) => void;
  addObject: (whiteboardId: string, object: WhiteboardObject) => void;
  modifyObject: (whiteboardId: string, objectId: string, properties: any) => void;
  deleteObject: (whiteboardId: string, objectId: string) => void;
  moveCursor: (whiteboardId: string, cursor: CursorPosition) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.listeners = new Map();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
        this.socket = io(serverUrl);
        
        this.socket.on('connect', () => {
          console.log('Connected to Socket.IO server');
          resolve();
        });
        
        this.socket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error);
          reject(error);
        });
        
        // Setup listeners for server events
        this.setupServerEventListeners();
        
      } catch (error) {
        console.error('Socket.IO initialization error:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Disconnected from Socket.IO server');
    }
  }

  private setupServerEventListeners(): void {
    if (!this.socket) return;
    
    this.socket.on('objectAdded', (object) => {
      this.emit('objectAdded', object);
    });
    
    this.socket.on('objectModified', (objectId, properties) => {
      this.emit('objectModified', objectId, properties);
    });
    
    this.socket.on('objectDeleted', (objectId) => {
      this.emit('objectDeleted', objectId);
    });
    
    this.socket.on('cursorMoved', (cursor) => {
      this.emit('cursorMoved', cursor);
    });
    
    this.socket.on('userJoined', (userId, userName) => {
      this.emit('userJoined', userId, userName);
    });
    
    this.socket.on('userLeft', (userId) => {
      this.emit('userLeft', userId);
    });
    
    this.socket.on('error', (message) => {
      this.emit('error', message);
    });
  }

  joinWhiteboard(whiteboardId: string, userId: string, userName: string): void {
    if (!this.socket) return;
    this.socket.emit('joinWhiteboard', whiteboardId, userId, userName);
  }

  leaveWhiteboard(whiteboardId: string, userId: string): void {
    if (!this.socket) return;
    this.socket.emit('leaveWhiteboard', whiteboardId, userId);
  }

  addObject(whiteboardId: string, object: WhiteboardObject): void {
    if (!this.socket) return;
    this.socket.emit('addObject', whiteboardId, object);
  }

  modifyObject(whiteboardId: string, objectId: string, properties: any): void {
    if (!this.socket) return;
    this.socket.emit('modifyObject', whiteboardId, objectId, properties);
  }

  deleteObject(whiteboardId: string, objectId: string): void {
    if (!this.socket) return;
    this.socket.emit('deleteObject', whiteboardId, objectId);
  }

  moveCursor(whiteboardId: string, cursor: CursorPosition): void {
    if (!this.socket) return;
    this.socket.emit('moveCursor', whiteboardId, cursor);
  }

  // Custom event handling system
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.listeners.set(event, callbacks);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
}

export default new SocketService();
