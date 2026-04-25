import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Unauthorized access", { status: 403 });
}
