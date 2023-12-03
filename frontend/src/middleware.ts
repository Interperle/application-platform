import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthorized } from "./actions/auth";
import { UserRole } from "./utils/userRole";

export async function middleware(request: NextRequest) {
  console.log("Enter Middleware");

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  if (!user) {
    console.log("Not logged in -> /login");
    if (pathname != "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  let redirectUrl = null;

  if (pathname.startsWith("/review")) {
    redirectUrl = await isAuthorized(supabase, UserRole.Reviewer);
  } else if (pathname.startsWith("/admin")) {
    redirectUrl = await isAuthorized(supabase, UserRole.Admin);
  }

  if (redirectUrl) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // if user is signed in and the current path is /login redirect the user to /
  if (user && request.nextUrl.pathname === "/login") {
    console.log("redirect to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/review", "/admin"],
};
