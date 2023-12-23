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
      console.log("redirect to /login");
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
    console.log("redirect to " + redirectUrl);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (user) {
    const { data: roleData, error: roleError } = await supabase
      .from("user_profiles_table")
      .select("isactive")
      .eq("userid", user!.id)
      .single();
    if (roleData && !roleData.isactive) {
      console.log("redirect to /403");
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // if user is signed in and the current path is /login redirect the user to /
    if (request.nextUrl.pathname === "/login") {
      console.log("redirect to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/review", "/admin", "/settings"],
};
