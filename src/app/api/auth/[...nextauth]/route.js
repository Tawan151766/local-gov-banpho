import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user object (without password)
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            level: user.level,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        try {
          // Check if user exists in database
          let user = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          // If user doesn't exist, create with default level 0 (regular user)
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: profile.name,
                email: profile.email,
                password: "", // Empty password for Google users
                level: "0", // Default level for Google users
                email_verified_at: new Date(),
              },
            });
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            level: user.level,
          };
        } catch (error) {
          console.error("Google profile error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
      }

      // For Google sign-in, ensure we have the latest user data
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });
          if (dbUser) {
            token.level = dbUser.level;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.level = token.level;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
