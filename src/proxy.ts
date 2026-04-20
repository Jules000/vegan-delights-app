import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: any) {
  // Fix for Next.js 16: Bypass proxy for Server Actions to avoid "Failed to fetch" errors.
  // This ensures that the custom proxy logic doesn't interfere with POST requests handled by Next.js actions.
  if (request.headers.get("next-action") || request.headers.get("x-nextjs-action")) {
    return NextResponse.next();
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en)/:path*']
};
