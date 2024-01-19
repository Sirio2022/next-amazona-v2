import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';
import UserModel from './models/UserModel';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth/next';

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        await dbConnect();

        if (credentials === null) return null;

        const user = await UserModel.findOne({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (user) {
          const isMatch = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );
          if (isMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/signup',
    error: '/signin',
  },
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping\//,
        /\/payment\//,
        /\/placeorder\//,
        /\/profile\//,
        /\/order\/.*\//,
        /\/admin\//,
      ];
      const { pathname } = request.nextUrl;
      if (protectedPaths.some((regex) => regex.test(pathname))) return !!auth;
      return true;
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
