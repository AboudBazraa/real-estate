import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Log for debugging
  console.log("Middleware: Updating session");
  console.log(
    "Middleware: Cookies available:",
    request.cookies.getAll().map((c) => c.name)
  );

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll();
          console.log(
            "Middleware getAll cookies:",
            cookies.map((c) => c.name)
          );
          return cookies;
        },
        setAll(cookiesToSet) {
          console.log(
            "Middleware setting cookies:",
            cookiesToSet.map((c) => c.name)
          );
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`Setting cookie in response: ${name}`, options);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // refreshing the auth token
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Middleware error refreshing auth:", error.message);
    } else {
      console.log(
        "Middleware: Auth refreshed successfully",
        data?.user?.id ? "User found" : "No user"
      );
    }
  } catch (e) {
    console.error("Middleware: Exception refreshing auth:", e);
  }

  return supabaseResponse;
}
