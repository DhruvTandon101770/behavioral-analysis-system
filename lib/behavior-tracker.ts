// Types for behavior tracking
export interface MouseMovement {
  x: number
  y: number
  timestamp: number
  velocity?: number
  acceleration?: number
}

export interface KeyPress {
  key: string
  duration: number
  timestamp: number
  interval?: number // Time since last keypress
}

export interface ClickEvent {
  x: number
  y: number
  button: number
  timestamp: number
  doubleClick?: boolean
}

export interface BehavioralProfile {
  typingSpeed: number
  typingRhythm: number[]
  typingPressure: number[] // Estimated from key duration
  mouseMovementPattern: MouseMovement[]
  mouseVelocity: number
  mouseAcceleration: number
  clickPattern: ClickEvent[]
  doubleClickRate: number
  dna: string // Digital behavioral DNA signature
  entropy: number // Randomness measure of behavior
}

// Track mouse movements with enhanced metrics
export function trackMouseMovements(element: HTMLElement, duration = 10000): Promise<MouseMovement[]> {
  return new Promise((resolve) => {
    const movements: MouseMovement[] = []
    let lastTimestamp = 0
    let lastX = 0
    let lastY = 0
    let lastVelocity = 0

    const handleMouseMove = (e: MouseEvent) => {
      const timestamp = Date.now()

      // Calculate velocity and acceleration if we have previous points
      let velocity = 0
      let acceleration = 0

      if (lastTimestamp > 0) {
        const dt = timestamp - lastTimestamp
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        const distance = Math.sqrt(dx * dx + dy * dy)

        velocity = dt > 0 ? distance / dt : 0
        acceleration = dt > 0 ? (velocity - lastVelocity) / dt : 0
      }

      movements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp,
        velocity,
        acceleration,
      })

      lastTimestamp = timestamp
      lastX = e.clientX
      lastY = e.clientY
      lastVelocity = velocity
    }

    element.addEventListener("mousemove", handleMouseMove)

    setTimeout(() => {
      element.removeEventListener("mousemove", handleMouseMove)
      console.log(`Tracked ${movements.length} mouse movements with enhanced metrics`)
      resolve(movements)
    }, duration)
  })
}

// Track key presses with enhanced metrics
export function trackKeyPresses(element: HTMLElement, duration = 10000): Promise<KeyPress[]> {
  return new Promise((resolve) => {
    const keyPresses: KeyPress[] = []
    const keyDownTimes: Record<string, number> = {}
    let lastKeyPressTime = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyDownTimes[e.key]) {
        keyDownTimes[e.key] = Date.now()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyDownTimes[e.key]) {
        const timestamp = keyDownTimes[e.key]
        const duration = Date.now() - timestamp
        const interval = lastKeyPressTime > 0 ? timestamp - lastKeyPressTime : 0

        keyPresses.push({
          key: e.key,
          duration,
          timestamp,
          interval,
        })

        lastKeyPressTime = timestamp
        delete keyDownTimes[e.key]
      }
    }

    element.addEventListener("keydown", handleKeyDown)
    element.addEventListener("keyup", handleKeyUp)

    setTimeout(() => {
      element.removeEventListener("keydown", handleKeyDown)
      element.removeEventListener("keyup", handleKeyUp)
      console.log(`Tracked ${keyPresses.length} key presses with enhanced metrics`)
      resolve(keyPresses)
    }, duration)
  })
}

// Track click events with enhanced metrics
export function trackClickEvents(element: HTMLElement, duration = 10000): Promise<ClickEvent[]> {
  return new Promise((resolve) => {
    const clicks: ClickEvent[] = []
    let lastClickTime = 0
    const DOUBLE_CLICK_THRESHOLD = 300 // ms

    const handleClick = (e: MouseEvent) => {
      const timestamp = Date.now()
      const isDoubleClick = timestamp - lastClickTime < DOUBLE_CLICK_THRESHOLD

      clicks.push({
        x: e.clientX,
        y: e.clientY,
        button: e.button,
        timestamp,
        doubleClick: isDoubleClick,
      })

      lastClickTime = timestamp
    }

    element.addEventListener("click", handleClick)

    setTimeout(() => {
      element.removeEventListener("click", handleClick)
      console.log(`Tracked ${clicks.length} click events with enhanced metrics`)
      resolve(clicks)
    }, duration)
  })
}

// Generate behavioral DNA signature
function generateBehavioralDNA(profile: Partial<BehavioralProfile>): string {
  // Create a unique behavioral signature based on typing and mouse patterns
  // This is a simplified version - a real implementation would use more sophisticated algorithms

  // Extract key metrics
  const typingSpeed = profile.typingSpeed || 0
  const typingRhythm = profile.typingRhythm || []
  const mouseVelocity = profile.mouseVelocity || 0
  const clickPattern = profile.clickPattern || []

  // Create a hash-like string from the metrics
  const typingHash = typingRhythm
    .slice(0, 5)
    .map((t) => Math.floor(t))
    .join("-")
  const mouseHash = Math.floor(mouseVelocity * 100).toString(16)
  const clickHash = clickPattern
    .slice(0, 3)
    .map((c) => Math.floor(c.timestamp % 1000))
    .join("-")

  // Combine into a DNA-like string
  const dna = `${Math.floor(typingSpeed * 10).toString(16)}-${typingHash}-${mouseHash}-${clickHash}`

  return dna
}

