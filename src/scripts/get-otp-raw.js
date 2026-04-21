const { Client } = require('pg');
require('dotenv').config();

async function getOtp(email) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT otp, name, phone FROM "Customer" WHERE email = $1', [email]);

    if (res.rows.length === 0) {
      console.log(`User ${email} not found.`);
      return;
    }

    const user = res.rows[0];
    console.log(`--- OTP DATA FOR ${email} ---`);
    console.log(`Nom: ${user.name}`);
    console.log(`Tel: ${user.phone}`);
    console.log(`CODE OTP: ${user.otp}`);
    console.log(`-------------------------------`);
  } catch (err) {
    console.error('Error fetching OTP:', err);
  } finally {
    await client.end();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node src/scripts/get-otp-raw.js <email>');
} else {
  getOtp(email);
}
