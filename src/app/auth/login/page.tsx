'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/dashboard/admin')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-surface rounded-lg border border-primary/20 p-8">
          <h1 className="text-3xl font-bold mb-2 gradient-text">Entrar</h1>
          <p className="text-gray-400 mb-8">Accede a tu cuenta</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
                placeholder="ejemplo@empresa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-gray-600 rounded-lg focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition mt-6"
            >
              {loading ? 'Entrando...' : 'Acceder al Ledger'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Registrarse
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