// Calculate entropy (randomness) of behavior
function calculateBehavioralEntropy(profile: Partial<BehavioralProfile>): number {
  // This is a simplified entropy calculation
  // A real implementation would use information theory principles

  let entropy = 0

  // Add entropy from typing rhythm variations
  if (profile.typingRhythm && profile.typingRhythm.length > 1) {
    const rhythmVariance = calculateVariance(profile.typingRhythm)
    entropy += Math.min(rhythmVariance / 1000, 1) // Normalize to 0-1 range
  }

  // Add entropy from mouse movements
  if (profile.mouseMovementPattern && profile.mouseMovementPattern.length > 1) {
    const velocities = profile.mouseMovementPattern
      .filter((m) => m.velocity !== undefined)
      .map((m) => m.velocity as number)

    if (velocities.length > 1) {
      const velocityVariance = calculateVariance(velocities)
      entropy += Math.min(velocityVariance / 10, 1) // Normalize to 0-1 range
    }
  }

  // Add entropy from click pattern
  if (profile.clickPattern && profile.clickPattern.length > 1) {
    const clickTimes = profile.clickPattern.map((c) => c.timestamp)
    const clickIntervals = []

    for (let i = 1; i < clickTimes.length; i++) {
      clickIntervals.push(clickTimes[i] - clickTimes[i - 1])
    }

    if (clickIntervals.length > 0) {
      const clickVariance = calculateVariance(clickIntervals)
      entropy += Math.min(clickVariance / 10000, 1) // Normalize to 0-1 range
    }
  }

  // Normalize final entropy to 0-1 range
  return Math.min(entropy / 3, 1)
}

// Helper function to calculate variance of an array of numbers
function calculateVariance(array: number[]): number {
  if (array.length <= 1) return 0

  const mean = array.reduce((sum, val) => sum + val, 0) / array.length
  const squaredDiffs = array.map((val) => Math.pow(val - mean, 2))
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / array.length
}

// Generate behavioral profile from tracking data with enhanced metrics
export function generateBehavioralProfile(
  keyPresses: KeyPress[],
  mouseMovements: MouseMovement[],
  clickEvents: ClickEvent[],
): BehavioralProfile {
  // Calculate typing speed (characters per minute)
  const typingSpeed =
    keyPresses.length > 1
      ? (keyPresses.length * 60000) / (keyPresses[keyPresses.length - 1].timestamp - keyPresses[0].timestamp)
      : 0

  // Calculate typing rhythm (time between key presses)
  const typingRhythm = []
  for (let i = 1; i < keyPresses.length; i++) {
    typingRhythm.push(keyPresses[i].timestamp - keyPresses[i - 1].timestamp)
  }

  // Estimate typing pressure from key duration
  const typingPressure = keyPresses.map((kp) => kp.duration)

  // Calculate mouse velocity and acceleration
  let totalVelocity = 0
  let totalAcceleration = 0
  let velocityCount = 0
  let accelerationCount = 0

  for (const movement of mouseMovements) {
    if (movement.velocity !== undefined) {
      totalVelocity += movement.velocity
      velocityCount++
    }

    if (movement.acceleration !== undefined) {
      totalAcceleration += movement.acceleration
      accelerationCount++
    }
  }

  const mouseVelocity = velocityCount > 0 ? totalVelocity / velocityCount : 0
  const mouseAcceleration = accelerationCount > 0 ? totalAcceleration / accelerationCount : 0

  // Calculate double click rate
  const doubleClicks = clickEvents.filter((click) => click.doubleClick).length
  const doubleClickRate = clickEvents.length > 0 ? doubleClicks / clickEvents.length : 0

  // Create the initial profile
  const profile: BehavioralProfile = {
    typingSpeed,
    typingRhythm,
    typingPressure,
    mouseMovementPattern: mouseMovements,
    mouseVelocity,
    mouseAcceleration,
    clickPattern: clickEvents,
    doubleClickRate,
    dna: "",
    entropy: 0,
  }

  // Generate behavioral DNA
  profile.dna = generateBehavioralDNA(profile)

  // Calculate entropy
  profile.entropy = calculateBehavioralEntropy(profile)

  return profile
}

