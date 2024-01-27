import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      if (protectedPaths.some((path) => path.test(pathname))) return !!auth;

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);

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
