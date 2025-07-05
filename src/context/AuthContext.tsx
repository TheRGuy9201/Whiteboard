import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { UserRole } from '../types';

// Define a simplified User type
interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Create a demo user for development
  const demoUser: User = {
    id: 'demo-user-1',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null,
    role: UserRole.ADMIN
  };

  const [currentUser, setCurrentUser] = useState<User | null>(demoUser);
  const [loading] = useState(false);

  // Simplified sign-in that just sets the demo user
  const signIn = async (): Promise<void> => {
    setCurrentUser(demoUser);
  };

  // Simplified sign-out
  const signOut = async (): Promise<void> => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
