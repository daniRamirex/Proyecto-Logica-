import { auth } from "@/lib/auth"
import { getSongById, updateSong, deleteSong, addArtistToSong, addAuthorToSong, removeArtistFromSong, removeAuthorFromSong } from "@/lib/localStorage"
import { NextRequest, NextResponse } from "next/server"

type Params = {
  id: string
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = session.user.id as string
    const role = (session.user as any).role

    const song = getSongById(id)

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Check access: admin or owner
    if (role !== "ADMIN" && song.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(song)
  } catch (error) {
    console.error("Get song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { title, genre, releaseDate, platform, legalMeta, artists, authors } = body

    // Check song exists
    const song = getSongById(id)

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Update song
    const updatedSong = updateSong(id, {
      title: title || undefined,
      genre: genre || undefined,
      releaseDate: releaseDate ? new Date(releaseDate).toISOString() : undefined,
      platform: platform || undefined,
      legalMeta: legalMeta || undefined
    })

    if (!updatedSong) {
      return NextResponse.json({ error: "Failed to update song" }, { status: 500 })
    }

    // Update artists if provided
    if (artists !== undefined) {
      // Remove all existing artists
      for (const artist of updatedSong.artists) {
        removeArtistFromSong(id, artist.artist.id)
      }

      // Add new artists
      for (const artistName of artists) {
        addArtistToSong(id, artistName)
      }
    }

    // Update authors if provided
    if (authors !== undefined) {
      // Remove all existing authors
      for (const author of updatedSong.authors) {
        removeAuthorFromSong(id, author.author.id)
      }

      // Add new authors
      for (const authorName of authors) {
        addAuthorToSong(id, authorName)
      }
    }

    // Fetch updated song
    const finalSong = getSongById(id)

    return NextResponse.json(finalSong)
  } catch (error) {
    console.error("Update song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    // Check song exists
    const song = getSongById(id)

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Delete song
    const deleted = deleteSong(id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete song" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
