# The Sonic Ledger - Music Rights Management Platform

Una plataforma completa para la gestión de derechos de música con autenticación basada en roles, control de acceso y un sistema robusto de gestión de datos.

## 🎯 Características

- **Autenticación con Roles**: Soporte para usuarios normales y administradores
- **Panel de Control Personalizado**: Dashboards diferentes según el rol del usuario
- **Gestión Completa de Canciones**: CRUD completo para canciones (solo admin)
- **Sistema de Búsqueda y Filtros**: Búsqueda avanzada por título, género, artista, autor y usuario
- **Estadísticas en Tiempo Real**: Monitoreo de canciones, artistas, autores y usuarios (admin)
- **Seguridad Multi-tenant**: Aislamiento de datos por usuario
- **Base de Datos Relacional**: PostgreSQL con Prisma ORM

## 🏗️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js (Auth.js)
- **Estilos**: Tailwind CSS
- **TypeScript**: Tipado completo

## 📋 Requisitos Previos

- Node.js 18.17 o superior
- PostgreSQL 12 o superior
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
cd "Derechos de autor"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:

```env
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/music_rights_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-una-clave-segura-con: openssl rand -base64 32"
```

### 4. Crear la base de datos PostgreSQL

```bash
# Conectarse a PostgreSQL y crear la base de datos
createdb music_rights_db
```

### 5. Ejecutar migraciones de Prisma

```bash
npm run db:generate
npm run db:push
```

Esto creará todas las tablas necesarias en la base de datos.

### 6. Crear un usuario administrador (Opcional)

Puedes crear un usuario administrador directamente en la base de datos:

```bash
npx prisma db seed
```

O manualmente usando una herramienta como pgAdmin:

```sql
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$10$...',  -- contraseña hasheada con bcrypt
  'Administrator',
  'ADMIN',
  NOW(),
  NOW()
);
```

## 🏃 Ejecutar la Aplicación

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm start
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **users**: Usuarios del sistema con roles (USER, ADMIN)
- **songs**: Canciones registradas con información completa
- **artists**: Artistas asociados a las canciones
- **authors**: Autores/compositores de las canciones
- **song_artists**: Relación muchos-a-muchos entre songs y artists
- **song_authors**: Relación muchos-a-muchos entre songs y authors

## 👥 Roles del Sistema

### Usuario Normal
- ✅ Registrarse e iniciar sesión
- ✅ Ver únicamente sus propias canciones
- ✅ Acceso a información completa de sus canciones
- ❌ No puede crear, editar ni eliminar canciones
- ❌ No puede ver canciones de otros usuarios

### Administrador
- ✅ Acceso completo al sistema
- ✅ Crear, editar y eliminar canciones
- ✅ Registrar canciones con múltiples artistas y autores
- ✅ Ver todas las canciones del sistema
- ✅ Buscar y filtrar canciones
- ✅ Ver estadísticas del sistema

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/[...nextauth]` - NextAuth endpoint

### Canciones
- `GET /api/songs` - Obtener canciones (filtra por usuario si no es admin)
- `POST /api/songs` - Crear nueva canción (solo admin)
- `GET /api/songs/[id]` - Obtener canción específica
- `PUT /api/songs/[id]` - Editar canción (solo admin)
- `DELETE /api/songs/[id]` - Eliminar canción (solo admin)

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del sistema (solo admin)

## 🎨 Interfaz de Usuario

### Página de Inicio
- Información sobre la plataforma
- Enlaces para login y registro

### Autenticación
- Formulario de login
- Formulario de registro
- Validación de contraseñas

### Dashboard Admin
- Estadísticas en tiempo real
- Búsqueda avanzada de canciones
- Grid de canciones con opciones de edición/eliminación
- Botón para registrar nueva canción

### Dashboard Usuario
- Vista de sus canciones registradas
- Información completa de cada canción
- Contador de canciones
- Información de protección

### Formulario de Canciones
- Campos para: título, género, artista(s), autor(es)
- Fecha de lanzamiento y plataforma
- Metadata legal
- Agregar/eliminar múltiples artistas y autores

## 🔒 Seguridad

- Autenticación JWT con NextAuth.js
- Contraseñas hasheadas con bcrypt
- Control de acceso basado en roles (RBAC)
- Validación de entrada en todas las rutas
- Queries protegidas a nivel de API

## 📝 Desarrollo

### Estructura de Carpetas

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Rutas de autenticación
│   │   ├── songs/        # Rutas de canciones
│   │   └── stats/        # Rutas de estadísticas
│   ├── auth/             # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/        # Dashboards
│   │   ├── admin/
│   │   ├── user/
│   │   └── layout.tsx
│   ├── layout.tsx        # Layout global
│   └── page.tsx          # Página de inicio
├── components/           # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── SongCard.tsx
│   └── SongForm.tsx
├── lib/
│   ├── auth.ts          # Configuración de NextAuth
│   └── prisma.ts        # Cliente de Prisma
└── styles/
    └── globals.css      # Estilos globales

prisma/
├── schema.prisma        # Esquema de la base de datos
└── seed.ts             # Script para poblar datos iniciales
```

## 🐛 Troubleshooting

### Error: "DATABASE_URL is not set"
- Asegúrate de que `.env.local` contiene `DATABASE_URL`
- Verifica que la base de datos PostgreSQL está corriendo

### Error: "NEXTAUTH_SECRET is not set"
- Genera un secret seguro: `openssl rand -base64 32`
- Agrégalo a `.env.local`

### Error en migraciones de Prisma
```bash
# Reiniciar las migraciones
npm run db:push -- --skip-generate
```

### La página no carga
- Verifica que el servidor está corriendo en `http://localhost:3000`
- Limpia el cache del navegador (Ctrl+Shift+Delete)

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 Licencia

Este proyecto es parte del sistema de gestión de derechos de autor.

## 🤝 Contribuciones

Para sugerencias o reportes de bugs, por favor abre un issue.

---

**The Sonic Ledger** - El Libro Mayor de la Propiedad Intelectual 🎵