// Compare two behavioral profiles and return a similarity score (0-1)
export function compareBehavioralProfiles(profile1: BehavioralProfile, profile2: BehavioralProfile): number {
  console.log("Comparing behavioral profiles with DNA analysis")

  // Compare typing speed (weight: 0.15)
  const typingSpeedDiff = Math.abs(profile1.typingSpeed - profile2.typingSpeed)
  const typingSpeedSimilarity = Math.max(
    0,
    1 - typingSpeedDiff / Math.max(profile1.typingSpeed, profile2.typingSpeed, 1),
  )

  // Compare typing rhythm (weight: 0.25)
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

  // Compare mouse velocity (weight: 0.15)
  const velocityDiff = Math.abs(profile1.mouseVelocity - profile2.mouseVelocity)
  const velocitySimilarity = Math.max(0, 1 - velocityDiff / Math.max(profile1.mouseVelocity, profile2.mouseVelocity, 1))

  // Compare mouse acceleration (weight: 0.10)
  const accelerationDiff = Math.abs(profile1.mouseAcceleration - profile2.mouseAcceleration)
  const accelerationSimilarity = Math.max(
    0,
    1 - accelerationDiff / Math.max(Math.abs(profile1.mouseAcceleration), Math.abs(profile2.mouseAcceleration), 0.1),
  )

  // Compare click patterns (weight: 0.15)
  let clickSimilarity = 0
  if (profile1.clickPattern.length > 0 && profile2.clickPattern.length > 0) {
    // Compare double click rates
    const doubleClickDiff = Math.abs(profile1.doubleClickRate - profile2.doubleClickRate)
    clickSimilarity = Math.max(0, 1 - doubleClickDiff)
  }

  // Compare entropy (weight: 0.10)
  const entropyDiff = Math.abs(profile1.entropy - profile2.entropy)
  const entropySimilarity = Math.max(0, 1 - entropyDiff)

  // Compare DNA (weight: 0.10)
  // This is a simplified comparison - real DNA comparison would be more complex
  const dnaSimilarity = profile1.dna === profile2.dna ? 1.0 : 0.5

  // Weighted average
  const similarityScore =
    typingSpeedSimilarity * 0.15 +
    rhythmSimilarity * 0.25 +
    velocitySimilarity * 0.15 +
    accelerationSimilarity * 0.1 +
    clickSimilarity * 0.15 +
    entropySimilarity * 0.1 +
    dnaSimilarity * 0.1

  console.log("Similarity score details:", {
    typingSpeedSimilarity,
    rhythmSimilarity,
    velocitySimilarity,
    accelerationSimilarity,
    clickSimilarity,
    entropySimilarity,
    dnaSimilarity,
    overallScore: similarityScore,
  })

  return similarityScore
}

// Detect if current behavior is anomalous compared to stored profile
export function detectAnomaly(
  currentProfile: BehavioralProfile,
  storedProfile: BehavioralProfile,
  threshold = 0.65, // Higher threshold for stricter anomaly detection
): {
  isAnomaly: boolean
  confidenceScore: number
  anomalyDetails: string[]
} {
  const similarityScore = compareBehavioralProfiles(currentProfile, storedProfile)
  const isAnomaly = similarityScore < threshold
  const confidenceScore = 1 - similarityScore

  // Generate detailed anomaly report
  const anomalyDetails: string[] = []

  if (isAnomaly) {
    // Check which aspects are most anomalous
    const typingSpeedDiff =
      Math.abs(currentProfile.typingSpeed - storedProfile.typingSpeed) / Math.max(storedProfile.typingSpeed, 1)

    if (typingSpeedDiff > 0.3) {
      anomalyDetails.push(
        `Unusual typing speed: ${Math.round(currentProfile.typingSpeed)} WPM vs normal ${Math.round(storedProfile.typingSpeed)} WPM`,
      )
    }

    if (currentProfile.typingRhythm.length > 0 && storedProfile.typingRhythm.length > 0) {
      const rhythmVarianceCurrent = calculateVariance(currentProfile.typingRhythm)
      const rhythmVarianceStored = calculateVariance(storedProfile.typingRhythm)
      const rhythmVarianceDiff =
        Math.abs(rhythmVarianceCurrent - rhythmVarianceStored) / Math.max(rhythmVarianceStored, 1)

      if (rhythmVarianceDiff > 0.4) {
        anomalyDetails.push("Unusual typing rhythm pattern detected")
      }
    }

    const velocityDiff =
      Math.abs(currentProfile.mouseVelocity - storedProfile.mouseVelocity) / Math.max(storedProfile.mouseVelocity, 0.1)

    if (velocityDiff > 0.4) {
      anomalyDetails.push("Unusual mouse movement speed detected")
    }

    if (currentProfile.dna !== storedProfile.dna) {
      anomalyDetails.push("Behavioral DNA signature mismatch")
    }

    // If no specific anomalies were identified but overall score is anomalous
    if (anomalyDetails.length === 0) {
      anomalyDetails.push("Multiple small behavioral inconsistencies detected")
    }
  }

  console.log("Anomaly detection:", {
    similarityScore,
    threshold,
    isAnomaly,
    confidenceScore,
    anomalyDetails,
  })

  return {
    isAnomaly,
    confidenceScore,
    anomalyDetails,
  }
}
