# 🚀 Quick Start Reference - The Sonic Ledger

## ⚡ Comandos Esenciales

```bash
# Instalación inicial
npm install
cp .env.example .env.local
npm run db:generate
npm run db:push

# Agregar datos de prueba
npx prisma db seed

# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Herramientas útiles
npx prisma studio  # Ver base de datos
npm run lint       # Validar código
```

## 🔐 Credenciales de Prueba

```
ADMIN:
  Email: admin@example.com
  Pass: admin123

USER 1:
  Email: artist1@example.com
  Pass: user123

USER 2:
  Email: artist2@example.com
  Pass: user123
```

## 🗺️ Rutas de la Aplicación

```
/                          → Página de inicio
/auth/login                → Iniciar sesión
/auth/register             → Registrarse
/dashboard/admin           → Panel de admin
/dashboard/admin/songs/new → Crear canción
/dashboard/admin/songs/:id → Editar canción
/dashboard/user            → Panel de usuario
```

## 📡 Endpoints API

```
POST   /api/auth/register
POST   /api/auth/[...nextauth]
GET    /api/songs
POST   /api/songs
GET    /api/songs/{id}
PUT    /api/songs/{id}
DELETE /api/songs/{id}
GET    /api/stats
```

## 🗄️ Estructura Base de Datos

```
users
├── id (PK)
├── email (UNIQUE)
├── password (hashed)
├── name
├── role (USER|ADMIN)
└── timestamps

songs
├── id (PK)
├── title
├── genre
├── releaseDate
├── platform
├── legalMeta
├── userId (FK)
└── timestamps

artists
├── id (PK)
├── name (UNIQUE)
└── timestamps

authors
├── id (PK)
├── name (UNIQUE)
└── timestamps

song_artists (N:M)
├── songId (FK, PK)
├── artistId (FK, PK)

song_authors (N:M)
├── songId (FK, PK)
├── authorId (FK, PK)
```

## 🎨 Componentes Principales

```
App
├── Layout
├── Home
├── Auth/Login
├── Auth/Register
├── Dashboard/Admin
│   ├── Navbar
│   └── SongCard (multiple)
├── Dashboard/User
│   └── SongCard (filtered)
└── Components/
    ├── SongForm
    ├── SongCard
    └── Navbar
```

## 🔒 Control de Acceso por Ruta

```
Protected Routes (requieren autenticación):
- /dashboard/*
- /api/songs
- /api/stats

Role-based Routes:
- /dashboard/admin/* → Solo ADMIN
- /dashboard/user/*  → Solo USER

Public Routes:
- /
- /auth/login
- /auth/register
```

## 🐛 Errores Comunes y Soluciones

```
❌ ECONNREFUSED 127.0.0.1:5432
✅ PostgreSQL no está corriendo
   → net start postgresql-x64-15 (Windows)
   → brew services start postgresql@15 (Mac)

❌ "password authentication failed"
✅ DATABASE_URL tiene contraseña incorrecta
   → Actualiza .env.local

❌ "NEXTAUTH_SECRET is not set"
✅ Variable de entorno faltante
   → Genera: openssl rand -base64 32
   → Agrega a .env.local

❌ "Syntax error in prisma schema"
✅ Schema.prisma tiene error
   → npx prisma validate
   → Revisa el error

❌ La página no carga
✅ Servidor no está corriendo
   → npm run dev
   → Abre http://localhost:3000
```

## 🔄 Flujo de Autenticación

```
User visits /auth/login
    ↓
User enters credentials
    ↓
POST /api/auth/[...nextauth]
    ↓
NextAuth validates with Credentials provider
    ↓
Backend queries user from DB
    ↓
Compare password hashes
    ↓
Generate JWT token
    ↓
User redirected to dashboard
    ↓
Subsequent requests include JWT
    ↓
Backend validates token in middleware
    ↓
Access granted to protected resources
```

## 📊 Flujo de Datos (Crear Canción)

```
User clicks "+ Registrar Canción"
    ↓
Opens SongForm component
    ↓
User fills fields and clicks "Guardar"
    ↓
SongForm validates locally
    ↓
POST /api/songs
    ↓
Backend validates JWT + role
    ↓
Backend validates data again
    ↓
Create Song in DB
    ↓
For each artist:
  └─ Find or create Artist
  └─ Create SongArtist association
    ↓
For each author:
  └─ Find or create Author
  └─ Create SongAuthor association
    ↓
Return complete Song with relations
    ↓
Frontend receives success
    ↓
User redirected to dashboard
```

## 🔍 Búsqueda (Admin)

```
User types in search box
    ↓
Frontend filters locally:
  - song.title.toLowerCase().includes(query)
  - song.genre.toLowerCase().includes(query)
  - song.user.name.toLowerCase().includes(query)
  - song.user.email.toLowerCase().includes(query)
  - artists map contains query
  - authors map contains query
    ↓
Results updated in real-time
    ↓
Display matching SongCards
```

## 📦 Stack Versions

```
Next.js:        ^15.0.0
React:          ^19.0.0-rc.1
TypeScript:     ^5.3.3
Prisma:         ^5.8.0
NextAuth:       ^5.0.0-beta.28
PostgreSQL:     ^12
Node:           ^18.17
```

## 🎯 Checklist de Setup

```
[ ] Node.js 18.17+ instalado
[ ] PostgreSQL corriendo
[ ] Base de datos creada
[ ] .env.local configurado
[ ] npm install ejecutado
[ ] npm run db:generate ejecutado
[ ] npm run db:push ejecutado
[ ] npm run dev funcionando
[ ] http://localhost:3000 accesible
[ ] Puedo hacer login con credenciales de prueba
```

## 📈 Performance Tips

```
✅ Usar Prisma Studio para inspeccionar DB
   → npx prisma studio

✅ Enable query logging
   → DEBUG=prisma:* npm run dev

✅ Use Next.js Image for optimized images
   → import Image from 'next/image'

✅ Implement incremental static generation
   → revalidate: 3600

✅ Use React.memo for expensive components
   → export default React.memo(Component)
```

## 🌐 Environment Variables

```
# .env.local

DATABASE_URL="postgresql://user:pass@localhost:5432/music_rights_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-with-openssl-rand-base64-32"
```

## 📝 Naming Conventions

```
Files:         kebab-case (song-card.tsx)
Folders:       kebab-case (song-management/)
Functions:     camelCase (getSongById)
Components:    PascalCase (SongCard)
Constants:     UPPER_SNAKE_CASE (MAX_SONGS)
Types/Interfaces: PascalCase (SongProps)
Variables:     camelCase (currentSong)
```

## 🎨 Color Scheme

```
Primary:       #A855F7 (Purple)
Dark BG:       #0F172A (Almost Black)
Dark Surface:  #1E293B (Dark Slate)
Accent:        #D946EF (Bright Purple)
Error:         #EF4444 (Red)
Success:       #10B981 (Green)
Warning:       #F59E0B (Amber)
```

## 📱 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px

Use Tailwind: sm: md: lg: xl: 2xl:
```

## ✅ Pre-deployment Checklist

```
[ ] Remove console.logs
[ ] Remove commented code
[ ] Run npm run lint
[ ] Test all user flows
[ ] Test all admin flows
[ ] Test error handling
[ ] Set NEXTAUTH_SECRET
[ ] Set DATABASE_URL production
[ ] Run npm run build
[ ] Test npm start locally
[ ] Setup database backups
[ ] Configure monitoring
[ ] Setup error logging
```

---

**Quick Reference v1.0** | Last updated: April 2024
