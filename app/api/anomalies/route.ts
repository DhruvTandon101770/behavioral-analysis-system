import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ message: authResult.error }, { status: 401 })
    }

    // Get user ID from auth result
    const userId = (authResult.user as any).id

    // Fetch anomalies from database
    const anomalies = await query("SELECT * FROM anomalies WHERE user_id = ? ORDER BY timestamp DESC", [userId])

    return NextResponse.json(anomalies)
  } catch (error) {
    console.error("Error fetching anomalies:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
