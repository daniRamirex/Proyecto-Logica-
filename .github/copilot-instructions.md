# The Sonic Ledger - Copilot Instructions

This document provides specific guidance for GitHub Copilot when working with this project.

## Project Overview

**The Sonic Ledger** is a full-stack web application for music copyright management with role-based access control, built with:
- Next.js 15 (App Router)
- PostgreSQL + Prisma ORM
- NextAuth.js for authentication
- Tailwind CSS for styling
- TypeScript throughout

## Architecture and Patterns

### Folder Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Shared utilities (Prisma client, auth config)
- `/src/styles` - Global CSS and Tailwind configuration
- `/prisma` - Database schema and seed scripts

### Component Patterns

1. **Client Components**: Use `'use client'` directive at top of file
2. **Server Components**: Default behavior, no directive needed
3. **Props Interface**: Define `interface ComponentNameProps` above component
4. **Exports**: Always export components as named or default

### Database Patterns

1. Use Prisma for all database operations
2. Import `prisma` from `@/lib/prisma`
3. Always handle errors with try-catch blocks
4. Include proper error responses from API routes

### Authentication Patterns

1. Use `auth()` from `@/lib/auth` to check user session
2. Check role with `(session.user as any).role`
3. Validate role on protected routes before processing
4. Return 401 for unauthenticated, 403 for unauthorized

## Coding Standards

### Naming Conventions
- Files: `kebab-case` (e.g., `song-card.tsx`)
- Folders: `kebab-case` (e.g., `song-management`)
- Functions: `camelCase` (e.g., `getSongById`)
- Components: `PascalCase` (e.g., `SongCard`)
- Types/Interfaces: `PascalCase` (e.g., `SongProps`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_SONGS`)

### TypeScript
- Always define types for function parameters
- Use interfaces for React component props
- Define return types for functions
- Use `any` sparingly (only where unavoidable)

### Code Style
- Use `const` by default, `let` if reassignment needed
- Arrow functions for callbacks
- Destructuring for props and objects
- Template literals for strings with variables

## API Design

### Response Patterns
```typescript
// Success
return NextResponse.json(data, { status: 200 })

// Created
return NextResponse.json(data, { status: 201 })

// Error
return NextResponse.json({ error: 'message' }, { status: 400 })

// Unauthorized
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Forbidden
return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

// Not Found
return NextResponse.json({ error: 'Not found' }, { status: 404 })
```

### Authentication Checks
```typescript
const session = await auth()
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const role = (session.user as any).role
if (role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

## Component Patterns

### Client Components
```typescript
'use client'

import { useState, useEffect } from 'react'

interface ComponentProps {
  // Define props
}

export function ComponentName({ prop }: ComponentProps) {
  // Component code
}
```

### Server Components
```typescript
import { auth } from '@/lib/auth'

export default async function PageName() {
  const session = await auth()
  // Component code
}
```

## Database Queries

### Always use Prisma
```typescript
// Good
const user = await prisma.user.findUnique({ where: { id } })

// Bad - Never use raw SQL unless absolutely necessary
```

### Include Relations
```typescript
const song = await prisma.song.findUnique({
  where: { id },
  include: {
    user: true,
    artists: { include: { artist: true } },
    authors: { include: { author: true } }
  }
})
```

## Common Tasks

### Creating a New Page
1. Create file in `src/app/[section]/page.tsx`
2. Mark as `'use client'` if interactive
3. Import necessary components and utilities
4. Export default function with PascalCase name

### Creating a New API Route
1. Create file in `src/app/api/[section]/route.ts`
2. Export GET, POST, PUT, DELETE as needed
3. Always check authentication first
4. Validate input data
5. Return appropriate status codes

### Creating a New Component
1. Create file in `src/components/ComponentName.tsx`
2. Define props interface above component
3. Mark as `'use client'` if needed
4. Export as named or default export

## Testing Credentials

```
Admin:
  Email: admin@example.com
  Password: admin123

User 1:
  Email: artist1@example.com
  Password: user123

User 2:
  Email: artist2@example.com
  Password: user123
```

## Documentation

- README.md - Project overview
- SETUP.md - Installation guide
- TECH_DOCS.md - Technical documentation
- GUIDE.md - User guide (Spanish)
- QUICK_REFERENCE.md - Quick reference

## Key Files Location

- Authentication: `src/lib/auth.ts`
- Database client: `src/lib/prisma.ts`
- Database schema: `prisma/schema.prisma`
- Global styles: `src/styles/globals.css`
- Tailwind config: `tailwind.config.ts`

## When Suggesting Code

1. Always include TypeScript types
2. Use proper error handling
3. Follow the existing code style
4. Include comments for complex logic
5. Consider security implications
6. Think about performance
7. Use appropriate Tailwind classes from the design system

## Colors and Styling

Primary color: `#A855F7` (purple)
Use Tailwind classes: `bg-primary`, `text-primary`, `border-primary`

Dark backgrounds: `bg-dark-bg`, `bg-dark-surface`

## Notes

- This is a production-ready application
- Security is important - validate everything
- Database queries should be optimized
- API routes should be RESTful
- Frontend should follow React best practices
- Always test functionality before completing
