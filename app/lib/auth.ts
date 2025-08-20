import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check for rate limiting
        const clientIp = req?.headers?.['x-forwarded-for'] as string || 
                        req?.headers?.['x-real-ip'] as string || 
                        '127.0.0.1';

        const loginAttempt = await prisma.loginAttempt.findUnique({
          where: { ip: clientIp }
        });

        // Check if IP is locked (5 failed attempts in 1 minute)
        if (loginAttempt?.lockedAt) {
          const lockDuration = 60 * 1000; // 1 minute in milliseconds
          const isStillLocked = new Date().getTime() - loginAttempt.lockedAt.getTime() < lockDuration;
          
          if (isStillLocked && loginAttempt.attempts >= 5) {
            throw new Error('Too many failed attempts. Please try again later.');
          } else if (!isStillLocked) {
            // Reset attempts if lock period has passed
            await prisma.loginAttempt.update({
              where: { ip: clientIp },
              data: { attempts: 0, lockedAt: null }
            });
          }
        }

        try {
          // Check environment variables first (fallback)
          const envUsername = process.env.ADMIN_USERNAME;
          const envPassword = process.env.ADMIN_PASSWORD;

          if (credentials.username === envUsername && credentials.password === envPassword) {
            // Reset login attempts on successful login
            await prisma.loginAttempt.deleteMany({
              where: { ip: clientIp }
            });

            return {
              id: '1',
              username: credentials.username,
              email: 'admin@space458.com'
            };
          }

          // Check database for admin users
          const adminUser = await prisma.adminUser.findUnique({
            where: { username: credentials.username }
          });

          if (adminUser && await bcrypt.compare(credentials.password, adminUser.password)) {
            // Reset login attempts on successful login
            await prisma.loginAttempt.deleteMany({
              where: { ip: clientIp }
            });

            return {
              id: adminUser.id.toString(),
              username: adminUser.username,
              email: 'admin@space458.com'
            };
          }

          // Failed login - increment attempts
          if (loginAttempt) {
            const newAttempts = loginAttempt.attempts + 1;
            const shouldLock = newAttempts >= 5;

            await prisma.loginAttempt.update({
              where: { ip: clientIp },
              data: {
                attempts: newAttempts,
                lockedAt: shouldLock ? new Date() : null
              }
            });
          } else {
            await prisma.loginAttempt.create({
              data: {
                ip: clientIp,
                attempts: 1
              }
            });
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'username' in user) {
        token.username = user.username as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.username) {
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};