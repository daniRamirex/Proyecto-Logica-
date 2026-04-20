'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  return (
    <nav className="bg-dark-surface border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user'} className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-xl gradient-text">The Sonic Ledger</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {session?.user?.name || session?.user?.email}
            </span>
            {role && <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">{role}</span>}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
