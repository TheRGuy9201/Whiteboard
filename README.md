# EduBoard Pro

A collaborative, real-time whiteboard application designed for educational purposes.

## Features

- 🖌️ Real-time collaborative whiteboard
- 🎨 Multiple drawing tools (pen, shapes, text, etc.)
- 📁 Save and load whiteboards
- 📊 Grid and custom backgrounds
- 🌓 Light and dark themes
- 📱 Responsive design for different devices

## Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Material UI & Tailwind CSS
- **Canvas**: Fabric.js
- **State Management**: React Context API
- **Routing**: React Router
- **Real-time Communication**: Socket.IO client

### Backend
- **Server**: Node.js with Express
- **WebSockets**: Socket.IO
- **Language**: TypeScript

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
