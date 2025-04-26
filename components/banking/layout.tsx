"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  PiggyBank,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BehaviorTracker from "@/components/behavior-tracker"
import { trackUserNavigation } from "@/lib/banking-security"

interface BankingLayoutProps {
  children: React.ReactNode
}

export default function BankingLayout({ children }: BankingLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      const storedUsername = localStorage.getItem("username")
      const token = localStorage.getItem("token")

      if (!storedUsername || !token) {
        console.log("Banking layout: User not authenticated, redirecting to login")
        router.push("/login?redirect=/banking")
        return
      }

      setIsAuthenticated(true)

      // Track this page visit
      const currentSection = pathname?.split("/")[2] || "dashboard"
      trackUserNavigation(currentSection)

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")

    // Clear the auth cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    router.push("/login")
  }

  const navigationItems = [
    { name: "Dashboard", href: "/banking", icon: LayoutDashboard },
    { name: "Accounts", href: "/banking/accounts", icon: CreditCard },
    { name: "Transfers", href: "/banking/transfers", icon: ArrowRightLeft },
    { name: "Investments", href: "/banking/investments", icon: PiggyBank },
    { name: "Notifications", href: "/banking/notifications", icon: Bell },
    { name: "Settings", href: "/banking/settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Don't render anything while checking authentication
  }

  return (
    <BehaviorTracker duration={60000} autoStart={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="bg-primary text-primary-foreground shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span className="font-bold text-xl">SecureBank</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Banking
                </Button>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-primary-foreground/10">
              <div className="container py-4">
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Banking
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const isActive =
                        pathname === item.href || (item.href !== "/banking" && pathname?.startsWith(item.href))

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </BehaviorTracker>
  )
}
