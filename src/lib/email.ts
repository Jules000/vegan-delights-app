import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

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

export async function sendInvoiceEmail(invoiceId: string, locale: string) {
  const isEn = locale === 'en';
  
  // Fetch detailed invoice data
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      customer: true,
      order: {
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!invoice) {
    console.error(`Invoice ${invoiceId} not found for email delivery.`);
    return;
  }

  const subject = isEn 
    ? `Your Invoice from Vegan Delights - ${invoice.invoiceNumber}` 
    : `Votre facture Vegan Delights - ${invoice.invoiceNumber}`;

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
                font-size: 24px; 
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .content { 
                padding: 40px; 
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                background-color: rgba(19, 236, 19, 0.1);
                color: #0d1b0d;
                font-weight: bold;
                font-size: 12px;
                border-radius: 99px;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .invoice-details {
                margin-bottom: 30px;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
            }
            .invoice-details h2 {
                font-size: 32px;
                margin: 0;
                color: #0d1b0d;
            }
            .invoice-details p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 30px 0;
            }
            .items-table th {
                text-align: left;
                font-size: 12px;
                text-transform: uppercase;
                color: #999;
                padding-bottom: 10px;
                border-bottom: 2px solid #f9f9f9;
            }
            .items-table td {
                padding: 15px 0;
                border-bottom: 1px solid #f9f9f9;
                font-size: 15px;
            }
            .total-section {
                background-color: #fdfaf6;
                padding: 30px;
                border-radius: 16px;
                margin-top: 20px;
            }
            .footer { 
                background-color: #f9f9f9; 
                padding: 30px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
            }
            .btn {
                display: inline-block;
                padding: 15px 30px;
                background-color: #13ec13;
                color: #0d1b0d;
                text-decoration: none;
                font-weight: bold;
                border-radius: 99px;
                margin-top: 30px;
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
                <div class="status-badge">${isEn ? 'Payment Confirmed' : 'Paiement Confirmé'}</div>
                <div class="invoice-details">
                    <p>${isEn ? 'Invoice Number' : 'Numéro de Facture'}</p>
                    <h2>${invoice.invoiceNumber}</h2>
                    <p>${isEn ? 'Issued on' : 'Émise le'} ${new Date(invoice.issuedAt).toLocaleDateString()}</p>
                </div>

                <p>${isEn ? `Hello ${invoice.customer.name},` : `Bonjour ${invoice.customer.name},`}</p>
                <p>${isEn 
                    ? "Thank you for your trust. Your order was successfully processed. You'll find the details of your delicious selection below." 
                    : "Merci de votre confiance. Votre commande a été traitée avec succès. Vous trouverez le détail de votre délicieuse sélection ci-dessous."}</p>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>${isEn ? 'Item' : 'Article'}</th>
                            <th style="text-align: center;">${isEn ? 'Qty' : 'Qté'}</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.order.items.map(item => `
                            <tr>
                                <td>${isEn ? item.product.nameEn : item.product.nameFr}</td>
                                <td style="text-align: center;">${item.quantity}</td>
                                <td style="text-align: right;">${(item.priceAtPurchase * item.quantity).toLocaleString()} FCFA</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-section">
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding-bottom: 10px; color: #666;">Sous-total</td>
                            <td style="text-align: right; font-weight: bold;">${(invoice.order.total - invoice.order.deliveryFee).toLocaleString()} FCFA</td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 10px; color: #666;">${isEn ? 'Delivery' : 'Livraison'}</td>
                            <td style="text-align: right; font-weight: bold;">${invoice.order.deliveryFee === 0 ? (isEn ? 'FREE' : 'GRATUITE') : `${invoice.order.deliveryFee.toLocaleString()} FCFA`}</td>
                        </tr>
                        <tr style="font-size: 20px; color: #b25a38;">
                            <td style="padding-top: 15px; font-weight: 900; border-top: 2px solid #eee;">TOTAL</td>
                            <td style="padding-top: 15px; text-align: right; font-weight: 900; border-top: 2px solid #eee;">${invoice.order.total.toLocaleString()} FCFA</td>
                        </tr>
                    </table>
                </div>

                <div style="text-align: center;">
                    <a href="https://vegandelights.store/${locale}/invoice/${invoice.id}" class="btn">
                        ${isEn ? 'View Full Invoice' : 'Voir la facture complète'}
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Vegan Delights Boutique & Restaurant.</p>
                <p>123 Rue de la Nature, Douala | +237 600 000 000</p>
                <p>${isEn 
                    ? "Sustainable, ethical, and strictly delicious." 
                    : "Durable, éthique, et strictement délicieux."}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Vegan Delights Billing" <${SENDER_EMAILS.billing}>`,
      to: invoice.customer.email,
      subject,
      html,
    });
    console.log(`Invoice Email sent for ${invoice.invoiceNumber} to ${invoice.customer.email}`);
  } catch (error) {
    console.error('Failed to send invoice email:', error);
  }
}
