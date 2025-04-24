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

    // Fetch audit logs from database
    const auditLogs = await query("SELECT * FROM audit_logs WHERE user_id = ? ORDER BY timestamp DESC", [userId])

    return NextResponse.json(auditLogs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
