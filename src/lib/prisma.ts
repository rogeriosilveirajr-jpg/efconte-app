import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getRequestContext } from '@cloudflare/next-on-pages';

const clients = new WeakMap<object, PrismaClient>();

function getPrismaClient(): PrismaClient {
  let env: any;
  try {
    env = getRequestContext().env;
  } catch (e) {
    // Fallback for Next.js build time or environments without Cloudflare context
    return new PrismaClient();
  }

  if (!env || !env.DB) {
    return new PrismaClient();
  }

  if (!clients.has(env.DB)) {
    const adapter = new PrismaD1(env.DB);
    clients.set(env.DB, new PrismaClient({ adapter }));
  }

  return clients.get(env.DB)!;
}

// Proxy the prisma calls so we don't have to refactor every single API file.
// Every time `prisma.user.findMany()` is called, it fetches the correct client for the current request context.
const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient() as any;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export default prisma;
