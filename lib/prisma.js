import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export function resolveDbUrl() {
  return process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function hasDbUrl() {
  return Boolean(resolveDbUrl());
}

export function getPrisma() {
  const dbUrl = resolveDbUrl();
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not configured. Set DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL.');
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  return globalForPrisma.prisma;
}
