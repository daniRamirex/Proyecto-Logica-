import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
      songs = await prisma.song.findMany({
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
    } else {
      // User sees only their songs
      songs = await prisma.song.findMany({
        where: {
          userId: userId
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
    const song = await prisma.song.create({
      data: {
        title,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        platform,
        legalMeta,
        userId: userId || (session.user.id as string)
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

    // Add artists
    if (artists && Array.isArray(artists)) {
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
            songId: song.id,
            artistId: artist.id
          }
        })
      }
    }

    // Add authors
    if (authors && Array.isArray(authors)) {
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
            songId: song.id,
            authorId: author.id
          }
        })
      }
    }

    // Fetch updated song with relations
    const updatedSong = await prisma.song.findUnique({
      where: { id: song.id },
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

    return NextResponse.json(updatedSong, { status: 201 })
  } catch (error) {
    console.error("Create song error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
