import { auth } from "@/lib/auth"
import { getSongs, createSong, addArtistToSong, addAuthorToSong } from "@/lib/localStorage"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id as string
    const role = (session.user as any).role

    let songs

    if (role === "ADMIN") {
      // Admin sees all songs
      songs = getSongs()
    } else {
      // User sees only their songs
      songs = getSongs(userId)
    }

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Get songs error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { title, genre, releaseDate, platform, legalMeta, artists, authors, userId } = body

    if (!title || !genre) {
      return NextResponse.json(
        { error: "Title and genre are required" },
        { status: 400 }
      )
    }

    // Create song
    const song = createSong({
      title,
      genre,
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
      platform,
      legalMeta,
      userId: userId || (session.user.id as string),
      user: {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name as string
      }
    })

    // Add artists
    if (artists && Array.isArray(artists)) {
      for (const artistName of artists) {
        addArtistToSong(song.id, artistName)
      }
    }

    // Add authors
    if (authors && Array.isArray(authors)) {
      for (const authorName of authors) {
        addAuthorToSong(song.id, authorName)
      }
    }

    // Fetch updated song with relations
    const updatedSong = getSongs().find(s => s.id === song.id)

    return NextResponse.json(updatedSong, { status: 201 })
  } catch (error) {
    console.error("Create song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
