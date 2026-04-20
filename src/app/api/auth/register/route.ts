import { createUser, getUsers } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const users = getUsers()
    const existingUser = users.find(u => u.email === email)

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Create user (password stored as plain text for demo)
    const user = createUser(
      email,
      password,
      name || email.split("@")[0],
      "USER"
    )

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
