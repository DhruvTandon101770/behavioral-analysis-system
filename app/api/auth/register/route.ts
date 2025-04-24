import { NextResponse } from "next/server"
import { query, saveBehavioralProfile } from "@/lib/db"
import { logAudit } from "@/lib/auth"
import { hashPassword } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { username, email, password, behavioralProfile, captchaText } = await request.json()

    // Check if username already exists
    const existingUsers = (await query("SELECT * FROM users WHERE username = ? OR email = ?", [
      username,
      email,
    ])) as any[]

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.username === username) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 })
      }
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 })
      }
    }

    // Hash password (in a real app, use bcrypt)
    const hashedPassword = hashPassword(password)

    // Insert new user
    const result = (await query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [
      username,
      email,
      hashedPassword,
    ])) as any

    const userId = result.insertId

    // Save behavioral profile if provided
    if (behavioralProfile) {
      console.log("Saving behavioral profile for user:", userId)
      const saveResult = await saveBehavioralProfile(userId, behavioralProfile)
      console.log("Save result:", saveResult)
    } else {
      console.log("No behavioral profile provided for user:", userId)
    }

    // Log the registration
    await logAudit(
      userId,
      "CREATE",
      "users",
      userId.toString(),
      `User registration with CAPTCHA: ${captchaText || "N/A"}`,
    )

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: userId,
        username,
        email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
