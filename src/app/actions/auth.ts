"use server";


import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

export async function registerUser(prevState: any, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Tous les champs sont obligatoires." };
  }

  // Check if user exists
  const existingUser = await prisma.customer.findUnique({ where: { email } });

  if (existingUser) {
    // If user exists as a guest without password, update them
    if (!existingUser.password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.customer.update({
        where: { email },
        data: {
          password: hashedPassword,
          name: `${firstName} ${lastName}`
        }
      });
      const locale = formData.get("locale") as string || "fr";
      const rawCallbackUrl = formData.get("callbackUrl") as string;
      const cleanPath = (rawCallbackUrl && rawCallbackUrl !== 'undefined' && rawCallbackUrl.startsWith('/')) ? rawCallbackUrl : "/";
      
      await setSession(user.id, user.email, user.name);

      if (cleanPath.startsWith("/admin")) {
        redirect(cleanPath);
      } else {
        redirect(`/${locale}${cleanPath}`);
      }
    } else {
      return { error: "Un compte avec cette adresse email existe déjà." };
    }
  }

  // Create new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.customer.create({
    data: {
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    },
  });

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
