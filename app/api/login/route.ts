import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // This is a mock implementation
    // In a real application, you would validate credentials against a database
    if (username === "demo" && password === "password") {
      return NextResponse.json({
        username,
        message: "Login successful",
      })
    }

    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
