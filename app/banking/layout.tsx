"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isUserLockedOut, getRemainingLockoutTime } from "@/lib/banking-security"

export default function BankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")

    if (!username || !token) {
      router.push("/login")
      return
    }

    // Check if user is locked out of banking
    if (isUserLockedOut()) {
      const remainingMinutes = getRemainingLockoutTime()

      // Set security alert message
      localStorage.setItem(
        "securityAlert",
        `Your banking access is temporarily locked due to suspicious activity. Please try again in ${remainingMinutes} minutes.`,
      )

      // Redirect to dashboard
      router.push("/dashboard")
    }
  }, [router])

  return children
}
