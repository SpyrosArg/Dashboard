# CyberSecurity Request Portal

A modern, production-ready web application for managing cybersecurity access requests across different departments. The portal features a sleek, glass-morphism design with animated gradients and a focus on user experience.

![Cybersecurity Portal](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom animations
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context
- **Data Persistence**: LocalStorage
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Quick Start

1. Clone the repository
2. Install dependencies:

npm install

3. Start the development server:

npm run dev

The application will be available at `http://localhost:5173`

## Available Routes

- `/` - User submission portal
- `/login` - Admin login (use: admin/admin)
- `/admin` - Admin dashboard (protected route)

## Components

- **RequestForm**: User request submission form with file uploads
- **RequestCard**: Display individual requests with status indicators
- **EmptyState**: Empty state placeholder
- **ProtectedRoute**: Route guard with session management
- **Globe**: Network visualization component

### User Portal

- Submit security access requests
- Upload supporting documentation (HLD, LLD, SDD)
- Track request status
- Provide business justification
- Specify technical requirements
- Form validation with error handling

### Admin Dashboard

- Real-time request monitoring
- Status overview statistics
- Team member assignment
- Request approval/rejection with animations
- Document review system
- Dark/Light theme toggle
- Secure logout functionality
- Separate rejected requests view

### Security

- Protected admin routes
- Role-based access control
- Session management with timeout
- Secure authentication system
- Form validation and sanitization

### Data Persistence

- Local storage for requests
- Theme preference saving
- Session management
- Request history tracking
