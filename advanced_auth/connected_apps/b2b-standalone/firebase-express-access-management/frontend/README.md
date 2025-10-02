# Access Request Manager Frontend

A clean, minimal React frontend for the Access Request Manager API built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Login and signup with token-based auth
- **Organization Management**: Create, join, and manage organizations
- **Access Requests**: Create, view, and manage access requests
- **Admin Controls**: Approve/deny requests with reasoning
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running on port 3000

### Installation

1. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login form
│   ├── Signup.tsx      # Signup form
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Organizations.tsx # Organization list
│   ├── OrganizationDetail.tsx # Organization details
│   ├── MyRequests.tsx  # User's requests
│   └── Layout.tsx      # App layout wrapper
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utilities and API client
│   └── api.ts         # API client with axios
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types
├── App.tsx            # Main app component with routing
├── main.tsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## Key Components

### Authentication

- **Login/Signup**: Clean forms with validation
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Token Management**: Automatic token handling and refresh

### Organization Management

- **Organization List**: View all user's organizations
- **Create Organization**: Simple form to create new organizations
- **Organization Details**: View members and requests
- **Join/Leave**: Easy organization membership management

### Access Requests

- **Create Requests**: Form to request access to resources
- **View Requests**: List all user's requests with status
- **Admin Actions**: Approve/deny requests with reasoning
- **Status Tracking**: Visual status indicators

## API Integration

The frontend communicates with the backend API through a centralized API client (`lib/api.ts`) that:

- Handles authentication tokens automatically
- Provides type-safe API calls
- Manages error handling and redirects
- Uses axios interceptors for request/response handling

## Styling

The app uses Tailwind CSS for styling with:

- **Responsive Design**: Mobile-first approach
- **Consistent Colors**: Indigo primary color scheme
- **Clean Typography**: System font stack
- **Accessible Components**: Proper focus states and contrast
- **Custom Utilities**: Reusable component classes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

The frontend is configured to proxy API requests to `http://localhost:3000` during development. Make sure your backend is running on port 3000.

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Serve the `dist` directory with any static file server

3. Configure your backend to serve the frontend files or use a CDN

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
