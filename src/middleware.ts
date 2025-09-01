import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    // Protect dashboard routes - require authentication
    if (isDashboardPage) {
      if (!isAuth) {
        // Preserve the original URL for redirect after signin
        const signInUrl = new URL("/auth/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      } else if (
        req.nextUrl.pathname === "/dashboard" &&
        token?.role !== "ADMIN"
      ) {
        return NextResponse.redirect(new URL("/dashboard/songs", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
