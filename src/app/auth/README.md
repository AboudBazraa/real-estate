# Authentication Protection in Next.js with Supabase

This directory contains components and utilities for managing authentication and protecting routes in the application.

## Route Protection

### 1. Server-Side Protection with Middleware

The application uses Next.js middleware to protect routes on the server side. The middleware:

- Checks if a user is authenticated
- Redirects authenticated users away from auth pages
- Uses role-based redirects to appropriate dashboards

### 2. Client-Side Protection with Hooks and Components

#### Using the `useRouteProtection` Hook

```tsx
"use client";
import { useRouteProtection } from "@/app/auth/hooks/useRouteProtection";

export default function AdminDashboard() {
  // Protect this route - require authentication and admin role
  const { isLoading, isAuthenticated, isAuthorized } = useRouteProtection({
    requireAuth: true,
    allowedRoles: ["admin"],
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingComponent />;
  }

  // If user reaches this point, they're authenticated and authorized
  return <YourComponent />;
}
```

#### Using the `ProtectedRoute` Component

For protected pages (requiring authentication):

```tsx
"use client";
import { ProtectedRoute } from "@/app/auth/components/ProtectedRoute";

export default function AgentDashboard() {
  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["agent", "admin"]}>
      {/* Your dashboard content */}
      <h1>Agent Dashboard</h1>
      {/* ... */}
    </ProtectedRoute>
  );
}
```

For authentication pages (only for non-authenticated users):

```tsx
"use client";
import { ProtectedRoute } from "@/app/auth/components/ProtectedRoute";

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      {/* Your login form */}
      <h1>Login</h1>
      <LoginForm />
      {/* ... */}
    </ProtectedRoute>
  );
}
```

## Redirect Logic

- Unauthenticated users trying to access protected routes → redirected to `/auth/login`
- Authenticated users trying to access auth pages → redirected based on role:
  - Admin users → `/admin`
  - Agent users → `/agent`
  - Regular users → `/properties`

## Implementation Details

- `middleware.ts`: Server-side protection for all routes
- `useRouteProtection.ts`: Hook for flexible client-side protection
- `ProtectedRoute.tsx`: HOC component for simpler route protection
