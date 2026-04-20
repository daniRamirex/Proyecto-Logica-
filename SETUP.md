# 🚀 Guía Completa de Configuración - The Sonic Ledger

Esta guía te llevará paso a paso por toda la configuración necesaria para ejecutar la aplicación en tu máquina local.

## 📋 Prerequisitos

Verifica que tienes instalado:

```bash
# Verificar Node.js
node --version  # Debe ser 18.17 o superior

# Verificar npm
npm --version   # Debe ser 9.0 o superior
```

Si no los tienes, descarga desde [nodejs.org](https://nodejs.org)

## 🗄️ Configuración de PostgreSQL

### Windows

1. **Descargar PostgreSQL**
   - Visita [postgresql.org](https://www.postgresql.org/download/windows/)
   - Descarga e instala la versión más reciente

2. **Durante la instalación**
   - Recuerda la contraseña del usuario `postgres`
   - Puerto predeterminado: 5432

3. **Crear la base de datos**
   ```bash
   # Abrir PowerShell o CMD
   psql -U postgres

   # Una vez en psql:
   CREATE DATABASE music_rights_db;
   \l  # Listar bases de datos para confirmar
   \q  # Salir
   ```

### Mac

```bash
# Usar Homebrew
brew install postgresql@15

# Iniciar servicio
brew services start postgresql@15

# Crear base de datos
createdb music_rights_db
```

### Linux (Ubuntu/Debian)

```bash
# Instalar PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Iniciar servicio
sudo systemctl start postgresql

# Crear base de datos
sudo -u postgres createdb music_rights_db
```

## 🎯 Instalación de la Aplicación

### 1. Navegar a la carpeta del proyecto

```bash
cd "Derechos de autor"
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todos los paquetes necesarios (Next.js, Prisma, NextAuth, etc.)

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar con tu editor preferido
# En Windows (VS Code):
code .env.local
```

**Contenido de `.env.local`:**

```env
# 🔗 Conexión a Base de Datos
# Formato: postgresql://usuario:contraseña@host:puerto/base_datos
# Ejemplo:
DATABASE_URL="postgresql://postgres:tucontraseña@localhost:5432/music_rights_db"

# 🔐 Configuración de NextAuth
NEXTAUTH_URL="http://localhost:3000"

# Generar secret seguro:
# En PowerShell:
# [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# En Bash/Mac/Linux:
# openssl rand -base64 32

NEXTAUTH_SECRET="tu-clave-segura-aqui"
```

### 4. Inicializar la base de datos

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push
```

Si todo funciona correctamente, verás:
```
✓ Generated Prisma Client
✓ Pushed to database successfully
```

### 5. (Opcional) Poblar con datos de prueba

```bash
# Ejecutar el script seed
npx prisma db seed
```

Esto creará:
- 1 usuario admin: `admin@example.com` / `admin123`
- 2 usuarios normales
- 2 artistas
- 2 autores
- 2 canciones de ejemplo

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

Verás algo como:
```
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Detener la aplicación

Presiona `Ctrl + C` en la terminal

## 🧪 Pruebas de Funcionalidad

### Test 1: Registro de Usuario

1. Navega a `http://localhost:3000/auth/register`
2. Completa el formulario:
   - Nombre: Tu nombre
   - Email: test@example.com
   - Contraseña: Contraseña123
3. Haz clic en "Crear Cuenta"
4. Deberías ser redirigido a la página de login

### Test 2: Iniciar Sesión como Usuario Normal

1. Ve a `http://localhost:3000/auth/login`
2. Usa las credenciales:
   - Email: `artist1@example.com`
   - Contraseña: `user123`
3. Deberías ver el dashboard del usuario con sus canciones

### Test 3: Iniciar Sesión como Admin

1. Ve a `http://localhost:3000/auth/login`
2. Usa las credenciales:
   - Email: `admin@example.com`
   - Contraseña: `admin123`
3. Deberías ver el dashboard del admin con estadísticas

### Test 4: Crear Nueva Canción (Admin)

1. Logueado como admin, haz clic en "+ Registrar Canción"
2. Completa:
   - Nombre: "Mi Canción de Prueba"
   - Género: "Rock"
   - Agregar un artista: "The Beatles"
   - Agregar un autor: "John Lennon"
3. Haz clic en "Guardar Canción"
4. Deberías ver la canción en el listado

### Test 5: Buscar Canciones (Admin)

1. En el dashboard del admin, escribe en la barra de búsqueda
2. Prueba buscando por:
   - Nombre de canción
   - Género
   - Artista
   - Autor
   - Email del usuario propietario

## 📊 Gestionar la Base de Datos

### Ver datos con Prisma Studio

```bash
npx prisma studio
```

Se abrirá una interfaz web en `http://localhost:5555` donde puedes:
- Ver todas las tablas
- Crear, editar y eliminar registros
- Hacer consultas

### Hacer copias de seguridad

```bash
# Exportar base de datos
pg_dump music_rights_db > backup.sql

# Importar desde backup
psql music_rights_db < backup.sql
```

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED 127.0.0.1:5432"

**Causa**: PostgreSQL no está corriendo

**Solución**:
```bash
# Windows
net start postgresql-x64-15

# Mac
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Error: "password authentication failed for user 'postgres'"

**Causa**: Contraseña incorrecta en DATABASE_URL

**Solución**:
1. Verifica la contraseña que estableciste durante la instalación
2. Actualiza `.env.local` con la contraseña correcta

### Error: "Syntax error in prisma schema"

**Causa**: El schema.prisma tiene un error

**Solución**:
```bash
# Validar el schema
npx prisma validate

# Ver el error específico
npx prisma format
```

### Error: "NEXTAUTH_SECRET is not set"

**Causa**: La variable de entorno no está configurada

**Solución**:
```bash
# Generar una clave segura
# En PowerShell:
$env:NEXTAUTH_SECRET = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# En Bash:
export NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Copiar y pegar en .env.local
```

### La aplicación carga lentamente

**Causa**: El servidor de desarrollo está comprimiendo

**Solución**:
1. Espera a que Next.js termine de compilar
2. Limpia el cache: `rm -rf .next`
3. Reinicia: `npm run dev`

## 📁 Estructura de Archivos Importantes

```
project/
├── src/
│   ├── app/              # Aplicación principal
│   ├── components/       # Componentes React
│   ├── lib/              # Lógica compartida
│   └── styles/           # Estilos CSS
├── prisma/
│   ├── schema.prisma     # Definición de BD
│   └── seed.ts           # Datos iniciales
├── public/               # Archivos estáticos
├── .env.local            # Variables de entorno (NO compartir)
├── .gitignore            # Archivos ignorados por Git
├── next.config.js        # Configuración de Next.js
├── tailwind.config.ts    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
├── package.json          # Dependencias
└── README.md             # Este archivo
```

## 🚀 Deployment (Producción)

### Preparar para producción

```bash
# Compilar la aplicación
npm run build

# Probar la compilación localmente
npm start
```

### Usar con Vercel (Recomendado)

1. Sube tu proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en "New Project"
4. Importa tu repositorio
5. Configura las variables de entorno
6. Despliega

### Usar con otros servidores

1. Ejecuta `npm run build`
2. Sube los archivos a tu servidor
3. Asegúrate de que PostgreSQL esté accesible
4. Ejecuta `npm start`

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth](https://next-auth.js.org)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs)

## 💡 Tips y Trucos

1. **Usar Prisma Studio para ver datos**:
   ```bash
   npx prisma studio
   ```

2. **Ver logs de Prisma**:
   - Agregar a `.env.local`: `DEBUG=prisma:*`

3. **Formatear código automáticamente**:
   ```bash
   npm run lint
   ```

4. **Regenerar cliente de Prisma**:
   ```bash
   npm run db:generate
   ```

5. **Ver migraciones existentes**:
   ```bash
   npx prisma migrate status
   ```

---

¿Necesitas ayuda? Revisa la documentación oficial o abre un issue en el repositorio.

**Happy Coding! 🎵🚀**
