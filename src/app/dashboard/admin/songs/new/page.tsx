'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { SongForm } from '@/components/SongForm'

export default function NewSongPage() {
  const { data: session } = useSession()

  if (!session || (session.user as any).role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Registrar Nueva Canción</h1>
        <p className="text-gray-400 mb-8">Agregue una nueva canción al Libro Mayor</p>

        <div className="bg-dark-surface border border-primary/20 rounded-lg p-8">
          <SongForm />
        </div>
      </div>
    </div>
  )
}
