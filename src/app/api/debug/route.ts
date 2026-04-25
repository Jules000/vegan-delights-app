import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Try a simple query to check database connection
    const productCount = await prisma.product.count();
    return NextResponse.json({
      status: "success",
      message: "Database connection is working!",
      data: { productCount },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DATABASE_URL: !!process.env.DATABASE_URL,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : "none"
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: error.message || String(error),
      stack: error.stack,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DATABASE_URL: !!process.env.DATABASE_URL,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : "none"
      }
    }, { status: 500 });
  }
}
