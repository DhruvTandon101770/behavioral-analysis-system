// Types for behavior tracking
export interface MouseMovement {
  x: number
  y: number
  timestamp: number
}

export interface KeyPress {
  key: string
  duration: number
  timestamp: number
}

export interface ClickEvent {
  x: number
  y: number
  button: number
  timestamp: number
}

export interface BehavioralProfile {
  typingSpeed: number
  typingRhythm: number[]
  mouseMovementPattern: MouseMovement[]
  clickPattern: ClickEvent[]
}

// Track mouse movements
export function trackMouseMovements(element: HTMLElement, duration = 10000): Promise<MouseMovement[]> {
  return new Promise((resolve) => {
    const movements: MouseMovement[] = []

    const handleMouseMove = (e: MouseEvent) => {
      movements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      })
    }

    element.addEventListener("mousemove", handleMouseMove)

    setTimeout(() => {
      element.removeEventListener("mousemove", handleMouseMove)
      console.log(`Tracked ${movements.length} mouse movements`)
      resolve(movements)
    }, duration)
  })
}

// Track key presses
export function trackKeyPresses(element: HTMLElement, duration = 10000): Promise<KeyPress[]> {
  return new Promise((resolve) => {
    const keyPresses: KeyPress[] = []
    const keyDownTimes: Record<string, number> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyDownTimes[e.key]) {
        keyDownTimes[e.key] = Date.now()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyDownTimes[e.key]) {
        const duration = Date.now() - keyDownTimes[e.key]
        keyPresses.push({
          key: e.key,
          duration,
          timestamp: keyDownTimes[e.key],
        })
        delete keyDownTimes[e.key]
      }
    }

    element.addEventListener("keydown", handleKeyDown)
    element.addEventListener("keyup", handleKeyUp)

    setTimeout(() => {
      element.removeEventListener("keydown", handleKeyDown)
      element.removeEventListener("keyup", handleKeyUp)
      console.log(`Tracked ${keyPresses.length} key presses`)
      resolve(keyPresses)
    }, duration)
  })
}

// Track click events
export function trackClickEvents(element: HTMLElement, duration = 10000): Promise<ClickEvent[]> {
  return new Promise((resolve) => {
    const clicks: ClickEvent[] = []

    const handleClick = (e: MouseEvent) => {
      clicks.push({
        x: e.clientX,
        y: e.clientY,
        button: e.button,
        timestamp: Date.now(),
      })
    }

    element.addEventListener("click", handleClick)

    setTimeout(() => {
      element.removeEventListener("click", handleClick)
      console.log(`Tracked ${clicks.length} click events`)
      resolve(clicks)
    }, duration)
  })
}

// Generate behavioral profile from tracking data
export function generateBehavioralProfile(
  keyPresses: KeyPress[],
  mouseMovements: MouseMovement[],
  clickEvents: ClickEvent[],
): BehavioralProfile {
  // Calculate typing speed (characters per minute)
  const typingSpeed =
    keyPresses.length > 0
      ? (keyPresses.length * 60000) / (keyPresses[keyPresses.length - 1].timestamp - keyPresses[0].timestamp)
      : 0

  // Calculate typing rhythm (time between key presses)
  const typingRhythm = []
  for (let i = 1; i < keyPresses.length; i++) {
    typingRhythm.push(keyPresses[i].timestamp - keyPresses[i - 1].timestamp)
  }

  return {
    typingSpeed,
    typingRhythm,
    mouseMovementPattern: mouseMovements,
    clickPattern: clickEvents,
  }
}

// Compare two behavioral profiles and return a similarity score (0-1)
export function compareBehavioralProfiles(profile1: BehavioralProfile, profile2: BehavioralProfile): number {
  console.log("Comparing behavioral profiles")

  // Simple comparison for demonstration
  // In a real system, you would use more sophisticated algorithms

  // Compare typing speed (weight: 0.3)
  const typingSpeedDiff = Math.abs(profile1.typingSpeed - profile2.typingSpeed)
  const typingSpeedSimilarity = Math.max(
    0,
    1 - typingSpeedDiff / Math.max(profile1.typingSpeed, profile2.typingSpeed, 1),
  )

  // Compare typing rhythm (weight: 0.3)
  let rhythmSimilarity = 0
  if (profile1.typingRhythm.length > 0 && profile2.typingRhythm.length > 0) {
    const minLength = Math.min(profile1.typingRhythm.length, profile2.typingRhythm.length)
    let totalDiff = 0
    for (let i = 0; i < minLength; i++) {
      totalDiff += Math.abs(profile1.typingRhythm[i] - profile2.typingRhythm[i])
    }
    const avgDiff = totalDiff / minLength
    rhythmSimilarity = Math.max(0, 1 - avgDiff / 1000) // Normalize by assuming 1000ms is max difference
  }

  // Compare mouse movements (weight: 0.2)
  // Simplified: just check if the general areas of movement are similar
  let movementSimilarity = 0
  if (profile1.mouseMovementPattern.length > 0 && profile2.mouseMovementPattern.length > 0) {
    const avgX1 = profile1.mouseMovementPattern.reduce((sum, m) => sum + m.x, 0) / profile1.mouseMovementPattern.length
    const avgY1 = profile1.mouseMovementPattern.reduce((sum, m) => sum + m.y, 0) / profile1.mouseMovementPattern.length
    const avgX2 = profile2.mouseMovementPattern.reduce((sum, m) => sum + m.x, 0) / profile2.mouseMovementPattern.length
    const avgY2 = profile2.mouseMovementPattern.reduce((sum, m) => sum + m.y, 0) / profile2.mouseMovementPattern.length

    const xDiff = Math.abs(avgX1 - avgX2)
    const yDiff = Math.abs(avgY1 - avgY2)

    movementSimilarity = Math.max(0, 1 - (xDiff + yDiff) / 500) // Normalize by assuming 500px is max difference
  }

  // Compare click patterns (weight: 0.2)
  let clickSimilarity = 0
  if (profile1.clickPattern.length > 0 && profile2.clickPattern.length > 0) {
    const clickCountDiff = Math.abs(profile1.clickPattern.length - profile2.clickPattern.length)
    clickSimilarity = Math.max(
      0,
      1 - clickCountDiff / Math.max(profile1.clickPattern.length, profile2.clickPattern.length, 1),
    )
  }

  // Weighted average
  const similarityScore =
    typingSpeedSimilarity * 0.3 + rhythmSimilarity * 0.3 + movementSimilarity * 0.2 + clickSimilarity * 0.2

  console.log("Similarity score:", similarityScore, {
    typingSpeedSimilarity,
    rhythmSimilarity,
    movementSimilarity,
    clickSimilarity,
  })

  return similarityScore
}

// Detect if current behavior is anomalous compared to stored profile
export function detectAnomaly(
  currentProfile: BehavioralProfile,
  storedProfile: BehavioralProfile,
  threshold = 0.6, // Lower threshold to make anomaly detection more sensitive
): {
  isAnomaly: boolean
  confidenceScore: number
} {
  const similarityScore = compareBehavioralProfiles(currentProfile, storedProfile)
  const isAnomaly = similarityScore < threshold

  console.log("Anomaly detection:", {
    similarityScore,
    threshold,
    isAnomaly,
    confidenceScore: 1 - similarityScore,
  })

  return {
    isAnomaly,
    confidenceScore: 1 - similarityScore,
  }
}
