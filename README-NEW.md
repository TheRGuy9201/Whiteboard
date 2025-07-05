# EduBoard Pro

A feature-rich, collaborative web-based whiteboard application for interactive learning.

## 🚀 Features

### Core Features
- 🎨 Clean, responsive UI with light/dark modes
- ✍️ Advanced drawing tools (pencil, shapes, text, highlighter, etc.)
- 🔁 Real-time collaboration via Socket.IO
- 🔐 User authentication with Firebase
- 💾 Save and export functionality

### Advanced Features
- 🎥 Audio & video integration capabilities
- 🔴 Session recording
- 🧪 Quizzes & polls
- 🧠 AI-powered drawing tools (planned)
- 📲 Responsive design for all devices

## 📋 Prerequisites

- Node.js 16+ and npm
- Firebase account for authentication and storage
- [Optional] Firebase Admin SDK service account for server-side operations

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Material UI + Tailwind CSS
- **Canvas**: Fabric.js
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Real-time**: Socket.IO
- **Backend**: Node.js + Express

## 🏗️ Project Structure

```
/
├── src/                      # Frontend source code
│   ├── components/           # Reusable components
│   │   ├── auth/             # Authentication-related components
│   │   ├── canvas/           # Canvas and drawing components
│   │   └── toolbar/          # Toolbar and controls
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Application pages
│   ├── services/             # Service integrations (Firebase, Socket.IO)
│   └── types.ts              # TypeScript type definitions
├── server/                   # Backend server code
│   ├── src/                  # Server source code
│   └── package.json          # Server dependencies
└── package.json              # Frontend dependencies
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eduboard-pro.git
cd eduboard-pro
```

### 2. Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Get your Firebase config and update the `.env` file

4. Start the development server:
```bash
npm run dev
```

### 3. Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure Firebase Admin:
   - In Firebase Console, go to Project Settings > Service Accounts
   - Generate a new private key
   - Convert the JSON to a single line and add to `.env` as FIREBASE_SERVICE_ACCOUNT

5. Start the server:
```bash
npm run dev
```

## 📱 Usage

1. Open your browser to `http://localhost:5173`
2. Register/login using email or Google auth
3. Create a new whiteboard or open an existing one
4. Use the toolbar to select different drawing tools
5. Share the whiteboard URL with others for collaboration

## 🔑 Keyboard Shortcuts

- **P**: Pencil tool
- **L**: Line tool
- **R**: Rectangle tool
- **C**: Circle/Ellipse tool
- **T**: Text tool
- **N**: Sticky note
- **H**: Highlighter
- **E**: Eraser
- **S**: Selection tool
- **V**: Pan tool

## 🚀 Deployment

### Frontend

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to services like:
   - Firebase Hosting
   - Vercel
   - Netlify

### Backend

1. Build the server:
```bash
cd server
npm run build
```

2. Deploy to services like:
   - Render
   - Railway
   - Fly.io
   - Heroku

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
