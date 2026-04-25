import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (connectionString?.startsWith("prisma://")) {
    return new PrismaClient({ accelerateUrl: connectionString });
  }

  const pool = new Pool({
    connectionString,
    // Provide SSL config when deployed to production to avoid connection rejections from managed DBs
    ssl: process.env.NODE_ENV === "production" && !connectionString?.includes("localhost") 
      ? { rejectUnauthorized: false } 
      : undefined
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal_v4: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy initialization pattern using a Proxy
// This ensures that 'new PrismaClient()' is only called when a property is first accessed,
// preventing crashes during the Next.js build module collection phase.
let _instance: PrismaClient | null = null;

const getInternalInstance = (): any => {
  if (!_instance) {
    _instance = globalThis.prismaGlobal_v4 ?? prismaClientSingleton();
    if (process.env.NODE_ENV !== 'production') {
      globalThis.prismaGlobal_v4 = _instance;
    }
  }
  return _instance;
};

const prisma = new Proxy({} as any, {
  get(target, prop) {
    const instance = getInternalInstance();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export default prisma as PrismaClient;
