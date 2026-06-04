import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/", "/about", "/admission", "/announcement", "/services", "/student-handbook"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const isApiAuthPath = pathname.startsWith("/api/auth");
  const isPortalPath = pathname.startsWith("/portal");
  const isAdminPath = pathname.startsWith("/portal/admin");

  if (isApiAuthPath || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isPortalPath && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && token?.role !== "super_admin") {
    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  }

  if (pathname === "/login" && token) {
    if (token.role === "super_admin") {
      return NextResponse.redirect(new URL("/portal/admin", req.url));
    }
    return NextResponse.redirect(new URL("/portal/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
