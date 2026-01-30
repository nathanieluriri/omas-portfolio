import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_SUCCESS_PATH = "/admin/success";
const ADMIN_ERROR_PATH = "/admin/error";
const REFRESH_COOKIE = "admin.refresh_token";

function isStaticOrApiPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticOrApiPath(pathname)) {
    return NextResponse.next();
  }

  const hasUserId = Boolean(process.env.NEXT_PUBLIC_USER_ID?.trim());
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminAuthPath =
    pathname === ADMIN_LOGIN_PATH ||
    pathname === ADMIN_SUCCESS_PATH ||
    pathname === ADMIN_ERROR_PATH;

  if (!hasUserId && !isAdminPath) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (isAdminPath && !isAdminAuthPath) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
