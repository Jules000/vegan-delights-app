"use server";

import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { sendOtpEmail, sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import crypto from 'crypto';

const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit avoir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "Numéro de téléphone invalide"
  }),
  password: z.string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const locale = formData.get("locale") as string || "fr";

  if (!email || !email.includes("@")) {
    return { error: locale === 'en' ? "Please enter a valid email." : "Veuillez entrer un email valide." };
  }

  const user = await prisma.customer.findUnique({ where: { email } });

  // Anti-enumeration: always return success
  if (!user || !user.password) {
    return { success: true };
  }

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await prisma.customer.update({
    where: { email },
    data: {
      resetToken: hashedToken,
      resetTokenExpires: expires
    }
  });

  await sendPasswordResetEmail(email, user.name, rawToken, locale);

  return { success: true };
}

export async function resetPassword(prevState: any, formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const locale = formData.get("locale") as string || "fr";

  if (!password || password.length < 8) {
    return { error: locale === 'en' ? "Password must be at least 8 characters." : "Le mot de passe doit faire au moins 8 caractères." };
  }

  if (password !== confirmPassword) {
    return { error: locale === 'en' ? "Passwords do not match." : "Les mots de passe ne correspondent pas." };
  }

  // Hash incoming token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.customer.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: { gt: new Date() }
    }
  });

  if (!user) {
    return { error: locale === 'en' ? "Invalid or expired token." : "Jeton invalide ou expiré." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.customer.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    }
  });

  return { success: true };
}

export async function registerUser(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const locale = formData.get("locale") as string || "fr";

  // Validate with Zod
  const validation = registerSchema.safeParse({ 
    firstName, 
    lastName, 
    email, 
    phone,
    password, 
    confirmPassword 
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const existingByEmail = await prisma.customer.findUnique({ where: { email } });
  if (existingByEmail && existingByEmail.password) {
    return { error: "Un compte avec cette adresse email existe déjà." };
  }

  const existingByPhone = await prisma.customer.findFirst({ where: { phone } });

  if (existingByPhone) {
    return { error: "Ce numéro de téléphone est déjà utilisé." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (existingByEmail && !existingByEmail.password) {
    await prisma.customer.update({
      where: { email },
      data: {
        password: hashedPassword,
        phone,
        name: `${firstName} ${lastName}`,
        otp,
        otpExpires,
        isVerified: false
      }
    });
  } else {
    await prisma.customer.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        otp,
        otpExpires,
        isVerified: false
      },
    });
  }

  await sendOtpEmail(email, `${firstName} ${lastName}`, otp, locale);

  return { success: true, email, showOtp: true };
}

export async function verifyOtp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const locale = localeInput(formData);
  const rawCallbackUrl = formData.get("callbackUrl") as string;
  const cleanPath = (rawCallbackUrl && rawCallbackUrl !== 'undefined' && rawCallbackUrl.startsWith('/')) ? rawCallbackUrl : "/";

  if (!email || !otp) {
    return { error: "Veuillez entrer le code de vérification." };
  }

  const user = await prisma.customer.findUnique({ where: { email } });

  if (!user || user.otp !== otp) {
    return { error: "Code de vérification incorrect." };
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    return { error: "Ce code a expiré. Veuillez en demander un nouveau." };
  }

  const updatedUser = await prisma.customer.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpires: null
    }
  });

  await setSession(updatedUser.id, updatedUser.email, updatedUser.name, updatedUser.role, false);

  if (cleanPath.startsWith("/admin") || cleanPath.startsWith("/fr") || cleanPath.startsWith("/en")) {
    redirect(cleanPath);
  } else {
    redirect(`/${locale}${cleanPath}`);
  }
}

function localeInput(formData: FormData) {
  return formData.get("locale") as string || "fr";
}

export async function resendOtp(email: string, locale: string) {
  const user = await prisma.customer.findUnique({ where: { email } });
  if (!user) return { error: "Utilisateur introuvable." };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.customer.update({
    where: { email },
    data: { otp, otpExpires }
  });

  await sendOtpEmail(email, user.name, otp, locale);
  return { success: true };
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = localeInput(formData);

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const user = await prisma.customer.findUnique({ where: { email } });
  if (!user || !user.password) {
    return { error: "Identifiants incorrects." };
  }

  if (!user.isVerified) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    
    await prisma.customer.update({
      where: { email },
      data: { otp, otpExpires }
    });
    
    await sendOtpEmail(email, user.name, otp, locale);
    
    return { error: "Veuillez vérifier votre compte. Un code a été envoyé.", showOtp: true, email };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "Identifiants incorrects." };
  }

  const rawCallbackUrl = formData.get("callbackUrl") as string;
  const cleanPath = (rawCallbackUrl && rawCallbackUrl !== 'undefined' && rawCallbackUrl.startsWith('/')) ? rawCallbackUrl : "/";
  
  await setSession(user.id, user.email, user.name, user.role, false);

  if (cleanPath.startsWith("/admin") || cleanPath.startsWith("/fr") || cleanPath.startsWith("/en")) {
    redirect(cleanPath);
  } else {
    redirect(`/${locale}${cleanPath}`);
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { 
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  redirect("/");
}

async function setSession(id: string, email: string, name: string, role: string, mfaVerified: boolean = false) {
  const cookieStore = await cookies();
  const session = await encrypt({ id, email, name, role, mfaVerified });
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function triggerAdminMfa() {
  const session = await getSession();
  if (!session || (session as any).role !== 'ADMIN') {
    return { error: "Accès refusé" };
  }

  const email = (session as any).email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.customer.update({
    where: { email },
    data: { otp, otpExpires }
  });

  await sendOtpEmail(email, (session as any).name, otp, "fr"); // Could detect locale from headers if needed
  return { success: true };
}

export async function verifyAdminMfa(prevState: any, formData: FormData) {
  const otp = formData.get("otp") as string;
  const session = await getSession();

  if (!session || (session as any).role !== 'ADMIN') {
    return { error: "Session invalide ou expirée." };
  }

  if (!otp) return { error: "Veuillez entrer le code." };

  const user = await prisma.customer.findUnique({
    where: { email: (session as any).email }
  });

  if (!user || user.otp !== otp) {
    return { error: "Code de vérification incorrect." };
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    return { error: "Ce code a expiré." };
  }

  // Success: Update DB and re-sign session
  await prisma.customer.update({
    where: { id: user.id },
    data: { otp: null, otpExpires: null }
  });

  await setSession(user.id, user.email, user.name, user.role, true);

  // Return success to trigger redirection on client
  return { success: true };
}
