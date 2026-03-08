# Karman Core - Orbital Engine v1

A modern, high-performance chatbot interface with a sleek UI.

## Features

- **Dynamic Chat Interface**: Real-time markdown rendering, copyable code blocks, and animated message states.
- **Mission Control Layout**: Sidebar with categorization for Active Missions (today) and Past Trajectories (older).
- **Optimized Performance**: Memoized React components (`React.memo`, `useMemo`) to prevent unnecessary re-renders during typing and streaming.
- **Real-time Engine**: Socket.io integration for instant AI responses.

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS (with custom `karman` design system)
- Framer Motion (Animations)
- TanStack Query (Server State Management)
- TanStack Router (Routing)
- React Hook Form (Input Management)
- Markdown Support (`react-markdown`, `remark-gfm`)
- Lucide React (Icons)

### Backend

- Node.js / Express
- MongoDB (via Mongoose)
- Socket.io (Real-time communication)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies for both Frontend and Backend:

   ```bash
   # In root directory, if you have a package.json here (Optional workspaces setup)
   # Otherwise, run inside each folder:

   cd Backend
   npm install

   cd ../Frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `Backend` directory:

```env

PORT=5000
MONGODB_URI=your_mongodb_connection_string
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file in the `Frontend` directory (if needed):

```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the Backend server:

   ```bash
   cd Backend
   npm run dev
   ```

2. Start the Frontend dev server:
   ```bash
   cd Frontend
   npm run dev
   ```
