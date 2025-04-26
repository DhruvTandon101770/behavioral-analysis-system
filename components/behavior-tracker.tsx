"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  trackMouseMovements,
  trackKeyPresses,
  trackClickEvents,
  generateBehavioralProfile,
  type MouseMovement,
  type KeyPress,
  type ClickEvent,
  type BehavioralProfile,
} from "@/lib/behavior-tracker"

interface BehaviorTrackerProps {
  onProfileGenerated?: (profile: BehavioralProfile) => void
  onTrackingStart?: () => void
  onTrackingEnd?: () => void
  duration?: number
  autoStart?: boolean
  continuousMonitoring?: boolean
  monitoringInterval?: number
  children: React.ReactNode
}

export default function BehaviorTracker({
  onProfileGenerated,
  onTrackingStart,
  onTrackingEnd,
  duration = 10000,
  autoStart = true,
  continuousMonitoring = false,
  monitoringInterval = 60000, // 1 minute by default
  children,
}: BehaviorTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [mouseMovements, setMouseMovements] = useState<MouseMovement[]>([])
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([])
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([])
  const [profileGenerated, setProfileGenerated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startTracking = async () => {
    if (!containerRef.current || isTracking) return

    setIsTracking(true)
    if (onTrackingStart) onTrackingStart()
    console.log("Starting behavior tracking for", duration, "ms")

    try {
      // Track all behaviors simultaneously
      const [movements, presses, clicks] = await Promise.all([
        trackMouseMovements(containerRef.current, duration),
        trackKeyPresses(containerRef.current, duration),
        trackClickEvents(containerRef.current, duration),
      ])

      console.log("Tracking complete:", {
        mouseMovements: movements.length,
        keyPresses: presses.length,
        clickEvents: clicks.length,
      })

      setMouseMovements((prev) => [...prev, ...movements])
      setKeyPresses((prev) => [...prev, ...presses])
      setClickEvents((prev) => [...prev, ...clicks])

      // Generate profile
      const profile = generateBehavioralProfile(
        [...keyPresses, ...presses],
        [...mouseMovements, ...movements],
        [...clickEvents, ...clicks],
      )

      console.log("Generated behavioral profile:", {
        typingSpeed: profile.typingSpeed,
        typingRhythmCount: profile.typingRhythm.length,
        mouseMovementCount: profile.mouseMovementPattern.length,
        clickPatternCount: profile.clickPattern.length,
      })

      setProfileGenerated(true)

      // Call callback if provided
      if (onProfileGenerated) {
        onProfileGenerated(profile)
      }

      // Reset data arrays if not doing continuous monitoring
      if (!continuousMonitoring) {
        setMouseMovements([])
        setKeyPresses([])
        setClickEvents([])
      }
    } catch (error) {
      console.error("Error tracking behavior:", error)
    } finally {
      setIsTracking(false)
      if (onTrackingEnd) onTrackingEnd()
    }
  }

  useEffect(() => {
    if (autoStart && !profileGenerated) {
      startTracking()
    }

    // Set up continuous monitoring if enabled
    if (continuousMonitoring && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!isTracking) {
          startTracking()
        }
      }, monitoringInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoStart, profileGenerated, continuousMonitoring, isTracking])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      tabIndex={0} // Make div focusable for key events
    >
      {children}
    </div>
  )
}
