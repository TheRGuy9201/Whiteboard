import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Theme } from '@/types'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('whiteboard-theme')
    return savedTheme ? JSON.parse(savedTheme) : {
      mode: 'light',
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: 'hsl(221.2 83.2% 53.3%)',
        secondary: 'hsl(210 40% 96%)',
        accent: 'hsl(210 40% 96%)',
        muted: 'hsl(210 40% 96%)',
        border: 'hsl(214.3 31.8% 91.4%)',
      }
    }
  })

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
      colors: prev.mode === 'light' ? {
        background: 'hsl(222.2 84% 4.9%)',
        foreground: 'hsl(210 40% 98%)',
        primary: 'hsl(217.2 91.2% 59.8%)',
        secondary: 'hsl(217.2 32.6% 17.5%)',
        accent: 'hsl(217.2 32.6% 17.5%)',
        muted: 'hsl(217.2 32.6% 17.5%)',
        border: 'hsl(217.2 32.6% 17.5%)',
      } : {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: 'hsl(221.2 83.2% 53.3%)',
        secondary: 'hsl(210 40% 96%)',
        accent: 'hsl(210 40% 96%)',
        muted: 'hsl(210 40% 96%)',
        border: 'hsl(214.3 31.8% 91.4%)',
      }
    }))
  }

  useEffect(() => {
    localStorage.setItem('whiteboard-theme', JSON.stringify(theme))
    document.documentElement.classList.toggle('dark', theme.mode === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
