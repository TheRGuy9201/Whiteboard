# EduBoard Pro: Math Notebook Edition

A collaborative, real-time notebook application designed specifically for mathematics education.

## Features

### � Notebook Structure
- **Hierarchical Organization**: Notebooks > Sections > Pages
- **Intuitive Navigation**: Page thumbnails, navigation controls, and section management
- **Multiple Notebooks**: Create separate notebooks for different classes or subjects

### 🎨 Drawing & Writing Tools
- **Pen Tool**: Multiple thicknesses (thin/medium/thick)
- **Color Picker**: Predefined theme with custom color options
- **Highlighter Tool**: Semi-transparent highlighting
- **Eraser Tool**: Object-wise or freehand erasing
- **Text Tool**: Type text with formatting options

### ➗ Math-Friendly Features
- **Equation Editor**: LaTeX input with real-time rendering
- **Graph Plotting**: Plot mathematical functions with customizable ranges
- **Geometric Tools**: Compass, ruler, protractor, coordinate axes
- **Background Options**: Grid/ruled/plain backgrounds

### 📤 Export and Save
- **Export Options**: Export as PDF or PNG/JPEG
- **Autosave**: Automatic saving of progress
- **Version History**: Undo/redo across sessions

### 🤝 Real-Time Collaboration
- **Shareable Whiteboards**: Collaborate via shareable links
- **Live Cursors**: See collaborators' cursors with names
- **Role-based Access**: Read/write/annotate permissions
- **Chat**: Built-in chat sidebar for discussions

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Material UI
- **Canvas**: Fabric.js
- **Math Rendering**: KaTeX for LaTeX equations
- **Function Plotting**: Function-plot library
- **State Management**: React Context API
- **Routing**: React Router
- **Real-time Communication**: Socket.IO client
- **Styling**: Custom CSS variables with light/dark themes

### Backend
- **Server**: Node.js with Express
- **WebSockets**: Socket.IO
- **Language**: TypeScript
- **Data Storage**: In-memory with option for persistence

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eduboard-pro.git
   cd eduboard-pro
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both root and server directories
   - Update the variables as needed

4. Start the development servers:
   ```bash
   # Start the backend server
   cd server
   npm run dev
   
   # In a new terminal, start the frontend
   cd ..
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
# Build the frontend
npm run build

# Build the server
cd server
npm run build
```

## Deployment Options

Several deployment options are available:

1. **Traditional Hosting**:
   - Deploy the frontend build to any static hosting service
   - Host the Node.js server on a service like Heroku, DigitalOcean, etc.

2. **Cloud Services**:
   - AWS (Amplify for frontend, Lambda for backend functions)
   - Google Cloud (App Engine)
   - Azure (Static Web Apps)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Color Palette

### Light Theme
- Background: #F4F6F8
- Primary: #1E88E5
- Secondary: #7E57C2
- Error: #E53935
- Success: #43A047
- Warning: #FDD835
- Text: #212121

### Dark Theme
- Background: #121212
- Primary: #4FC3F7
- Secondary: #B39DDB
- Error: #EF5350
- Success: #66BB6A
- Warning: #FFEE58
- Text: #FFFFFF

### Pen Colors
- Blue: #1E88E5 (Math highlights)
- Red: #E53935 (Important concepts)
- Green: #43A047 (Correct steps)
- Yellow: #FDD835 (Highlights)
- Black: #212121 (Base writing)
- White: #FFFFFF (On dark theme)
- Purple: #7E57C2 (Special notations)

## Usage Guide

### Creating a Notebook
1. Click "New Notebook" on the dashboard
2. Enter a name (e.g., "Class 10 Algebra")
3. Add sections and pages as needed

### Working with Math Tools
1. Use the LaTeX tool for equations: Click the function (ƒ) icon and enter your LaTeX
2. Plot functions: Click the graph icon and enter your function with desired ranges
3. Use geometric tools: Select ruler, compass, or protractor from the toolbar

### Collaboration
1. Share your notebook using the share icon in the top bar
2. Chat with collaborators using the chat panel
3. See who's actively working by their cursor indicators

### Exporting Your Work
1. Click the export icon in the top bar
2. Select PDF or Image format
3. Download the exported file
