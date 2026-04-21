import { PrismaClient } from '../generated/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function promoteToAdmin(email: string) {
  try {
    const user = await prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Erreur : Utilisateur avec l'email "${email}" introuvable.`);
      process.exit(1);
    }

    if (!user.isVerified) {
        console.warn(`⚠️ Attention : L'utilisateur "${email}" n'est pas encore vérifié par OTP. Il devra peut-être se connecter et valider son OTP d'abord.`);
    }

    await prisma.customer.update({
      where: { email },
      data: { role: 'ADMIN' as any }, // Using 'as any' if types aren't fully refreshed in the script environment
    });

    console.log(`✅ Succès : L'utilisateur "${email}" a été promu au rôle Administrateur.`);
  } catch (error) {
    console.error('❌ Une erreur critique est survenue :', error);
  } finally {
    await prisma.$disconnect();
  }
}

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.log('Utilisation : npx tsx src/scripts/promote-admin.ts <email>');
  process.exit(1);
}

promoteToAdmin(targetEmail);
