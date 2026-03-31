import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { instructors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Jelszo", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const [instructor] = await db
          .select()
          .from(instructors)
          .where(eq(instructors.email, email))
          .limit(1);

        if (!instructor || !instructor.passwordHash) return null;
        if (!instructor.isActive) return null;

        const valid = await compare(password, instructor.passwordHash);
        if (!valid) return null;

        return {
          id: instructor.id,
          email: instructor.email,
          name: instructor.name,
        };
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
    async jwt({ token, user }) {
      if (user) {
        token.instructorId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.instructorId) {
        session.user.id = token.instructorId as string;
      }
      return session;
    },
  },
});
