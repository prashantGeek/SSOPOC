# SSO Frontend

This is the frontend application for the Single Sign-On (SSO) Proof of Concept.

## Features

- 🔐 **Organization-based Authentication** - Users login with their organization domain
- 👤 **User Registration** - New users can register with their organization
- 📊 **Dashboard** - View profile and organization users
- 🎨 **Modern UI** - Built with Tailwind CSS and responsive design
- 🔒 **JWT Authentication** - Secure token-based authentication
- 📱 **Mobile Responsive** - Works on all device sizes

## Tech Stack

- **Framework**: Next.js 15.3.5
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: JWT tokens
- **API Client**: Custom fetch-based client

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 3002

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3001

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Dashboard.tsx      # Dashboard component
│   ├── LoginForm.tsx      # Login form
│   └── RegisterForm.tsx   # Registration form
├── types/                 # TypeScript types
│   └── auth.ts           # Authentication types
├── utils/                 # Utility functions
│   └── api.ts            # API client
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json          # Dependencies
```

## API Integration

The frontend connects to the backend API running on port 3002. API calls are proxied through Next.js configuration.

### Available API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `GET /api/organization/users` - Get organization users

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Test Credentials

- **Admin User**: admin@company.com / password
- **Regular User**: user@company.com / password
- **Organization Domain**: company.com

## Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Authentication Flow
1. Users enter their organization domain, email, and password
2. Frontend sends login request to backend API
3. Backend validates credentials and returns JWT token
4. Token is stored in localStorage
5. Protected routes require valid token

### Dashboard Features
- **Profile Tab**: View user information and organization details
- **Users Tab**: View all users in the organization (with role-based styling)
- **Responsive Design**: Works on desktop and mobile
- **Role Indicators**: Color-coded badges for different user roles

### Security
- JWT tokens stored in localStorage
- Automatic token validation
- Redirect to login if token is invalid
- Protected routes with authentication checks

## Contributing

1. Make changes in the appropriate component files
2. Test with the backend API
3. Ensure responsive design works
4. Update types if API changes
