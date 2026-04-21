import { PrismaClient } from '@prisma/client'; // Refresh client types v7.7.0
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = global.prisma_v2 || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma_v2 = prisma;

export default prisma;
