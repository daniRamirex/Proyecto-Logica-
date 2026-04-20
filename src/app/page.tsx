import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    const role = (session.user as any).role
    redirect(role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-lg mb-6">
            <span className="text-3xl">🎵</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">The Sonic Ledger</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            El Libro Mayor de la Propiedad Intelectual
          </p>
        </div>

        <div className="bg-dark-surface rounded-lg p-8 mb-8 border border-primary/20">
          <p className="text-gray-300 mb-4">
            Una plataforma premium para la gestión de derechos de música.
          </p>
          <p className="text-gray-400 text-sm">
            Asegura tu legado con marcos legales de alta fidelidad y expresión creativa fluida.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition">
              Entrar
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold transition">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
