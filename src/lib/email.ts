import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper for other parts of the app to send emails from different addresses
export const SENDER_EMAILS = {
  verify: 'verify@vegandelights.store',
  support: 'support@vegandelights.store',
  hello: 'hello@vegandelights.store',
  orders: 'orders@vegandelights.store',
  billing: 'billing@vegandelights.store',
};

export async function sendOtpEmail(email: string, name: string, otp: string, locale: string) {
  const isEn = locale === 'en';
  
  const subject = isEn 
    ? "Vegan Delights - Your Verification Code" 
    : "Vegan Delights - Votre Code de Vérification";

  const title = isEn ? "Verify Your Account" : "Validez votre compte";
  const salutation = isEn ? `Hello ${name},` : `Bonjour ${name},`;
  const message = isEn 
    ? "Thank you for joining Vegan Delights. Use the code below to complete your registration." 
    : "Merci d'avoir rejoint Vegan Delights. Utilisez le code ci-dessous pour finaliser votre inscription.";
  const expiryNotice = isEn 
    ? "This code will expire in 15 minutes." 
    : "Ce code expirera dans 15 minutes.";
  const footerText = isEn 
    ? "If you didn't request this email, please ignore it." 
    : "Si vous n'avez pas demandé cet e-mail, veuillez l'ignorer.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                line-height: 1.6; 
                color: #0d1b0d; 
                margin: 0; 
                padding: 0; 
                background-color: #fdfaf6;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: #ffffff; 
                border-radius: 24px; 
                overflow: hidden; 
                box-shadow: 0 10px 30px rgba(13, 27, 13, 0.05);
            }
            .header { 
                background-color: #0d1b0d; 
                padding: 40px; 
                text-align: center; 
            }
            .logo-icon {
                display: inline-block;
                width: 48px;
                height: 48px;
                background-color: #13ec13;
                border-radius: 12px;
                color: #0d1b0d;
                font-size: 32px;
                line-height: 48px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .header h1 { 
                color: #ffffff; 
                margin: 0; 
                font-size: 28px; 
                letter-spacing: -0.02em;
                font-weight: 900;
            }
            .content { 
                padding: 40px; 
                text-align: center;
            }
            .salutation {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #0d1b0d;
            }
            .otp-container { 
                background-color: #fdfaf6; 
                border: 2px dashed #13ec13; 
                padding: 30px; 
                margin: 30px 0; 
                border-radius: 16px;
            }
            .otp-code { 
                font-size: 48px; 
                font-weight: 900; 
                letter-spacing: 12px; 
                color: #0d1b0d; 
                margin: 0;
            }
            .expiry { 
                color: #b25a38; 
                font-weight: bold; 
                font-size: 14px; 
                margin-top: 10px;
            }
            .footer { 
                background-color: #f9f9f9; 
                padding: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">🍀</div>
                <h1>Vegan Delights</h1>
            </div>
            <div class="content">
                <div class="salutation">${salutation}</div>
                <p>${message}</p>
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <div class="expiry">${expiryNotice}</div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Vegan Delights Boutique & Restaurant.</p>
                <p>${footerText}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Vegan Delights" <${SENDER_EMAILS.verify}>`,
      to: email,
      subject,
      html,
    });
    console.log(`OTP Email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    // In production you might want to throw error, but for dev we'll log it
    // throw error;
  }
}
