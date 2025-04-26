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
    const { section, anomalyType, timestamp } = await request.json()

    // Log the anomaly
    await query(
      "INSERT INTO anomalies (user_id, timestamp, is_anomaly, confidence_score, details) VALUES (?, ?, ?, ?, ?)",
      [
        userId,
        timestamp,
        1, // is_anomaly = true
        0.9, // high confidence score
        `Banking anomaly: ${anomalyType} in section ${section}`,
      ],
    )

    // Log audit event
    await logAudit(
      userId,
      "SECURITY",
      "banking",
      section,
      `Banking security alert: ${anomalyType} in section ${section}`,
    )

    return NextResponse.json({ message: "Anomaly logged successfully" })
  } catch (error) {
    console.error("Error logging banking anomaly:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
