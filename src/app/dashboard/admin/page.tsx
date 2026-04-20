'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SongCard } from '@/components/SongCard'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login')
    }

    const role = (session?.user as any)?.role
    if (role !== 'ADMIN') {
      redirect('/dashboard/user')
    }
  }, [session, status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, songsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/songs')
        ])

        if (statsRes.ok) {
          setStats(await statsRes.json())
        }

        if (songsRes.ok) {
          setSongs(await songsRes.json())
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artists?.some((a: any) => a.artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    song.authors?.some((a: any) => a.author.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDelete = (id: string) => {
    setSongs(songs.filter(s => s.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-primary">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Resumen Administrativo</h1>
          <p className="text-gray-400">Monitoreo en tiempo real de la propiedad intelectual y verificación de derechos.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-surface border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Canciones</p>
                  <p className="text-3xl font-bold">{stats.totalSongs}</p>
                </div>
                <span className="text-4xl opacity-20">🎵</span>
              </div>
            </div>

            <div className="bg-dark-surface border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Artistas</p>
                  <p className="text-3xl font-bold">{stats.totalArtists}</p>
                </div>
                <span className="text-4xl opacity-20">👨‍🎤</span>
              </div>
            </div>

            <div className="bg-dark-surface border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Autores</p>
                  <p className="text-3xl font-bold">{stats.totalAuthors}</p>
                </div>
                <span className="text-4xl opacity-20">✍️</span>
              </div>
            </div>

            <div className="bg-dark-surface border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Usuarios</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <span className="text-4xl opacity-20">👥</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/admin/songs/new">
            <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition">
              + Registrar Canción
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por título, género, artista, autor o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-dark-surface border border-primary/20 rounded-lg focus:outline-none focus:border-primary transition text-white"
          />
        </div>

        {/* Songs Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Libro Mayor de Canciones ({filteredSongs.length})</h2>
          {filteredSongs.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No se encontraron canciones
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isAdmin={true}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
