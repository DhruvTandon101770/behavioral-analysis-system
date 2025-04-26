"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BankingLayout from "@/components/banking/layout"
import AccountOverview from "@/components/banking/account-overview"
import RecentTransactions from "@/components/banking/recent-transactions"
import QuickActions from "@/components/banking/quick-actions"
import SecurityAlert from "@/components/banking/security-alert"
import { trackUserNavigation } from "@/lib/banking-security"

export default function BankingDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    if (!username || !token) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)

    // Track this page visit
    trackUserNavigation("dashboard")

    // Check if there's a security message
    const securityMessage = localStorage.getItem("securityAlert")
    if (securityMessage) {
      setAlertMessage(securityMessage)
      setShowAlert(true)
      localStorage.removeItem("securityAlert")
    }
  }, [router])

  if (!isAuthenticated) {
    return null // Don't render anything while checking authentication
  }

  return (
    <BankingLayout>
      {showAlert && <SecurityAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <AccountOverview />
        </div>
        <div className="col-span-1">
          <QuickActions />
        </div>
        <div className="col-span-3">
          <RecentTransactions />
        </div>
      </div>
    </BankingLayout>
  )
}
