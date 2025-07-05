import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  DrawingTool, 
  BackgroundType,
  UserRole
} from '../types';

// Define the WhiteboardObject interface locally to avoid import issues
interface WhiteboardObject {
  id: string;
  type: string;
  createdBy: string;
  createdAt: number;
  updatedBy?: string;
  updatedAt?: number;
  properties: any; // Will contain fabric.js or Konva object data
}

// Define the Whiteboard interface locally to avoid import issues
interface Whiteboard {
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

// Define the Position interface locally to avoid import issues
interface Position {
  x: number;
  y: number;
}

// Define the CursorPosition interface locally to avoid import issues
interface CursorPosition extends Position {
  userId: string;
  userName: string;
  color: string;
}

interface WhiteboardContextType {
  currentWhiteboard: Whiteboard | null;
  whiteboards: Whiteboard[];
  loading: boolean;
  error: string | null;
  selectedTool: DrawingTool;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  opacity: number;
  cursors: CursorPosition[];
  createWhiteboard: (name: string) => Promise<string>;
  loadWhiteboard: (id: string) => Promise<void>;
  updateWhiteboard: (whiteboard: Whiteboard) => Promise<void>;
  addObject: (object: any) => Promise<string>;
  updateObject: (objectId: string, properties: any) => Promise<void>;
  setBackground: (type: BackgroundType) => void;
  saveWhiteboard: () => Promise<void>;
  deleteObject: (objectId: string) => Promise<void>;
  updateCursorPosition: (position: Position | null) => void;
  setSelectedTool: (tool: DrawingTool) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setFillColor: (color: string) => void;
  setOpacity: (opacity: number) => void;
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export const useWhiteboard = (): WhiteboardContextType => {
  const context = useContext(WhiteboardContext);
  if (context === undefined) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
};

interface WhiteboardProviderProps {
  children: ReactNode;
}

export const WhiteboardProvider: React.FC<WhiteboardProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentWhiteboard, setCurrentWhiteboard] = useState<Whiteboard | null>(null);
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Drawing state
  const [selectedTool, setSelectedTool] = useState<DrawingTool>(DrawingTool.PENCIL);
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [fillColor, setFillColor] = useState<string>('transparent');
  const [opacity, setOpacity] = useState<number>(1);
  
  // Cursor positions of collaborators
  const [cursors, setCursors] = useState<CursorPosition[]>([]);

  // Sample data for development
  const sampleWhiteboards: Whiteboard[] = [
    {
      id: 'sample-whiteboard-1',
      name: 'My First Whiteboard',
      ownerId: 'demo-user-1',
      background: BackgroundType.GRID,
      objects: [],
      collaborators: {},
      createdAt: Date.now() - 86400000, // 1 day ago
      updatedAt: Date.now() - 3600000 // 1 hour ago
    },
    {
      id: 'sample-whiteboard-2',
      name: 'Project Ideas',
      ownerId: 'demo-user-1',
      background: BackgroundType.PLAIN,
      objects: [],
      collaborators: {},
      createdAt: Date.now() - 172800000, // 2 days ago
      updatedAt: Date.now() - 7200000 // 2 hours ago
    }
  ];

  // Initialize with sample data
  useState(() => {
    setWhiteboards(sampleWhiteboards);
    setLoading(false);
  });

