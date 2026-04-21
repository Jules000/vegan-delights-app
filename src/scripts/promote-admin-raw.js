const { Client } = require('pg');
require('dotenv').config();

async function promoteToAdmin(email) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // Check if user exists first
    const checkRes = await client.query('SELECT id FROM "Customer" WHERE email = $1', [email]);
    if (checkRes.rows.length === 0) {
      console.error(`❌ Erreur : Utilisateur avec l'email "${email}" introuvable.`);
      return;
    }

    // Role is an enum in the DB if we pushed it correctly, usually mapped as String if not cast.
    // In our schema it's UserRole @default(CUSTOMER)
    await client.query('UPDATE "Customer" SET role = $1 WHERE email = $2', ['ADMIN', email]);

    console.log(`✅ Succès : L'utilisateur "${email}" a été promu au rôle Administrateur.`);
  } catch (err) {
    console.error('❌ Une erreur est survenue lors de la promotion :', err);
  } finally {
    await client.end();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Utilisation : node src/scripts/promote-admin-raw.js <email>');
} else {
  promoteToAdmin(email);
}
