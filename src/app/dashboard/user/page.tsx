'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { SongCard } from '@/components/SongCard'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/login')
    }

    const role = (session?.user as any)?.role
    if (role === 'ADMIN') {
      redirect('/dashboard/admin')
    }
  }, [session, status])

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs')
        if (response.ok) {
          setSongs(await response.json())
        }
      } catch (error) {
        console.error('Error fetching songs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [])

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
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Bienvenido de nuevo, {session?.user?.name || session?.user?.email}
          </h1>
          <p className="text-gray-400">Tu propiedad intelectual está segura.</p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tus Canciones Registradas</h2>
              <p className="text-gray-400">Total: <span className="text-primary font-bold text-3xl">{songs.length}</span></p>
            </div>
            <span className="text-6xl opacity-20">🎵</span>
          </div>
        </div>

        {/* Songs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Mi Libro de Canciones</h2>
          {songs.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg mb-2">No tienes canciones registradas aún</p>
              <p className="text-sm">Contacta al administrador para registrar tus canciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isAdmin={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Copyright Info */}
        <div className="mt-12 bg-dark-surface border border-primary/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-semibold mb-2">Protección de Derechos</h3>
              <p className="text-sm text-gray-400">
                Todas tus canciones están protegidas en nuestra plataforma con registros legales verificados.
                Tu información está segura con marcos legales de alta fidelidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
