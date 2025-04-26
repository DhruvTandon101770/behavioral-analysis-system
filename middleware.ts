import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/audit", "/banking"]

// Demo credentials for dashboard and audit log
const DEMO_USERNAME = "admin"
const DEMO_PASSWORD = "admin123" // This would be hashed in a real application

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get the token from the cookie
    const token = request.cookies.get("token")?.value

    // If there's no token, redirect to login
    if (!token) {
      const url = new URL("/login", request.url)
      // Add the original URL as a parameter to redirect back after login
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }

    // For dashboard and audit log, require admin credentials
    if ((pathname.startsWith("/dashboard") || pathname.startsWith("/audit")) && token !== "admin-token") {
      // Check if basic auth is provided
      const authHeader = request.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Basic ")) {
        // No auth header, prompt for credentials
        return new NextResponse("Authentication required", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Dashboard Access", charset="UTF-8"',
          },
        })
      }

      // Verify credentials
      const credentials = atob(authHeader.split(" ")[1])
      const [username, password] = credentials.split(":")

      if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
        // Invalid credentials
        return new NextResponse("Invalid credentials", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Dashboard Access", charset="UTF-8"',
          },
        })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/audit/:path*", "/banking/:path*"],
}
