"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import BehaviorTracker from "@/components/behavior-tracker"
import type { BehavioralProfile } from "@/lib/behavior-tracker"

interface CaptchaModalProps {
  onComplete: (result: {
    success: boolean
    behavioralProfile?: BehavioralProfile
    captchaText?: string
  }) => void
  onCancel: () => void
}

export default function CaptchaModal({ onComplete, onCancel }: CaptchaModalProps) {
  const [captchaSentence, setCaptchaSentence] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isMatching, setIsMatching] = useState<boolean | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [behavioralProfile, setBehavioralProfile] = useState<BehavioralProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch a random news headline for CAPTCHA
  const fetchNewsCaptcha = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from news API
      const response = await fetch("/api/captcha/news-sentence")

      if (!response.ok) {
        throw new Error("Failed to fetch news captcha")
      }

      const data = await response.json()
      setCaptchaSentence(data.sentence)
    } catch (error) {
      console.error("Error fetching news captcha:", error)
      // Fallback to local sentences if API fails
      const fallbackSentences = [
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

    // Focus the input when the modal opens
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isComplete && behavioralProfile) {
      console.log("CAPTCHA completed successfully with behavioral profile")
      onComplete({
        success: true,
        behavioralProfile,
        captchaText: captchaSentence,
      })
    } else {
      console.log("CAPTCHA verification failed", { isComplete, hasBehavioralProfile: !!behavioralProfile })
      onComplete({ success: false })
    }
  }

  const handleProfileGenerated = (profile: BehavioralProfile) => {
    console.log("Behavioral profile generated in CAPTCHA component")
    setBehavioralProfile(profile)
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
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Security Verification</DialogTitle>
          <DialogDescription>Please type the sentence exactly as shown to verify your identity</DialogDescription>
        </DialogHeader>

        <BehaviorTracker onProfileGenerated={handleProfileGenerated} duration={30000}>
          <div className="space-y-4 py-4">
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
                disabled={isLoading}
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

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isComplete || !behavioralProfile}>
                  {!behavioralProfile ? "Analyzing behavior..." : "Verify"}
                </Button>
              </div>

              {behavioralProfile && !isComplete && (
                <p className="text-sm text-muted-foreground text-center">
                  Behavior analysis complete. Please finish typing the sentence.
                </p>
              )}
            </form>
          </div>
        </BehaviorTracker>
      </DialogContent>
    </Dialog>
  )
}
