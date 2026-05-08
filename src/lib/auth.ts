import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { staffAccounts, departments, positions } from "@/db/schema";
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

          let departmentName: string | null = null;
          let departmentSlug: string | null = null;
          let positionName: string | null = null;

          if (user.departmentId) {
            const depts = await db
              .select()
              .from(departments)
              .where(eq(departments.id, user.departmentId))
              .limit(1);
            const dept = depts[0];
            if (dept) {
              departmentName = dept.name;
              departmentSlug = dept.slug;
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
            departmentId: user.departmentId,
            departmentName,
            departmentSlug,
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
        token.departmentId = user.departmentId;
        token.departmentName = user.departmentName;
        token.departmentSlug = user.departmentSlug;
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
        session.user.departmentId = token.departmentId as number | null;
        session.user.departmentName = token.departmentName as string | null;
        session.user.departmentSlug = token.departmentSlug as string | null;
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
