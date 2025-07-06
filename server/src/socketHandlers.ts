import { Server, Socket } from 'socket.io';

// Define types for socket events
interface ServerToClientEvents {
  objectAdded: (object: any) => void;
  objectModified: (objectId: string, properties: any) => void;
  objectDeleted: (objectId: string) => void;
  cursorMoved: (cursor: any) => void;
  userJoined: (userId: string, userName: string) => void;
  userLeft: (userId: string) => void;
  notebookUpdated: (notebookId: string, notebookData: NotebookData) => void;
  sectionAdded: (notebookId: string, section: NotebookSection) => void;
  pageAdded: (sectionId: string, pageId: string, pageName: string) => void;
  error: (message: string) => void;
}

interface ClientToServerEvents {
  joinWhiteboard: (whiteboardId: string, userId: string, userName: string) => void;
  leaveWhiteboard: (whiteboardId: string, userId: string) => void;
  addObject: (whiteboardId: string, object: any) => void;
  modifyObject: (whiteboardId: string, objectId: string, properties: any) => void;
  deleteObject: (whiteboardId: string, objectId: string) => void;
  moveCursor: (whiteboardId: string, cursor: any) => void;
  createNotebook: (name: string, userId: string) => void;
  addSection: (notebookId: string, sectionName: string, userId: string) => void;
  addPage: (notebookId: string, sectionId: string, pageName: string, userId: string) => void;
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
  type: string; // Including new types like 'equation', 'function_plot', 'ruler', 'compass', 'protractor'
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any; // Will contain extended properties for math objects
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

// New interfaces for notebook structure
interface NotebookSection {
  id: string;
  name: string;
  pages: string[]; // Array of whiteboard IDs that serve as pages
  createdAt: number;
  updatedAt: number;
}

interface NotebookData {
  id: string;
  name: string;
  ownerId: string;
  sections: NotebookSection[];
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
  const notebooks = new Map<string, NotebookData>();

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

    // Handle notebook operations
    socket.on('createNotebook', (name: string, userId: string) => {
      try {
        const notebookId = `notebook-${Date.now()}`;
        const newNotebook: NotebookData = {
          id: notebookId,
          name,
          ownerId: userId,
          sections: [],
          collaborators: {
            [userId]: { role: 'owner', lastActive: Date.now() }
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        // Store in memory
        notebooks.set(notebookId, newNotebook);
        
        console.log(`Notebook ${notebookId} created by ${userId}`);
        
        // Emit to the user
        socket.emit('notebookUpdated', notebookId, newNotebook);
      } catch (error) {
        console.error('Error in createNotebook:', error);
        socket.emit('error', 'Failed to create notebook');
      }
    });
    
    socket.on('addSection', (notebookId: string, sectionName: string, userId: string) => {
      try {
        const notebook = notebooks.get(notebookId);
        if (!notebook) {
          socket.emit('error', 'Notebook not found');
          return;
        }
        
        // Check permissions
        if (notebook.ownerId !== userId && !notebook.collaborators[userId]) {
          socket.emit('error', 'You do not have permission to modify this notebook');
          return;
        }
        
        const sectionId = `section-${Date.now()}`;
        const newSection: NotebookSection = {
          id: sectionId,
          name: sectionName,
          pages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        // Add to notebook
        notebook.sections.push(newSection);
        notebook.updatedAt = Date.now();
        notebooks.set(notebookId, notebook);
        
        console.log(`Section ${sectionId} added to notebook ${notebookId} by ${userId}`);
        
        // Emit to all collaborators
        socket.emit('sectionAdded', notebookId, newSection);
        socket.to(notebookId).emit('sectionAdded', notebookId, newSection);
      } catch (error) {
        console.error('Error in addSection:', error);
        socket.emit('error', 'Failed to add section');
      }
    });
    
    socket.on('addPage', (notebookId: string, sectionId: string, pageName: string, userId: string) => {
      try {
        const notebook = notebooks.get(notebookId);
        if (!notebook) {
          socket.emit('error', 'Notebook not found');
          return;
        }
        
        // Check permissions
        if (notebook.ownerId !== userId && !notebook.collaborators[userId]) {
          socket.emit('error', 'You do not have permission to modify this notebook');
          return;
        }
        
        // Find section
        const section = notebook.sections.find(s => s.id === sectionId);
        if (!section) {
          socket.emit('error', 'Section not found');
          return;
        }
        
        // Create a new whiteboard for the page
        const pageId = `whiteboard-${Date.now()}`;
        const newWhiteboard: WhiteboardData = {
          id: pageId,
          name: pageName,
          ownerId: userId,
          objects: [],
          collaborators: { ...notebook.collaborators },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        // Add to storage
        whiteboards.set(pageId, newWhiteboard);
        
        // Add page to section
        section.pages.push(pageId);
        section.updatedAt = Date.now();
        notebook.updatedAt = Date.now();
        notebooks.set(notebookId, notebook);
        
        console.log(`Page ${pageId} added to section ${sectionId} in notebook ${notebookId} by ${userId}`);
        
        // Emit to all collaborators
        socket.emit('pageAdded', sectionId, pageId, pageName);
        socket.to(notebookId).emit('pageAdded', sectionId, pageId, pageName);
      } catch (error) {
        console.error('Error in addPage:', error);
        socket.emit('error', 'Failed to add page');
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
