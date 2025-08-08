import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    // Protect admin routes - only allow ADMIN role
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Protect dashboard routes - require authentication
    if (isDashboardPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
