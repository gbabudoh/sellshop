import { NextAuthOptions, User as NextAuthUser, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials");
            throw new Error("Invalid credentials");
          }

          console.log("Attempting login with email:", credentials.email);

          // Check user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error("User not found:", credentials.email);
            throw new Error("Invalid credentials");
          }

          if (!user.hashedPassword) {
            console.error("User has no password hash");
            throw new Error("Invalid credentials");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email);
            throw new Error("Invalid credentials");
          }

          console.log("Login successful for user:", credentials.email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          } as NextAuthUser & { role: string };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser & { role?: string } }) {
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Token before:", token);
      if (user) {
        token.id = user.id;
        (token as { role?: string }).role = user.role;
        console.log("JWT Callback - Token after:", token);
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session before:", session);
      if (session?.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = (token as { role?: string }).role as string;
        console.log("Session Callback - Session after:", session);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
