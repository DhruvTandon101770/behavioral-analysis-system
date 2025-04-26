// Store user navigation patterns
interface NavigationPattern {
  section: string
  count: number
  lastVisited: number
}

// Get user ID from localStorage
function getUserId(): string {
  return localStorage.getItem("username") || "unknown"
}

// Get user navigation history from localStorage
function getUserNavigationHistory(): Record<string, NavigationPattern> {
  const userId = getUserId()
  const historyJson = localStorage.getItem(`banking_nav_${userId}`)
  return historyJson ? JSON.parse(historyJson) : {}
}

// Save user navigation history to localStorage
function saveUserNavigationHistory(history: Record<string, NavigationPattern>): void {
  const userId = getUserId()
  localStorage.setItem(`banking_nav_${userId}`, JSON.stringify(history))
}

// Track user navigation to a section
export function trackUserNavigation(section: string): void {
  // Check if user is locked out
  if (isUserLockedOut()) {
    return
  }

  const history = getUserNavigationHistory()

  if (history[section]) {
    history[section].count += 1
    history[section].lastVisited = Date.now()
  } else {
    history[section] = {
      section,
      count: 1,
      lastVisited: Date.now(),
    }
  }

  saveUserNavigationHistory(history)
  console.log(`Tracked navigation to ${section}`)
}

// Detect anomalous navigation
export function detectAnomalousNavigation(section: string): boolean {
  // Check if user is locked out
  if (isUserLockedOut()) {
    return true
  }

  const history = getUserNavigationHistory()

  // If this is a new section the user has never visited, it's potentially suspicious
  if (!history[section]) {
    console.log(`Anomaly detected: User has never visited ${section} before`)
    return true
  }

  // If this is a rarely visited section (visited less than 3 times)
  if (history[section].count < 3) {
    // And it's been more than 7 days since last visit
    const daysSinceLastVisit = (Date.now() - history[section].lastVisited) / (1000 * 60 * 60 * 24)
    if (daysSinceLastVisit > 7) {
      console.log(
        `Anomaly detected: User rarely visits ${section} and hasn't been there in ${daysSinceLastVisit.toFixed(1)} days`,
      )
      return true
    }
  }

  return false
}

// Check if user is currently locked out
export function isUserLockedOut(): boolean {
  const lockoutUntil = localStorage.getItem("bankingLockout")

  if (lockoutUntil) {
    const lockoutTime = Number.parseInt(lockoutUntil, 10)
    const now = Date.now()

    if (now < lockoutTime) {
      // User is still locked out
      const remainingMinutes = Math.ceil((lockoutTime - now) / (1000 * 60))
      console.log(`User is locked out for ${remainingMinutes} more minutes`)
      return true
    } else {
      // Lockout period has expired
      localStorage.removeItem("bankingLockout")
    }
  }

  return false
}

// Get remaining lockout time in minutes
export function getRemainingLockoutTime(): number {
  const lockoutUntil = localStorage.getItem("bankingLockout")

  if (lockoutUntil) {
    const lockoutTime = Number.parseInt(lockoutUntil, 10)
    const now = Date.now()

    if (now < lockoutTime) {
      return Math.ceil((lockoutTime - now) / (1000 * 60))
    }
  }

  return 0
}

// Lock user out of banking for a specified duration
export function lockUserOut(durationMinutes = 30): void {
  const lockoutUntil = Date.now() + durationMinutes * 60 * 1000
  localStorage.setItem("bankingLockout", lockoutUntil.toString())
  console.log(`User locked out for ${durationMinutes} minutes until ${new Date(lockoutUntil).toLocaleString()}`)
}
