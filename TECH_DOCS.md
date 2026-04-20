# 📖 Documentación Técnica - The Sonic Ledger

## Descripción General

The Sonic Ledger es una plataforma web completa para la gestión de derechos de música con arquitectura moderna, autenticación basada en roles y control de acceso granular.

## 🏗️ Arquitectura del Sistema

### Capas Principales

```
┌─────────────────────────────────────────┐
│         Capa de Presentación            │
│    (React Components + Next.js Pages)   │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│      Capa de API (Next.js Routes)       │
│    (RESTful API Endpoints + Auth)       │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│    Capa de Datos (Prisma + PostgreSQL)  │
│  (ORM + Gestor de Base de Datos)        │
└─────────────────────────────────────────┘
```

## 🗄️ Esquema de Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
  id          STRING PRIMARY KEY DEFAULT cuid()
  email       STRING UNIQUE NOT NULL
  password    STRING NOT NULL
  name        STRING
  role        ENUM('USER', 'ADMIN') DEFAULT 'USER'
  createdAt   TIMESTAMP DEFAULT NOW()
  updatedAt   TIMESTAMP DEFAULT NOW()
)
```

**Relaciones**:
- `1:N` con `songs` (un usuario puede tener muchas canciones)

### Tabla: songs
```sql
CREATE TABLE songs (
  id          STRING PRIMARY KEY DEFAULT cuid()
  title       STRING NOT NULL
  genre       STRING NOT NULL
  releaseDate TIMESTAMP
  platform    STRING
  legalMeta   STRING
  userId      STRING NOT NULL (FK -> users.id)
  createdAt   TIMESTAMP DEFAULT NOW()
  updatedAt   TIMESTAMP DEFAULT NOW()
)
```

**Relaciones**:
- `N:1` con `users` (muchas canciones pertenecen a un usuario)
- `N:M` con `artists` (vía tabla `song_artists`)
- `N:M` con `authors` (vía tabla `song_authors`)

### Tabla: artists
```sql
CREATE TABLE artists (
  id        STRING PRIMARY KEY DEFAULT cuid()
  name      STRING UNIQUE NOT NULL
  createdAt TIMESTAMP DEFAULT NOW()
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### Tabla: authors
```sql
CREATE TABLE authors (
  id        STRING PRIMARY KEY DEFAULT cuid()
  name      STRING UNIQUE NOT NULL
  createdAt TIMESTAMP DEFAULT NOW()
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### Tabla: song_artists (Relación N:M)
```sql
CREATE TABLE song_artists (
  songId    STRING (FK -> songs.id)
  artistId  STRING (FK -> artists.id)
  PRIMARY KEY (songId, artistId)
)
```

### Tabla: song_authors (Relación N:M)
```sql
CREATE TABLE song_authors (
  songId    STRING (FK -> songs.id)
  authorId  STRING (FK -> authors.id)
  PRIMARY KEY (songId, authorId)
)
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Registro**
   - Usuario envía: email, password, nombre
   - El backend hashea la contraseña con bcrypt
   - Se crea el usuario con rol USER
   - Respuesta: usuario creado

2. **Login**
   - Usuario envía: email, password
   - Se verifica el email en la BD
   - Se compara password hasheado con bcrypt
   - NextAuth genera JWT
   - Respuesta: sesión activa

3. **Validación de Sesión**
   - Cada request valida el JWT
   - Se extrae el rol del usuario del token
   - Se aplican reglas de autorización según rol

### Roles y Permisos

| Acción | Usuario | Admin |
|--------|---------|-------|
| Ver propias canciones | ✅ | ✅ |
| Ver todas las canciones | ❌ | ✅ |
| Crear canción | ❌ | ✅ |
| Editar canción | ❌ | ✅ |
| Eliminar canción | ❌ | ✅ |
| Buscar/Filtrar | ❌ | ✅ |
| Ver estadísticas | ❌ | ✅ |

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### Endpoints de Autenticación

#### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "SecurePass123!",
  "name": "Nombre del Usuario"
}

Response 201:
{
  "id": "uuid",
  "email": "usuario@example.com",
  "name": "Nombre del Usuario",
  "role": "USER"
}
```

#### Login
```http
POST /auth/[...nextauth]
(Manejado automáticamente por NextAuth.js)
```

### Endpoints de Canciones

#### Listar Canciones
```http
GET /songs
Authorization: Bearer {token}

Response 200:
[
  {
    "id": "uuid",
    "title": "Nombre Canción",
    "genre": "Rock",
    "releaseDate": "2024-01-15T00:00:00Z",
    "platform": "Spotify",
    "legalMeta": "Copyright info",
    "userId": "uuid",
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "name": "Nombre Usuario"
    },
    "artists": [
      {
        "artist": {
          "id": "uuid",
          "name": "Artista"
        }
      }
    ],
    "authors": [
      {
        "author": {
          "id": "uuid",
          "name": "Compositor"
        }
      }
    ]
  }
]

// Usuario normal: solo ve sus canciones
// Admin: ve todas las canciones
```

#### Crear Canción
```http
POST /songs
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "title": "Nueva Canción",
  "genre": "Electronic",
  "releaseDate": "2024-03-20",
  "platform": "Spotify",
  "legalMeta": "Copyright © 2024",
  "userId": "uuid-del-propietario",
  "artists": ["Artista 1", "Artista 2"],
  "authors": ["Autor 1"]
}

