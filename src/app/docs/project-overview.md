# Project Overview

## 1. Project Structure
```
src/
├── app/
│   ├── page.jsx                # Main application entry point
│   ├── layout.jsx              # Global layout component
│   ├── loading.tsx             # Loading state handler
│   ├── (dashboard)/            # Dashboard routes
│   ├── auth/                  # Authentication routes and components
│   │   ├── page.jsx           # Auth entry point
│   │   ├── components/        # Auth components
│   │   │   └── LoginForm.tsx # Login form component
│   │   ├── hooks/             # Auth hooks
│   │   ├── login/             # Login route
│   │   │   ├── page.tsx      # Login page
│   │   │   └── api/          # Login API routes
│   │   │       └── route.ts  # Login API route definition
│   │   ├── registration/      # Registration route
│   │   │   └── page.tsx     # Registration page
│   │   ├── services/          # Auth services
│   │   │   └── auth.ts      # Authentication service
│   │   └── types/            # Auth type definitions
│   ├── interactive-map/       # Interactive map feature
│   │   ├── page.jsx          # Map entry point
│   │   ├── components/       # Map components
│   │   ├── hooks/             # Map hooks
│   │   ├── services/          # Map services
│   │   └── types/            # Map type definitions
│   ├── properties/           # Property listings feature
│   │   ├── page.jsx          # Properties entry point
│   │   ├── components/       # Property components
│   │   ├── hooks/             # Property hooks
│   │   ├── services/          # Property services
│   │   └── types/            # Property type definitions
│   └── shared/              # Shared components and utilities
│       ├── components/       # Reusable UI components
│       │   ├── app-sidebar.tsx # Application sidebar
│       │   ├── login-form.tsx  # Login form
│       │   ├── nav-main.tsx    # Main navigation
│       │   ├── nav-projects.tsx # Projects navigation
│       │   ├── nav-secondary.tsx # Secondary navigation
│       │   ├── nav-user.tsx    # User navigation
│       │   ├── NavBar.jsx      # Navigation bar
│       │   ├── register-form.tsx # Registration form
│       │   └── ThemeProvider.tsx # Theme provider
│       ├── constants/        # Application constants
│       │   └── sidebar.txt   # Sidebar configuration
│       ├── hooks/             # Custom hooks
│       │   ├── use-mobile.ts  # Mobile detection hook
│       │   └── use-toast.ts  # Toast notification hook
│       ├── lib/              # Utility libraries
│       │   └── utils.ts      # General utilities
│       ├── styles/           # Global styles
│       └── types/            # Type definitions
```

## 2. Authentication System
The authentication system consists of:
- Login and registration pages
- Authentication services (auth.ts)
- Type definitions for auth
- API routes for login

## 3. Shared Components
The project includes a variety of reusable UI components:
- Navigation components (NavBar, nav-main, nav-secondary)
- Form components (LoginForm, register-form)
- UI elements (button, card, dropdown-menu, etc.)
- ThemeProvider for consistent styling

## 4. Configuration Files
Key configuration files:
- next.config.mjs      # Next.js configuration
- tsconfig.json        # TypeScript configuration
- eslint.config.mjs    # ESLint configuration
- postcss.config.mjs   # PostCSS configuration
- jsconfig.json        # JavaScript configuration

## 5. Key Dependencies
From package.json:
- next: ^12.3.4
- react: ^18.2.0
- typescript: ^5.3.2
- @swc/core: ^1.3.38