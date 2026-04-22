import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
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
