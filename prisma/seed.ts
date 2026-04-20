import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Administrator',
        role: 'ADMIN'
      }
    })

    console.log('✓ Admin user created:', admin.email)

    // Create regular users
    const userPassword = await bcrypt.hash('user123', 10)
    const user1 = await prisma.user.upsert({
      where: { email: 'artist1@example.com' },
      update: {},
      create: {
        email: 'artist1@example.com',
        password: userPassword,
        name: 'Julian Sterling',
        role: 'USER'
      }
    })

    const user2 = await prisma.user.upsert({
      where: { email: 'artist2@example.com' },
      update: {},
      create: {
        email: 'artist2@example.com',
        password: userPassword,
        name: 'Luna Echo',
        role: 'USER'
      }
    })

    console.log('✓ Regular users created')

    // Create artists
    const artist1 = await prisma.artist.upsert({
      where: { name: 'Neon Horizon' },
      update: {},
      create: { name: 'Neon Horizon' }
    })

    const artist2 = await prisma.artist.upsert({
      where: { name: 'Midnight Echoes' },
      update: {},
      create: { name: 'Midnight Echoes' }
    })

    console.log('✓ Artists created')

    // Create authors
    const author1 = await prisma.author.upsert({
      where: { name: 'Vesper Lyra' },
      update: {},
      create: { name: 'Vesper Lyra' }
    })

    const author2 = await prisma.author.upsert({
      where: { name: 'Echo Chamberlain' },
      update: {},
      create: { name: 'Echo Chamberlain' }
    })

    console.log('✓ Authors created')

    // Create songs
    const song1 = await prisma.song.upsert({
      where: { title: 'Midnight Symphony' },
      update: {},
      create: {
        title: 'Midnight Symphony',
        genre: 'Electronic',
        releaseDate: new Date('2024-01-15'),
        platform: 'Spotify',
        legalMeta: 'Copyright © 2024. All rights reserved.',
        userId: user1.id
      }
    })

    const song2 = await prisma.song.upsert({
      where: { title: 'Urban Echoes' },
      update: {},
      create: {
        title: 'Urban Echoes',
        genre: 'Lo-Fi',
        releaseDate: new Date('2024-02-10'),
        platform: 'Apple Music',
        legalMeta: 'Copyright © 2024. All rights reserved.',
        userId: user2.id
      }
    })

    console.log('✓ Songs created')

    // Associate artists with songs
    await prisma.songArtist.upsert({
      where: {
        songId_artistId: {
          songId: song1.id,
          artistId: artist1.id
        }
      },
      update: {},
      create: {
        songId: song1.id,
        artistId: artist1.id
      }
    })

    await prisma.songArtist.upsert({
      where: {
        songId_artistId: {
          songId: song2.id,
          artistId: artist2.id
        }
      },
      update: {},
      create: {
        songId: song2.id,
        artistId: artist2.id
      }
    })

    console.log('✓ Song-Artist associations created')

    // Associate authors with songs
    await prisma.songAuthor.upsert({
      where: {
        songId_authorId: {
          songId: song1.id,
          authorId: author1.id
        }
      },
      update: {},
      create: {
        songId: song1.id,
        authorId: author1.id
      }
    })

    await prisma.songAuthor.upsert({
      where: {
        songId_authorId: {
          songId: song2.id,
          authorId: author2.id
        }
      },
      update: {},
      create: {
        songId: song2.id,
        authorId: author2.id
      }
    })

    console.log('✓ Song-Author associations created')
    console.log('\n✅ Seed data successfully created!')
    console.log('\nTest Accounts:')
    console.log('Admin:')
    console.log('  Email: admin@example.com')
    console.log('  Password: admin123')
    console.log('\nUser 1:')
    console.log('  Email: artist1@example.com')
    console.log('  Password: user123')
    console.log('\nUser 2:')
    console.log('  Email: artist2@example.com')
    console.log('  Password: user123')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
