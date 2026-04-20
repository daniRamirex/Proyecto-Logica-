'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SongForm } from '@/components/SongForm'

type Params = {
  id: string
}

export default function EditSongPage({ params }: { params: Promise<Params> }) {
  const { data: session } = useSession()
  const [song, setSong] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params
      setId(id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchSong = async () => {
      try {
        const response = await fetch(`/api/songs/${id}`)
        if (response.ok) {
          setSong(await response.json())
        }
      } catch (error) {
        console.error('Error fetching song:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSong()
  }, [id])

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/auth/login')
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Editar Canción</h1>
        <p className="text-gray-400 mb-8">Modifica la información de la canción</p>

        <div className="bg-dark-surface border border-primary/20 rounded-lg p-8">
          {song && <SongForm songId={id} initialData={song} />}
        </div>
      </div>
    </div>
  )
}
