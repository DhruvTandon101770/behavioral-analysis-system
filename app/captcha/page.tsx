"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

// Array of sample sentences for CAPTCHA
const captchaSentences = [
  "The quick brown fox jumps over the lazy dog",
  "All that glitters is not gold",
  "A journey of a thousand miles begins with a single step",
  "Actions speak louder than words",
  "Better late than never",
  "Don't judge a book by its cover",
  "Every cloud has a silver lining",
  "Fortune favors the bold",
  "Honesty is the best policy",
  "Knowledge is power",
]

export default function Captcha() {
  const router = useRouter()
  const [captchaSentence, setCaptchaSentence] = useState("")
  const [userInput, setUserInput] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMatching, setIsMatching] = useState<boolean | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  // Generate a random sentence for CAPTCHA
  const generateCaptcha = () => {
    const randomIndex = Math.floor(Math.random() * captchaSentences.length)
    setCaptchaSentence(captchaSentences[randomIndex])
    setUserInput("")
  }

  const checkInput = (input: string) => {
    if (!input) {
      setIsMatching(null)
      setIsComplete(false)
      return
    }

    const captchaLower = captchaSentence.toLowerCase()
    const inputLower = input.toLowerCase()

    // Check if input matches the beginning of the captcha
    const isMatch = captchaLower.startsWith(inputLower)
    setIsMatching(isMatch)

    // Check if input is complete and matches
    setIsComplete(inputLower === captchaLower)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // Check if the user input matches the CAPTCHA sentence
    if (isComplete) {
      try {
        // Get signup data from session storage
        const signupData = JSON.parse(sessionStorage.getItem("signupData") || "{}")

        if (!signupData.username || !signupData.email || !signupData.password) {
          throw new Error("Signup data is missing")
        }

        // Mock API call - replace with your actual API endpoint
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Signup failed")
        }

        // Clear signup data from session storage
        sessionStorage.removeItem("signupData")

        // Redirect to login page
        router.push("/login?registered=true")
      } catch (error: any) {
        console.error("Signup error:", error)
        setError(error.message)
        setIsLoading(false)
      }
    } else {
      setError("CAPTCHA verification failed. Please type the exact sentence.")
      generateCaptcha()
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
          <div className="mb-6">
            <div className="bg-muted p-4 rounded-md text-center mb-2">
              <p className="font-medium">{captchaSentence}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={generateCaptcha}
              type="button"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Generate New Sentence</span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="captcha-input">Type the sentence above</Label>
              <Input
                id="captcha-input"
                value={userInput}
                onChange={(e) => {
                  const newValue = e.target.value
                  setUserInput(newValue)
                  checkInput(newValue)
                }}
                className={`${
                  isMatching === null
                    ? ""
                    : isMatching
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                }`}
                required
              />
              {userInput && (
                <p className={`text-sm ${isMatching ? "text-green-500" : "text-red-500"}`}>
                  {isMatching
                    ? isComplete
                      ? "Perfect match! You can submit now."
                      : "Correct so far, keep typing..."
                    : "Doesn't match. Please check your typing."}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">This helps us ensure you are a human</p>
        </CardFooter>
      </Card>
    </div>
  )
}
