"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import BehaviorTracker from "@/components/behavior-tracker"
import type { BehavioralProfile } from "@/lib/behavior-tracker"

interface CaptchaWithBehaviorProps {
  onComplete: (result: {
    success: boolean
    behavioralProfile?: BehavioralProfile
    captchaText?: string
  }) => void
}

export default function CaptchaWithBehavior({ onComplete }: CaptchaWithBehaviorProps) {
  const [captchaSentence, setCaptchaSentence] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isMatching, setIsMatching] = useState<boolean | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [behavioralProfile, setBehavioralProfile] = useState<BehavioralProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch a random news headline for CAPTCHA
  const fetchNewsCaptcha = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from a news API
      // For demo purposes, we'll use our local API
      const response = await fetch("/api/captcha/news-sentence?country=india")

      if (!response.ok) {
        throw new Error("Failed to fetch news captcha")
      }

      const data = await response.json()
      setCaptchaSentence(data.sentence)
    } catch (error) {
      console.error("Error fetching news captcha:", error)
      // Fallback to India-related sentences if API fails
      const fallbackSentences = [
        "India celebrates Republic Day with grand parade in Delhi",
        "Indian cricket team wins series against Australia",
        "Monsoon season begins across several states in India",
        "New Delhi implements measures to reduce air pollution",
        "Indian Space Research Organisation launches satellite successfully",
        "Taj Mahal remains India's most visited tourist attraction",
        "Mumbai's local trains resume normal service after disruption",
        "Indian government announces new education policy",
        "Farmers in Punjab report record wheat harvest this year",
        "Bollywood film industry celebrates centenary of Indian cinema",
      ]
      const randomIndex = Math.floor(Math.random() * fallbackSentences.length)
      setCaptchaSentence(fallbackSentences[randomIndex])
    } finally {
      setIsLoading(false)
    }
  }

  // Generate a new CAPTCHA sentence
  const generateCaptcha = () => {
    setUserInput("")
    setIsMatching(null)
    setIsComplete(false)
    fetchNewsCaptcha()
  }

  useEffect(() => {
    generateCaptcha()

    // Focus the input when the component mounts
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [])

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (isComplete && behavioralProfile) {
      setIsSubmitting(true)
      console.log("CAPTCHA completed successfully with behavioral profile")

      // Simulate a delay for verification
      setTimeout(() => {
        onComplete({
          success: true,
          behavioralProfile,
          captchaText: captchaSentence,
        })
      }, 1000)
    } else {
      console.log("CAPTCHA verification failed", { isComplete, hasBehavioralProfile: !!behavioralProfile })
      onComplete({ success: false })
    }
  }

  const handleProfileGenerated = (profile: BehavioralProfile) => {
    console.log("Behavioral profile generated in CAPTCHA component")
    setBehavioralProfile(profile)
    setIsAnalyzing(false)
  }

  // Prevent copy/paste in the CAPTCHA input
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    setError("Pasting is not allowed for security reasons")
    setTimeout(() => setError(""), 3000)
  }

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault()
    setError("Copying is not allowed for security reasons")
    setTimeout(() => setError(""), 3000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent keyboard shortcuts for copy/paste
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
      e.preventDefault()
      setError("Keyboard shortcuts for copy/paste are disabled")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <BehaviorTracker
      onProfileGenerated={handleProfileGenerated}
      duration={30000}
      onTrackingStart={() => setIsAnalyzing(true)}
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          {isLoading ? (
            <div className="bg-muted p-4 rounded-md text-center mb-2 h-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md text-center mb-2">
              <p className="font-medium">{captchaSentence}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={generateCaptcha}
            type="button"
            disabled={isLoading || isSubmitting}
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
              ref={inputRef}
              value={userInput}
              onChange={(e) => {
                const newValue = e.target.value
                setUserInput(newValue)
                checkInput(newValue)
              }}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onCut={handleCopy}
              onKeyDown={handleKeyDown}
              className={`${
                isMatching === null
                  ? ""
                  : isMatching
                    ? "border-green-500 focus-visible:ring-green-500"
                    : "border-red-500 focus-visible:ring-red-500"
              }`}
              required
              autoComplete="off"
              spellCheck="false"
              disabled={isSubmitting}
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

          <Button type="submit" className="w-full" disabled={!isComplete || !behavioralProfile || isSubmitting}>
            {isSubmitting
              ? "Verifying..."
              : isAnalyzing
                ? "Analyzing behavior..."
                : !behavioralProfile
                  ? "Analyzing your behavior..."
                  : "Verify"}
          </Button>

          {behavioralProfile && !isComplete && (
            <p className="text-sm text-muted-foreground text-center">
              Behavior analysis complete. Please finish typing the sentence.
            </p>
          )}
        </form>
      </div>
    </BehaviorTracker>
  )
}
