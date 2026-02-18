import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export function resolveDbUrl() {
  return process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function hasDbUrl() {
  return Boolean(resolveDbUrl());
}

const resolvedDbUrl = resolveDbUrl();
if (!process.env.DATABASE_URL && resolvedDbUrl) {
  process.env.DATABASE_URL = resolvedDbUrl;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export function getPrisma() {
  if (!hasDbUrl()) {
    throw new Error('DATABASE_URL is not configured. Set DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL.');
  }
  return prisma;
}
