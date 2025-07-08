# Whiteboard Pro

A modern, collaborative whiteboard application built with React, TypeScript, and Socket.IO.

## Features

- 🎨 **Real-time Drawing**: Collaborative drawing with multiple users
- 🔧 **Drawing Tools**: Pen, highlighter, eraser, and selection tools
- 🎨 **Color Palette**: Customizable colors and brush sizes
- 👥 **Live Collaboration**: See other users' cursors and drawings in real-time
- 🌓 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Performance Optimized**: Smooth drawing experience with Canvas API

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Konva** for canvas drawing
- **Socket.IO Client** for real-time communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Socket.IO** for WebSocket communication
- **TypeScript** for type safety
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/whiteboard-pro.git
cd whiteboard-pro
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install server dependencies:
```bash
cd server
npm install
cd ..
```

4. Set up environment variables:
```bash
cd server
cp .env.example .env
```

### Development

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

1. Build the frontend:
```bash
npm run build
```

2. Build the server:
```bash
cd server
npm run build
```

## Project Structure

```
whiteboard-pro/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── WhiteboardCanvas.tsx
│   │   ├── collaboration/
│   │   │   └── UserCursors.tsx
│   │   └── toolbar/
│   │       └── Toolbar.tsx
│   ├── contexts/
│   │   ├── ThemeContext.tsx
│   │   └── WhiteboardContext.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── HomePage.tsx
│   │   └── WhiteboardPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   └── socketHandlers.ts
│   └── package.json
├── package.json
└── README.md
```

## Features in Detail

### Drawing Tools
- **Pen Tool**: Standard drawing with customizable colors and sizes
- **Highlighter**: Semi-transparent highlighting tool
- **Eraser**: Remove parts of drawings
- **Selection Tool**: Move and select drawn elements (coming soon)

### Collaboration Features
- **Real-time Drawing**: All users see drawings instantly
- **User Cursors**: See where other users are pointing
- **User Indicators**: Visual indication of who's in the room
- **Room System**: Join specific rooms with unique IDs

### UI Features
- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Theme Support**: Light and dark modes
- **Smooth Animations**: Framer Motion animations
- **Grid Background**: Optional grid for better drawing alignment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- [ ] Math equation support (LaTeX)
- [ ] Shape tools (rectangle, circle, arrow)
- [ ] Image upload and insertion
- [ ] Export to PDF/PNG
- [ ] Voice chat integration
- [ ] Layers support
- [ ] Undo/Redo with history
- [ ] User authentication
- [ ] Persistent storage
- [ ] Mobile app version
