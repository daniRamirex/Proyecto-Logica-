import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [totalSongs, totalArtists, totalAuthors, totalUsers] = await Promise.all([
      prisma.song.count(),
      prisma.artist.count(),
      prisma.author.count(),
      prisma.user.count()
    ])

    return NextResponse.json({
      totalSongs,
      totalArtists,
      totalAuthors,
      totalUsers
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
