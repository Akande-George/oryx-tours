import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

type ProfileAccess = {
  role: "customer" | "admin" | "partner";
  status: "active" | "pending" | "rejected";
};

const roleHomePath: Record<ProfileAccess["role"], string> = {
  customer: "/dashboard",
  admin: "/admin",
  partner: "/partner",
};

const isProtectedPath = (pathname: string) =>
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/admin") ||
  pathname.startsWith("/partner");

const isAuthPage = (pathname: string) =>
  pathname === "/sign-in" || pathname === "/sign-up";

const toSignIn = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.searchParams.set("next", next);
  return NextResponse.redirect(url);
};

const toRoleHome = (request: NextRequest, role: ProfileAccess["role"]) => {
  const url = request.nextUrl.clone();
  url.pathname = roleHomePath[role];
  url.search = "";
  return NextResponse.redirect(url);
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isProtectedPath(pathname)) {
      return toSignIn(request);
    }
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,status")
    .eq("id", user.id)
    .maybeSingle<ProfileAccess>();

  if (!profile) {
    await supabase.auth.signOut();
    return toSignIn(request);
  }

  if (profile.status !== "active" && isProtectedPath(pathname)) {
    await supabase.auth.signOut();
    return toSignIn(request);
  }

  if (isAuthPage(pathname)) {
    return toRoleHome(request, profile.role);
  }

  if (pathname.startsWith("/admin") && profile.role !== "admin") {
    return toRoleHome(request, profile.role);
  }

  if (pathname.startsWith("/partner") && profile.role !== "partner") {
    return toRoleHome(request, profile.role);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
