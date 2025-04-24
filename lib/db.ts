import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Default XAMPP MySQL password is empty
  database: process.env.DB_NAME || "behavioral_analysis",
  port: Number(process.env.DB_PORT || "3306"), // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool
let pool: mysql.Pool | null = null

// Initialize the connection pool
export async function initDb() {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig)
      console.log("MySQL connection pool created")
    }
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

// Get a connection from the pool
export async function getConnection() {
  if (!pool) {
    await initDb()
  }
  return pool!.getConnection()
}

// Execute a query
export async function query(sql: string, params: any[] = []) {
  try {
    if (!pool) {
      await initDb()
    }
    const [results] = await pool!.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Save behavioral profile to database
export async function saveBehavioralProfile(userId: number, profile: any) {
  try {
    console.log(
      "Saving behavioral profile for user:",
      userId,
      "Profile:",
      JSON.stringify(profile).substring(0, 100) + "...",
    )

    // Check if profile already exists
    const existingProfiles = (await query("SELECT id FROM behavioral_profiles WHERE user_id = ?", [userId])) as any[]

    if (existingProfiles.length > 0) {
      // Update existing profile
      console.log("Updating existing profile for user:", userId)
      await query(
        `UPDATE behavioral_profiles 
         SET typing_speed = ?, 
             typing_rhythm = ?, 
             mouse_movement_pattern = ?, 
             click_pattern = ?, 
             updated_at = NOW() 
         WHERE user_id = ?`,
        [
          profile.typingSpeed || 0,
          JSON.stringify(profile.typingRhythm || []),
          JSON.stringify(profile.mouseMovementPattern || []),
          JSON.stringify(profile.clickPattern || []),
          userId,
        ],
      )
    } else {
      // Insert new profile
      console.log("Inserting new profile for user:", userId)
      await query(
        `INSERT INTO behavioral_profiles 
         (user_id, typing_speed, typing_rhythm, mouse_movement_pattern, click_pattern) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          profile.typingSpeed || 0,
          JSON.stringify(profile.typingRhythm || []),
          JSON.stringify(profile.mouseMovementPattern || []),
          JSON.stringify(profile.clickPattern || []),
        ],
      )
    }

    return true
  } catch (error) {
    console.error("Error saving behavioral profile:", error)
    return false
  }
}

// Get behavioral profile from database
export async function getBehavioralProfile(userId: number) {
  try {
    console.log("Getting behavioral profile for user:", userId)
    const profiles = (await query("SELECT * FROM behavioral_profiles WHERE user_id = ?", [userId])) as any[]

    if (profiles.length === 0) {
      console.log("No profile found for user:", userId)
      return null
    }

    const profile = profiles[0]
    console.log("Profile found for user:", userId)

    return {
      typingSpeed: profile.typing_speed,
      typingRhythm: JSON.parse(profile.typing_rhythm || "[]"),
      mouseMovementPattern: JSON.parse(profile.mouse_movement_pattern || "[]"),
      clickPattern: JSON.parse(profile.click_pattern || "[]"),
    }
  } catch (error) {
    console.error("Error getting behavioral profile:", error)
    return null
  }
}

// Log anomaly to database
export async function logAnomaly(userId: number, isAnomaly: boolean, confidenceScore: number, details: string) {
  try {
    console.log("Logging anomaly for user:", userId, "isAnomaly:", isAnomaly, "confidenceScore:", confidenceScore)
    await query(
      "INSERT INTO anomalies (user_id, timestamp, is_anomaly, confidence_score, details) VALUES (?, NOW(), ?, ?, ?)",
      [userId, isAnomaly ? 1 : 0, confidenceScore, details],
    )
    return true
  } catch (error) {
    console.error("Error logging anomaly:", error)
    return false
  }
}

export default dbConfig
