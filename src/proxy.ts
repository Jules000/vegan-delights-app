import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: any) {
  const { pathname } = request.nextUrl;

  // 1. Critical Fix for Next.js 16: Bypass proxy for Server Actions
  if (request.headers.get("next-action") || request.headers.get("x-nextjs-action")) {
    return NextResponse.next();
  }

  // Set custom header to allow Server Components to see the current path
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 2. Security Layer: Protect /admin routes
  const segments = pathname.split('/');
  const locale = ['fr', 'en'].includes(segments[1]) ? segments[1] : 'fr';

  const isVerifyPage = pathname.match(/^\/(?:fr|en)?\/admin\/verify/);
  const isAdminRoute = (pathname.match(/^\/(?:fr|en)?\/admin/) || pathname.startsWith('/admin')) && !isVerifyPage;

  if (isAdminRoute) {
    const session = request.cookies.get('session')?.value;
    const payload = session ? await decrypt(session) : null;

    // Check if user is logged in AND is an admin
    if (!payload || (payload as any).role !== 'ADMIN') {
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Require MFA verification
    if (!(payload as any).mfaVerified) {
      const locale = segments[1] && ['fr', 'en'].includes(segments[1]) ? segments[1] : 'fr';
      const verifyUrl = new URL(`/${locale}/admin/verify`, request.url);
      verifyUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(verifyUrl);
    }
  }

  // 3. Delegation to Localization
  const response = intlMiddleware(request);

  // Pass our custom headers into the response so layout.tsx can see them
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  // Match internationalized pathnames and the root admin path
  matcher: ['/', '/(fr|en)/:path*', '/admin', '/admin/:path*']
};
