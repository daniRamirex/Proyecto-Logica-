'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SongFormProps {
  songId?: string
  initialData?: any
}

export function SongForm({ songId, initialData }: SongFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    platform: '',
    legalMeta: '',
    artists: [] as string[],
    authors: [] as string[],
    userId: ''
  })

  const [artistInput, setArtistInput] = useState('')
  const [authorInput, setAuthorInput] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        genre: initialData.genre || '',
        releaseDate: initialData.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : '',
        platform: initialData.platform || '',
        legalMeta: initialData.legalMeta || '',
        artists: initialData.artists?.map((a: any) => a.artist.name) || [],
        authors: initialData.authors?.map((a: any) => a.author.name) || [],
        userId: initialData.userId || ''
      })
    }
  }, [initialData])

  const handleAddArtist = () => {
    if (artistInput.trim()) {
      setFormData(prev => ({
        ...prev,
        artists: [...prev.artists, artistInput.trim()]
      }))
      setArtistInput('')
    }
  }

  const handleRemoveArtist = (index: number) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.filter((_, i) => i !== index)
    }))
  }

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()]
      }))
      setAuthorInput('')
    }
  }

  const handleRemoveAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.title || !formData.genre) {
      setError('Title and genre are required')
      setLoading(false)
      return
    }

    try {
      const url = songId ? `/api/songs/${songId}` : '/api/songs'
      const method = songId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save song')
      }

      router.push('/dashboard/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Song Details */}
      <div>
        <label className="block text-sm font-medium mb-2">Nombre de la Canción *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
          placeholder="Nombre de la canción"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Género *</label>
        <input
          type="text"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
          placeholder="Género musical"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Fecha de Lanzamiento</label>
          <input
            type="date"
            value={formData.releaseDate}
            onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Plataforma</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
            placeholder="Spotify, Apple Music, etc."
          />
        </div>
      </div>

      {/* Artists */}
      <div>
        <label className="block text-sm font-medium mb-2">Artistas</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={artistInput}
            onChange={(e) => setArtistInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArtist())}
            className="flex-1 px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
            placeholder="Agregar artista"
          />
          <button
            type="button"
            onClick={handleAddArtist}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.artists.map((artist, idx) => (
            <span
              key={idx}
              className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {artist}
              <button
                type="button"
                onClick={() => handleRemoveArtist(idx)}
                className="hover:text-red-400"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Authors */}
      <div>
        <label className="block text-sm font-medium mb-2">Autores</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAuthor())}
            className="flex-1 px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
            placeholder="Agregar autor"
          />
          <button
            type="button"
            onClick={handleAddAuthor}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.authors.map((author, idx) => (
            <span
              key={idx}
              className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {author}
              <button
                type="button"
                onClick={() => handleRemoveAuthor(idx)}
                className="hover:text-red-400"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Legal Metadata */}
      <div>
        <label className="block text-sm font-medium mb-2">Metadata Legal</label>
        <textarea
          value={formData.legalMeta}
          onChange={(e) => setFormData({ ...formData, legalMeta: e.target.value })}
          className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
          placeholder="Información legal de la canción"
          rows={4}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Guardando...' : 'Guardar Canción'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
