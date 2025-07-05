import { Server, Socket } from 'socket.io';

// Define types for socket events
interface ServerToClientEvents {
  objectAdded: (object: any) => void;
  objectModified: (objectId: string, properties: any) => void;
  objectDeleted: (objectId: string) => void;
  cursorMoved: (cursor: any) => void;
  userJoined: (userId: string, userName: string) => void;
  userLeft: (userId: string) => void;
  error: (message: string) => void;
}

interface ClientToServerEvents {
  joinWhiteboard: (whiteboardId: string, userId: string, userName: string) => void;
  leaveWhiteboard: (whiteboardId: string, userId: string) => void;
  addObject: (whiteboardId: string, object: any) => void;
  modifyObject: (whiteboardId: string, objectId: string, properties: any) => void;
  deleteObject: (whiteboardId: string, objectId: string) => void;
  moveCursor: (whiteboardId: string, cursor: any) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: string;
  userName: string;
  currentWhiteboard: string | null;
}

// In-memory data structure for whiteboards
interface WhiteboardObject {
  id: string;
  type: string;
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any;
}

interface WhiteboardData {
  id: string;
  name: string;
  ownerId: string;
  objects: WhiteboardObject[];
  collaborators: Record<string, { role: string; lastActive: number }>;
  createdAt: number;
  updatedAt: number;
}

