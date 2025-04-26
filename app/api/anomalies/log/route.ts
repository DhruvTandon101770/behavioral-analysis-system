import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { logAudit } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.error }, { status: 401 })
    }

    // Get user ID from auth result
    const userId = (authResult.user as any).id

    // Get anomaly data from request
    const { type, details, confidenceScore } = await request.json()

    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ")

    // Log the anomaly
    await query(
      "INSERT INTO anomalies (user_id, timestamp, is_anomaly, confidence_score, details) VALUES (?, ?, ?, ?, ?)",
      [
        userId,
        timestamp,
        1, // is_anomaly = true
        confidenceScore || 0.9, // confidence score
        `${type}: ${details}`,
      ],
    )

    // Log audit event
    await logAudit(userId, "SECURITY", "anomalies", userId.toString(), `Security alert: ${type} - ${details}`)

    // Check if we need to lock the account based on anomaly type and confidence
    let lockAccount = false
    let lockDuration = 0

    if (confidenceScore > 0.9 && (type === "login_anomaly" || type === "banking_access_anomaly")) {
      lockAccount = true
      lockDuration = 30 // minutes
    } else if (confidenceScore > 0.8 && type === "multiple_anomalies") {
      lockAccount = true
      lockDuration = 15 // minutes
    }

    // If account should be locked, set lockout time
    if (lockAccount) {
      const lockoutUntil = Date.now() + lockDuration * 60 * 1000

      // In a real system, this would be stored in the database
      // For this demo, we'll return it to be stored in localStorage
      return NextResponse.json({
        message: "Anomaly logged successfully",
        lockAccount,
        lockoutUntil,
        lockDuration,
      })
    }

    return NextResponse.json({ message: "Anomaly logged successfully" })
  } catch (error) {
    console.error("Error logging anomaly:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
