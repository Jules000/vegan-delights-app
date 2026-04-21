"use server";


import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

import { sendOtpEmail } from "@/lib/email";

export async function registerUser(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = formData.get("locale") as string || "fr";

  if (!email || !password || !firstName || !lastName) {
    return { error: "Tous les champs sont obligatoires." };
  }

  // Check if user exists
  const existingUser = await prisma.customer.findUnique({ where: { email } });

  if (existingUser && existingUser.password) {
    return { error: "Un compte avec cette adresse email existe déjà." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (existingUser && !existingUser.password) {
    // If user exists as a guest without password, update them
    await prisma.customer.update({
      where: { email },
      data: {
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        otp,
        otpExpires,
        isVerified: false
      }
    });
  } else {
    // Create new user
    await prisma.customer.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        otp,
        otpExpires,
        isVerified: false
      },
    });
  }

  // Send OTP Email
  await sendOtpEmail(email, `${firstName} ${lastName}`, otp, locale);

  return { success: true, email, showOtp: true };
}

export async function verifyOtp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const locale = formData.get("locale") as string || "fr";
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

  // Mark as verified and clear OTP
  const updatedUser = await prisma.customer.update({
    where: { email },
    data: {
      isVerified: true,
      otp: null,
      otpExpires: null
    }
  });

  await setSession(updatedUser.id, updatedUser.email, updatedUser.name);

  if (cleanPath.startsWith("/admin")) {
    redirect(cleanPath);
  } else {
    redirect(`/${locale}${cleanPath}`);
  }
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

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const user = await prisma.customer.findUnique({ where: { email } });
  if (!user || !user.password) {
    return { error: "Identifiants incorrects." };
  }

  if (!user.isVerified) {
    // If not verified, trigger a new OTP and return a state that allows UI to handle verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    const locale = formData.get("locale") as string || "fr";
    
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

  const locale = formData.get("locale") as string || "fr";
  const rawCallbackUrl = formData.get("callbackUrl") as string;
  const cleanPath = (rawCallbackUrl && rawCallbackUrl !== 'undefined' && rawCallbackUrl.startsWith('/')) ? rawCallbackUrl : "/";
  
  await setSession(user.id, user.email, user.name);

  if (cleanPath.startsWith("/admin")) {
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

async function setSession(id: string, email: string, name: string) {
  const cookieStore = await cookies();
  const session = await encrypt({ id, email, name });
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
