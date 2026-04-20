'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    'CredentialsSignin': 'Email o contraseña incorrectos',
    'AccessDenied': 'Acceso denegado',
    'OAuthSignin': 'Error al conectar con el proveedor OAuth',
    'OAuthCallback': 'Error en el callback de OAuth',
    'EmailSignInError': 'Error al enviar email',
    'Callback': 'Error en el callback',
    'Default': 'Error desconocido en autenticación'
  }

  const message = errorMessages[error as keyof typeof errorMessages] || errorMessages['Default']

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-surface rounded-lg border border-red-500/50 p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">Error de Autenticación</h1>
            <p className="text-gray-400">{message}</p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-sm text-gray-300">
            {error && <code className="text-xs">{error}</code>}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition">
                Volver a Entrar
              </button>
            </Link>
            <Link href="/">
              <button className="w-full px-4 py-2 border border-primary text-primary hover:bg-primary/10 font-semibold rounded-lg transition">
                Ir a Inicio
              </button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Si el problema persiste, contacta con soporte
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