Response 201:
{
  "id": "uuid",
  "title": "Nueva Canción",
  ...
}
```

#### Obtener Canción Específica
```http
GET /songs/{id}
Authorization: Bearer {token}

Response 200:
{
  "id": "uuid",
  ...
}
```

#### Editar Canción
```http
PUT /songs/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "title": "Nombre Actualizado",
  "genre": "Rock",
  ...
}

Response 200:
{
  "id": "uuid",
  ...
}
```

#### Eliminar Canción
```http
DELETE /songs/{id}
Authorization: Bearer {admin-token}

Response 200:
{
  "success": true
}
```

### Endpoints de Estadísticas

#### Obtener Estadísticas (Solo Admin)
```http
GET /stats
Authorization: Bearer {admin-token}

Response 200:
{
  "totalSongs": 42,
  "totalArtists": 15,
  "totalAuthors": 28,
  "totalUsers": 5
}
```

## 🛡️ Seguridad

### Implementaciones de Seguridad

1. **Hashing de Contraseñas**
   - Algoritmo: bcrypt (rounds: 10)
   - Las contraseñas nunca se almacenan en texto plano

2. **JWT (JSON Web Tokens)**
   - Incluye: id, email, rol
   - Expiración: 30 días
   - Se valida en cada request

3. **RBAC (Role-Based Access Control)**
   - Middleware en cada ruta protegida
   - Validación del rol antes de permitir acción

4. **Validación de Entrada**
   - Todos los datos se validan en el servidor
   - Previene inyección SQL (Prisma ORM)

5. **CORS (Cross-Origin Resource Sharing)**
   - Configurado en Next.js
   - Solo requests desde el mismo origen

## 🎨 Componentes Frontend

### Estructura de Componentes

```
components/
├── Navbar.tsx          # Barra de navegación global
├── SongCard.tsx        # Card para mostrar canciones
└── SongForm.tsx        # Formulario para crear/editar

pages/
├── index               # Página de inicio
├── auth/
│   ├── login          # Formulario de login
│   └── register       # Formulario de registro
└── dashboard/
    ├── admin/         # Dashboard admin
    └── user/          # Dashboard usuario
```

### Props y Interfaces

#### SongCard Props
```typescript
interface SongCardProps {
  song: Song
  isAdmin?: boolean
  onDelete?: (id: string) => void
}
```

#### SongForm Props
```typescript
interface SongFormProps {
  songId?: string
  initialData?: Song
}
```

## 🔄 Flujos de Negocio

### Flujo: Usuario ve sus canciones

1. Usuario hace login → obtiene JWT
2. Navega a `/dashboard/user`
3. Frontend llama a `GET /api/songs`
4. Backend valida JWT y extrae userId
5. Backend consulta: `songs WHERE userId = {id}`
6. Retorna solo canciones del usuario
7. Frontend renderiza las canciones

### Flujo: Admin crea canción

1. Admin hace login → obtiene JWT con rol ADMIN
2. Navega a `/dashboard/admin/songs/new`
3. Completa formulario y envía
4. Frontend valida datos localmente
5. Frontend envía `POST /api/songs` con datos
6. Backend valida JWT y rol = ADMIN
7. Backend valida datos nuevamente
8. Se crea canción en BD
9. Se crean/vinculan artistas
10. Se crean/vinculan autores
11. Se retorna canción completa
12. Frontend redirige a dashboard

### Flujo: Admin busca canciones

1. Admin digita en la barra de búsqueda
2. Frontend filtra las canciones en memoria
3. Se actualiza la vista con resultados
4. Si busca sin haber cargado datos:
   - Llama a `GET /api/songs`
   - Backend valida rol ADMIN
   - Retorna todas las canciones
   - Frontend filtra localmente

## 📊 Tipos de Datos

```typescript
// User
interface User {
  id: string
  email: string
  name?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

// Song
interface Song {
  id: string
  title: string
  genre: string
  releaseDate?: Date
  platform?: string
  legalMeta?: string
  userId: string
  user: User
  artists: SongArtist[]
  authors: SongAuthor[]
  createdAt: Date
  updatedAt: Date
}

// Artist
interface Artist {
  id: string
  name: string
  songs: SongArtist[]
  createdAt: Date
  updatedAt: Date
}

// Author
interface Author {
  id: string
  name: string
  songs: SongAuthor[]
  createdAt: Date
  updatedAt: Date
}

// Session (NextAuth)
interface Session {
  user: {
    id: string
    email: string
    name?: string
    role: 'USER' | 'ADMIN'
  }
}
```

## ⚙️ Variables de Entorno

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@localhost:5432/music_rights_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generada-con-openssl-rand-base64-32

# Opcional: OAuth (futuros)
GITHUB_ID=
GITHUB_SECRET=
```

## 📈 Mejoras Futuras

1. **Autenticación OAuth**
   - Integración con GitHub, Google
   
2. **Carga de Archivos**
   - Subir archivos de audio
   - Almacenamiento en S3

3. **Reportes Avanzados**
   - Gráficos de uso
   - Análisis de copyright

4. **Notificaciones**
   - Email para cambios importantes
   - Sistema de alertas

5. **Auditoría**
   - Log de cambios
   - Trazabilidad completa

## 🧪 Testing

### Tests a Implementar

```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Coverage
npm run test:coverage
```

## 📚 Referencias

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io)
- [NextAuth.js](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

Documentación actualizada: Abril 2024
