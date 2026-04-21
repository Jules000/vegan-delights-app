import { PrismaClient } from '../generated/client';
import "dotenv/config";

async function getOtp(email: string) {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.customer.findUnique({
      where: { email },
      select: { otp: true, name: true, phone: true }
    });

    if (!user) {
      console.log(`User ${email} not found.`);
      return;
    }

    console.log(`--- OTP DATA FOR ${email} ---`);
    console.log(`Nom: ${user.name}`);
    console.log(`Tel: ${user.phone}`);
    console.log(`CODE OTP: ${user.otp}`);
    console.log(`-------------------------------`);
  } catch (error) {
    console.error('Error fetching OTP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: npx tsx src/scripts/get-otp.ts <email>');
} else {
  getOtp(email);
}
