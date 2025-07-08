import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { WhiteboardProvider } from '@/contexts/WhiteboardContext'
import HomePage from '@/pages/HomePage'
import WhiteboardPage from '@/pages/WhiteboardPage'
import DashboardPage from '@/pages/DashboardPage'

function App() {
  return (
    <ThemeProvider>
      <WhiteboardProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </div>
        </Router>
      </WhiteboardProvider>
    </ThemeProvider>
  )
}

export default App
