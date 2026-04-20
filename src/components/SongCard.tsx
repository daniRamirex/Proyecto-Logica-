'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SongCardProps {
  song: any
  isAdmin?: boolean
  onDelete?: (id: string) => void
}

export function SongCard({ song, isAdmin = false, onDelete }: SongCardProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta canción?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete?.(song.id)
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting song:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-dark-surface border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{song.title}</h3>
          <p className="text-sm text-gray-400">Género: {song.genre}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/admin/songs/${song.id}`)}
              className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded transition"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded transition disabled:opacity-50"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>

      {song.artists && song.artists.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Artista(s):</p>
          <p className="text-sm">{song.artists.map((a: any) => a.artist.name).join(', ')}</p>
        </div>
      )}

      {song.authors && song.authors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Autor(es):</p>
          <p className="text-sm">{song.authors.map((a: any) => a.author.name).join(', ')}</p>
        </div>
      )}

      {song.releaseDate && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Fecha: {new Date(song.releaseDate).toLocaleDateString()}</p>
        </div>
      )}

      {song.platform && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Plataforma: {song.platform}</p>
        </div>
      )}

      {song.legalMeta && (
        <div className="mt-3 p-3 bg-primary/10 rounded text-xs text-gray-300">
          <strong>Legal:</strong> {song.legalMeta}
        </div>
      )}

      {isAdmin && song.user && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Propietario: {song.user.name || song.user.email}</p>
        </div>
      )}
    </div>
  )
}
