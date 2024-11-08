import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  // Define paths that don't require authentication
  const unprotectedPaths = ["/login", "/signup"];

  // Get the current pathname
  const { pathname } = req.nextUrl;

  if (token) {
    // User is signed in
    if (unprotectedPaths.includes(pathname)) {
      // Redirect signed-in user away from login or signup page
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    // User is not signed in
    if (!unprotectedPaths.some((path) => pathname.startsWith(path))) {
      // Redirect non-signed-in user to login page for protected routes
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Define the paths where the middleware should apply
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"], // Ensure these paths are correct
};