  const createWhiteboard = async (name: string): Promise<string> => {
    // Create a new whiteboard in local state
    const newId = `whiteboard-${Date.now()}`;
    const newWhiteboard: Whiteboard = {
      id: newId,
      name,
      ownerId: currentUser?.id || 'demo-user-1',
      background: BackgroundType.GRID,
      objects: [],
      collaborators: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Update local state
    setWhiteboards(prev => [...prev, newWhiteboard]);
    setCurrentWhiteboard(newWhiteboard);
    
    return newId;
  };

  const loadWhiteboard = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Find whiteboard in local state
      const whiteboard = whiteboards.find(wb => wb.id === id) || 
                         sampleWhiteboards.find(wb => wb.id === id);
      
      if (whiteboard) {
        setCurrentWhiteboard(whiteboard);
      } else {
        setError(`Whiteboard with ID ${id} not found`);
      }
    } catch (err) {
      console.error("Error loading whiteboard:", err);
      setError("Failed to load whiteboard");
    } finally {
      setLoading(false);
    }
  };

  const updateWhiteboard = async (whiteboard: Whiteboard): Promise<void> => {
    try {
      // Update in local state
      setWhiteboards(prev => 
        prev.map(wb => wb.id === whiteboard.id ? whiteboard : wb)
      );
      
      if (currentWhiteboard?.id === whiteboard.id) {
        setCurrentWhiteboard(whiteboard);
      }
    } catch (err) {
      console.error("Error updating whiteboard:", err);
      setError("Failed to update whiteboard");
    }
  };

  const addObject = async (object: any): Promise<string> => {
    if (!currentWhiteboard) {
      throw new Error("No whiteboard selected");
    }
    
    try {
      const objectId = `obj-${Date.now()}`;
      const newObject: WhiteboardObject = {
        id: objectId,
        type: object.type || 'unknown',
        createdBy: currentUser?.id || 'demo-user-1',
        createdAt: Date.now(),
        properties: object
      };
      
      const updatedWhiteboard = {
        ...currentWhiteboard,
        objects: [...currentWhiteboard.objects, newObject],
        updatedAt: Date.now()
      };
      
      await updateWhiteboard(updatedWhiteboard);
      return objectId;
    } catch (err) {
      console.error("Error adding object:", err);
      setError("Failed to add object");
      throw err;
    }
  };

  const updateObject = async (objectId: string, properties: any): Promise<void> => {
    if (!currentWhiteboard) {
      throw new Error("No whiteboard selected");
    }
    
    try {
      const updatedObjects = currentWhiteboard.objects.map(obj => {
        if (obj.id === objectId) {
          return {
            ...obj,
            properties,
            updatedBy: currentUser?.id || 'demo-user-1',
            updatedAt: Date.now()
          };
        }
        return obj;
      });
      
      const updatedWhiteboard = {
        ...currentWhiteboard,
        objects: updatedObjects,
        updatedAt: Date.now()
      };
      
      await updateWhiteboard(updatedWhiteboard);
    } catch (err) {
      console.error("Error updating object:", err);
      setError("Failed to update object");
    }
  };

  const deleteObject = async (objectId: string): Promise<void> => {
    if (!currentWhiteboard) {
      throw new Error("No whiteboard selected");
    }
    
    try {
      const updatedObjects = currentWhiteboard.objects.filter(obj => obj.id !== objectId);
      
      const updatedWhiteboard = {
        ...currentWhiteboard,
        objects: updatedObjects,
        updatedAt: Date.now()
      };
      
      await updateWhiteboard(updatedWhiteboard);
    } catch (err) {
      console.error("Error deleting object:", err);
      setError("Failed to delete object");
    }
  };

  const updateCursorPosition = (position: Position | null) => {
    if (!currentUser || !position) return;
    
    // Add or update cursor position
    const updatedCursors = cursors.filter(c => c.userId !== currentUser.id);
    
    if (position) {
      updatedCursors.push({
        userId: currentUser.id,
        userName: currentUser.displayName || 'User',
        x: position.x,
        y: position.y,
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
      });
    }
    
    setCursors(updatedCursors);
  };

  // Add the setBackground function
  const setBackground = (type: BackgroundType): void => {
    if (!currentWhiteboard) return;
    
    const updatedWhiteboard = {
      ...currentWhiteboard,
      background: type,
      updatedAt: Date.now()
    };
    
    updateWhiteboard(updatedWhiteboard)
      .catch(err => console.error("Failed to update background:", err));
  };

  // Add the saveWhiteboard function
  const saveWhiteboard = async (): Promise<void> => {
    if (!currentWhiteboard) {
      throw new Error("No whiteboard selected to save");
    }
    
    try {
      // In our non-Firebase version, this just updates the state
      // When Firebase is implemented, this would save to the database
      await updateWhiteboard(currentWhiteboard);
      console.log("Whiteboard saved successfully!");
    } catch (err) {
      console.error("Error saving whiteboard:", err);
      setError("Failed to save whiteboard");
      throw new Error("Failed to save whiteboard");
    }
  };

  const value = {
    currentWhiteboard,
    whiteboards,
    loading,
    error,
    selectedTool,
    strokeColor,
    strokeWidth,
    fillColor,
    opacity,
    cursors,
    createWhiteboard,
    loadWhiteboard,
    updateWhiteboard,
    addObject,
    updateObject,
    deleteObject,
    updateCursorPosition,
    setSelectedTool,
    setStrokeColor,
    setStrokeWidth,
    setFillColor,
    setOpacity,
    setBackground,
    saveWhiteboard
  };

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  );
};
