import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type Params = {
  id: string
}

export async function GET(
  req: NextRequest,
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

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        artists: {
          include: {
            artist: true
          }
        },
        authors: {
          include: {
            author: true
          }
        }
      }
    })

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
    const song = await prisma.song.findUnique({
      where: { id }
    })

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Update song
    const updatedSong = await prisma.song.update({
      where: { id },
      data: {
        title: title || undefined,
        genre: genre || undefined,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        platform: platform || undefined,
        legalMeta: legalMeta || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        artists: {
          include: {
            artist: true
          }
        },
        authors: {
          include: {
            author: true
          }
        }
      }
    })

    // Update artists if provided
    if (artists !== undefined) {
      // Delete existing associations
      await prisma.songArtist.deleteMany({
        where: { songId: id }
      })

      // Add new artists
      for (const artistName of artists) {
        let artist = await prisma.artist.findUnique({
          where: { name: artistName }
        })

        if (!artist) {
          artist = await prisma.artist.create({
            data: { name: artistName }
          })
        }

        await prisma.songArtist.create({
          data: {
            songId: id,
            artistId: artist.id
          }
        })
      }
    }

    // Update authors if provided
    if (authors !== undefined) {
      // Delete existing associations
      await prisma.songAuthor.deleteMany({
        where: { songId: id }
      })

      // Add new authors
      for (const authorName of authors) {
        let author = await prisma.author.findUnique({
          where: { name: authorName }
        })

        if (!author) {
          author = await prisma.author.create({
            data: { name: authorName }
          })
        }

        await prisma.songAuthor.create({
          data: {
            songId: id,
            authorId: author.id
          }
        })
      }
    }

    // Fetch updated song
    const finalSong = await prisma.song.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        artists: {
          include: {
            artist: true
          }
        },
        authors: {
          include: {
            author: true
          }
        }
      }
    })

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

    // Check song exists
    const song = await prisma.song.findUnique({
      where: { id }
    })

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Delete song (cascade deletes song_artists and song_authors)
    await prisma.song.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
