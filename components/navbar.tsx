"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in on client side only
  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    setIsLoggedIn(!!storedUsername)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")

    // Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            BehaviorSys
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/audit"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/audit" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Audit Log
              </Link>
              <Link
                href="/banking"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/banking" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Banking
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/audit"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Audit Log
                </Link>
                <Link
                  href="/banking"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Banking
                </Link>
              </>
            )}

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
