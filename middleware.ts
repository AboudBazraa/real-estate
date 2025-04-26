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
