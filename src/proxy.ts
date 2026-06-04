import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRequiredPermission } from "@/lib/admin-permissions";

const alwaysAllowedAdminPaths = ["/portal/admin", "/portal/admin/profile"];

function nextWithPathname(req: NextRequest, pathname: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isApiAuthPath = pathname.startsWith("/api/auth");
  if (isApiAuthPath || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return nextWithPathname(req, pathname);
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isPortalPath = pathname.startsWith("/portal");
  if (isPortalPath && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminPath = pathname.startsWith("/portal/admin");
  if (isAdminPath && token) {
    const isSuperAdmin = token.role === "super_admin";
    const staffPermissions = (token.permissions ?? []) as string[];

    if (isSuperAdmin) {
      // super admin bypasses all checks
    } else if (alwaysAllowedAdminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      // profile and dashboard are always allowed for any admin-access user
    } else {
      const required = getRequiredPermission(pathname);
      if (required && !staffPermissions.includes(required)) {
        return NextResponse.redirect(new URL("/portal/admin", req.url));
      }
      if (!required) {
        // unknown admin route — block if not super admin
        return NextResponse.redirect(new URL("/portal/admin", req.url));
      }
    }
  }

  if (pathname === "/login" && token) {
    const isSuperAdmin = token.role === "super_admin";
    const staffPermissions = (token.permissions ?? []) as string[];
    const hasAdminAccess = isSuperAdmin || staffPermissions.length > 0;
    if (hasAdminAccess) {
      return NextResponse.redirect(new URL("/portal/admin", req.url));
    }
    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  }

  return nextWithPathname(req, pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