export const setupSocketHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
): void => {
  // In-memory storage
  const whiteboardUsers = new Map<string, Set<string>>();
  const whiteboards = new Map<string, WhiteboardData>();

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    console.log(`User connected: ${socket.id}`);
    
    // Initialize socket data
    socket.data.currentWhiteboard = null;

    // Handle joining a whiteboard
    socket.on('joinWhiteboard', async (whiteboardId: string, userId: string, userName: string) => {
      try {
        // Store user data in socket
        socket.data.userId = userId;
        socket.data.userName = userName;
        socket.data.currentWhiteboard = whiteboardId;
        
        // Join the whiteboard room
        socket.join(whiteboardId);
        
        // Add user to the whiteboard users map
        if (!whiteboardUsers.has(whiteboardId)) {
          whiteboardUsers.set(whiteboardId, new Set());
        }
        whiteboardUsers.get(whiteboardId)?.add(userId);
        
        // Notify other users that a new user joined
        socket.to(whiteboardId).emit('userJoined', userId, userName);
        
        console.log(`User ${userName} (${userId}) joined whiteboard ${whiteboardId}`);
        
        // Update the whiteboard in memory
        if (whiteboards.has(whiteboardId)) {
          const whiteboard = whiteboards.get(whiteboardId);
          if (whiteboard) {
            if (!whiteboard.collaborators) {
              whiteboard.collaborators = {};
            }
            whiteboard.collaborators[userId] = { 
              role: 'viewer',
              lastActive: Date.now() 
            };
            whiteboard.updatedAt = Date.now();
            whiteboards.set(whiteboardId, whiteboard);
          }
        }
      } catch (error) {
        console.error('Error in joinWhiteboard:', error);
        socket.emit('error', 'Failed to join whiteboard');
      }
    });

    // Handle leaving a whiteboard
    socket.on('leaveWhiteboard', async (whiteboardId: string, userId: string) => {
      try {
        // Leave the whiteboard room
        socket.leave(whiteboardId);
        
        // Remove user from the whiteboard users map
        whiteboardUsers.get(whiteboardId)?.delete(userId);
        if (whiteboardUsers.get(whiteboardId)?.size === 0) {
          whiteboardUsers.delete(whiteboardId);
        }
        
        // Clear whiteboard from socket data
        socket.data.currentWhiteboard = null;
        
        // Notify other users that a user left
        socket.to(whiteboardId).emit('userLeft', userId);
        
        console.log(`User ${userId} left whiteboard ${whiteboardId}`);
      } catch (error) {
        console.error('Error in leaveWhiteboard:', error);
      }
    });

    // Handle adding an object
    socket.on('addObject', (whiteboardId: string, object: WhiteboardObject) => {
      try {
        // Validate user is in the whiteboard
        if (socket.data.currentWhiteboard !== whiteboardId) {
          socket.emit('error', 'You are not in this whiteboard');
          return;
        }
        
        // Broadcast the new object to all users in the whiteboard except sender
        socket.to(whiteboardId).emit('objectAdded', object);
        
        console.log(`Object ${object.id} added to whiteboard ${whiteboardId}`);
        
        // Save to in-memory storage
        if (whiteboards.has(whiteboardId)) {
          const whiteboard = whiteboards.get(whiteboardId);
          if (whiteboard) {
            whiteboard.objects.push(object);
            whiteboard.updatedAt = Date.now();
            whiteboards.set(whiteboardId, whiteboard);
          }
        }
      } catch (error) {
        console.error('Error in addObject:', error);
      }
    });

    // Handle modifying an object
    socket.on('modifyObject', (whiteboardId: string, objectId: string, properties: any) => {
      try {
        // Validate user is in the whiteboard
        if (socket.data.currentWhiteboard !== whiteboardId) {
          socket.emit('error', 'You are not in this whiteboard');
          return;
        }
        
        // Broadcast the object modification to all users in the whiteboard except sender
        socket.to(whiteboardId).emit('objectModified', objectId, properties);
        
        console.log(`Object ${objectId} modified in whiteboard ${whiteboardId}`);
        
        // Update in in-memory storage
        if (whiteboards.has(whiteboardId)) {
          const whiteboard = whiteboards.get(whiteboardId);
          if (whiteboard) {
            whiteboard.objects = whiteboard.objects.map(obj => {
              if (obj.id === objectId) {
                return {
                  ...obj,
                  properties: { ...obj.properties, ...properties },
                  updatedAt: Date.now(),
                  updatedBy: socket.data.userId
                };
              }
              return obj;
            });
            whiteboard.updatedAt = Date.now();
            whiteboards.set(whiteboardId, whiteboard);
          }
        }
      } catch (error) {
        console.error('Error in modifyObject:', error);
      }
    });

    // Handle deleting an object
    socket.on('deleteObject', (whiteboardId: string, objectId: string) => {
      try {
        // Validate user is in the whiteboard
        if (socket.data.currentWhiteboard !== whiteboardId) {
          socket.emit('error', 'You are not in this whiteboard');
          return;
        }
        
        // Broadcast the object deletion to all users in the whiteboard except sender
        socket.to(whiteboardId).emit('objectDeleted', objectId);
        
        console.log(`Object ${objectId} deleted from whiteboard ${whiteboardId}`);
        
        // Update in-memory storage
        if (whiteboards.has(whiteboardId)) {
          const whiteboard = whiteboards.get(whiteboardId);
          if (whiteboard) {
            whiteboard.objects = whiteboard.objects.filter(obj => obj.id !== objectId);
            whiteboard.updatedAt = Date.now();
            whiteboards.set(whiteboardId, whiteboard);
          }
        }
      } catch (error) {
        console.error('Error in deleteObject:', error);
      }
    });

    // Handle cursor movement
    socket.on('moveCursor', (whiteboardId: string, cursor: any) => {
      try {
        // Validate user is in the whiteboard
        if (socket.data.currentWhiteboard !== whiteboardId) {
          return; // Silently ignore invalid cursor movements
        }
        
        // Make sure cursor has user info
        const cursorWithUser = {
          ...cursor,
          userId: socket.data.userId,
          userName: socket.data.userName
        };
        
        // Broadcast cursor position to all users in the whiteboard except sender
        socket.to(whiteboardId).emit('cursorMoved', cursorWithUser);
      } catch (error) {
        console.error('Error in moveCursor:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        const { currentWhiteboard, userId, userName } = socket.data;
        
        if (currentWhiteboard && userId) {
          // Remove user from whiteboard
          whiteboardUsers.get(currentWhiteboard)?.delete(userId);
          if (whiteboardUsers.get(currentWhiteboard)?.size === 0) {
            whiteboardUsers.delete(currentWhiteboard);
          }
          
          // Notify other users
          socket.to(currentWhiteboard).emit('userLeft', userId);
          
          console.log(`User ${userName || userId} disconnected from whiteboard ${currentWhiteboard}`);
        }
        
        console.log(`User disconnected: ${socket.id}`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};
