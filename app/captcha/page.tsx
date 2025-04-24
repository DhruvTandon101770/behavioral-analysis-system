"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import CaptchaWithBehavior from "@/components/captcha-with-behavior"
import type { BehavioralProfile } from "@/lib/behavior-tracker"

export default function Captcha() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    // Check if signup data exists in session storage
    const signupData = sessionStorage.getItem("signupData")
    if (!signupData) {
      router.push("/signup")
    }
  }, [router])

  const handleCaptchaComplete = async (result: {
    success: boolean
    behavioralProfile?: BehavioralProfile
    captchaText?: string
  }) => {
    if (!result.success) {
      setError("CAPTCHA verification failed. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")
    setStatus("Processing your registration...")

    try {
      // Get signup data from session storage
      const signupData = JSON.parse(sessionStorage.getItem("signupData") || "{}")

      if (!signupData.username || !signupData.email || !signupData.password) {
        throw new Error("Signup data is missing")
      }

      console.log("Registering user with behavioral profile:", {
        username: signupData.username,
        email: signupData.email,
        hasProfile: !!result.behavioralProfile,
        captchaText: result.captchaText,
      })

      // Call the backend API for registration with behavioral profile
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signupData,
          behavioralProfile: result.behavioralProfile,
          captchaText: result.captchaText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setStatus("Registration successful! Redirecting to login...")

      // Clear signup data from session storage
      sessionStorage.removeItem("signupData")

      // Redirect to login page with success message
      setTimeout(() => {
        router.push("/login?registered=true")
      }, 1500)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">CAPTCHA Verification</CardTitle>
          <CardDescription>Please type the sentence below exactly as shown</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status && !error && (
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-800" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <CaptchaWithBehavior onComplete={handleCaptchaComplete} errorMessage={error} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            This helps us ensure you are a human and creates your behavioral profile
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
