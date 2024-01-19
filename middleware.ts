export { auth as middleware } from './lib/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api (API routes)
     * - /_next/static (static files)
     * - /favicon.ico (favicon)
     * - _next/image (image optimization)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
