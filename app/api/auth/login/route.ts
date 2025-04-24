import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { createToken, logAudit } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Find user in database
    const users = (await query("SELECT * FROM users WHERE username = ?", [username])) as any[]

    // Check if user exists and password matches
    // In a real app, you would use bcrypt to compare hashed passwords
    if (users.length === 0 || users[0].password !== password) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    const user = users[0]

    // Generate JWT token
    const token = createToken({ id: user.id, username: user.username })

    // Log the login action
    await logAudit(user.id, "LOGIN", "users", user.id.toString(), "User login successful")

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
