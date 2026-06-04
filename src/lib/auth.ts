import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { staffAccounts, sasoUnits, positions, verificationCodes } from "@/db/schema";
import { eq, and, desc, gt } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = await db
            .select()
            .from(staffAccounts)
            .where(eq(staffAccounts.email, credentials.email))
            .limit(1);

          const user = users[0];

          if (!user || !user.isActive) {
            return null;
          }

          const passwordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordValid) {
            return null;
          }

          if (credentials.otp) {
            const [record] = await db
              .select()
              .from(verificationCodes)
              .where(and(
                eq(verificationCodes.email, credentials.email),
                eq(verificationCodes.code, credentials.otp),
                eq(verificationCodes.used, false),
                gt(verificationCodes.expiresAt, new Date()),
              ))
              .orderBy(desc(verificationCodes.createdAt))
              .limit(1);
            if (!record) return null;
            await db.update(verificationCodes).set({ used: true }).where(eq(verificationCodes.id, record.id));
          }

          let unitName: string | null = null;
          let positionName: string | null = null;

          if (user.unitId) {
            const units = await db
              .select({ name: sasoUnits.name })
              .from(sasoUnits)
              .where(eq(sasoUnits.id, user.unitId))
              .limit(1);
            unitName = units[0]?.name ?? null;
          }

          if (user.positionId) {
            const pos = await db
              .select({ name: positions.name })
              .from(positions)
              .where(eq(positions.id, user.positionId))
              .limit(1);
            positionName = pos[0]?.name ?? null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
            unitId: user.unitId,
            unitName,
            positionId: user.positionId,
            positionName,
            permissions: (user.permissions ?? []) as string[],
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.unitId = user.unitId;
        token.positionId = user.positionId;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.unitId = token.unitId as number | null;
        session.user.positionId = token.positionId as number | null;
        session.user.permissions = token.permissions as string[] | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
