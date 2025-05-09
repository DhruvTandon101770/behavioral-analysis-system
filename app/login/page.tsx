"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import CaptchaWithBehavior from "@/components/captcha-with-behavior"
import type { BehavioralProfile } from "@/lib/behavior-tracker"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const redirectTo = searchParams.get("redirect") || "/banking"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For demo purposes, allow login with demo/password
      if (username === "demo" && password === "password") {
        // Show CAPTCHA for behavior verification
        setShowCaptcha(true)
        setVerificationStatus("Please complete the CAPTCHA for behavior verification")
        return
      }

      // Call the backend API for login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store user ID and token for behavior verification
      setUserId(data.user?.id || 1)
      setToken(data.token || "demo-token")

      // Show CAPTCHA for behavior verification
      setShowCaptcha(true)
      setVerificationStatus("Please complete the CAPTCHA for behavior verification")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Invalid username or password")
      setIsLoading(false)
    }
  }

  const handleCaptchaComplete = async (result: {
    success: boolean
    behavioralProfile?: BehavioralProfile
  }) => {
    if (!result.success || !result.behavioralProfile) {
      setError("Behavior verification failed. Please try again.")
      setShowCaptcha(false)
      setIsLoading(false)
      return
    }

    setVerificationStatus("Verifying your behavioral pattern...")

    try {
      // For demo purposes, we'll simulate the verification
      // In a real app, you would call the API

      // Store user data in localStorage
      localStorage.setItem("username", username)
      localStorage.setItem("token", token || "demo-token")

      // Set a cookie for server-side auth
      document.cookie = `token=${token || "demo-token"}; path=/; max-age=3600`

      setVerificationStatus("Behavior verified successfully! Redirecting...")

      // Redirect to banking dashboard after a short delay
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    } catch (error: any) {
      console.error("Behavior verification error:", error)
      setError(error.message || "Verification failed")
      setShowCaptcha(false)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {registered && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-800" />
              <AlertDescription>Registration successful! You can now log in.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {verificationStatus && !error && (
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-800" />
              <AlertDescription>{verificationStatus}</AlertDescription>
            </Alert>
          )}

          {!showCaptcha ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <CaptchaWithBehavior onComplete={handleCaptchaComplete} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
