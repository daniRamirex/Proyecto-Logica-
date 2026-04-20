import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Mock user storage (in production, this would be a database)
let users: Array<{
  id: string
  email: string
  name: string
  password: string
  role: string
}> = []

// Initialize with some default users if none exist
if (typeof window === 'undefined' && users.length === 0) {
  users = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Administrator',
      password: 'admin123', // Plain text for demo
      role: 'ADMIN'
    }
  ]
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Load users from localStorage if in browser
        if (typeof window !== 'undefined') {
          const storedUsers = localStorage.getItem('music-rights-users')
          if (storedUsers) {
            users = JSON.parse(storedUsers)
          }
        }

        const user = users.find(u => u.email === credentials.email)

        if (!user) {
          return null
        }

        // For demo purposes, we're storing plain text passwords
        // In production, use proper password hashing
        if (user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  }
})

// Helper functions for user management
export const createUser = (email: string, password: string, name: string, role: string = 'USER') => {
  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    password, // In production, hash this password
    role
  }

  users.push(newUser)

  // Save to localStorage if in browser
  if (typeof window !== 'undefined') {
    localStorage.setItem('music-rights-users', JSON.stringify(users))
  }

  return newUser
}

export const getUsers = () => {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('music-rights-users')
    if (storedUsers) {
      users = JSON.parse(storedUsers)
    }
  }
  return users
}
