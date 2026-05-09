import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { staffAccounts, sasoUnits, positions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
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

          let unitName: string | null = null;
          let unitSlug: string | null = null;
          let positionName: string | null = null;

          if (user.unitId) {
            const units = await db
              .select()
              .from(sasoUnits)
              .where(eq(sasoUnits.id, user.unitId))
              .limit(1);
            const unit = units[0];
            if (unit) {
              unitName = unit.name;
              unitSlug = unit.slug;
            }
          }

          if (user.positionId) {
            const pos = await db
              .select()
              .from(positions)
              .where(eq(positions.id, user.positionId))
              .limit(1);
            positionName = pos[0]?.name ?? null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            unitId: user.unitId,
            unitName,
            unitSlug,
            positionId: user.positionId,
            positionName,
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
        token.avatarUrl = user.avatarUrl;
        token.unitId = user.unitId;
        token.unitName = user.unitName;
        token.unitSlug = user.unitSlug;
        token.positionId = user.positionId;
        token.positionName = user.positionName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatarUrl = token.avatarUrl as string | null;
        session.user.unitId = token.unitId as number | null;
        session.user.unitName = token.unitName as string | null;
        session.user.unitSlug = token.unitSlug as string | null;
        session.user.positionId = token.positionId as number | null;
        session.user.positionName = token.positionName as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
