import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/shared/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Update user's auth session
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Check if the current route is an auth page
  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/registration") ||
    pathname === "/auth";

  // Check if the current route is a protected page
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/search/[id]") ||
    pathname.startsWith("/agent") ||
    pathname.startsWith("/admin");

  // Get the authentication cookie to determine if user is logged in
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // This is handled by updateSession
        },
      },
    }
  );

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in and trying to access auth pages, redirect to homepage
  if (user && isAuthPage) {
    // Determine redirect based on user role if available
    const userRole = user.user_metadata?.role?.toLowerCase() || "user";

    let redirectUrl;
    if (userRole === "admin") {
      redirectUrl = "/admin";
    } else if (userRole === "agent") {
      redirectUrl = "/agent";
    } else {
      redirectUrl = "/properties";
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!user && isProtectedRoute) {
    // Add a searchParam to indicate which page they were trying to access
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
