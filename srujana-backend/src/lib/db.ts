// Prisma singleton.
//
// Why the globalThis hack: in `next dev`, hot module replacement can
// re-execute this file dozens of times a session. A fresh `new PrismaClient()`
// on each run silently opens a new pool, and after ~50 hot reloads Postgres
// starts refusing connections. Attaching to globalThis in non-prod keeps the
// same client across reloads.
//
// Import via `import { prisma } from '@/lib/db'` from any server code.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
