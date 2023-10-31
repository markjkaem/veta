import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import db from "../../../../../drizzle/db";


const handler = NextAuth({
  session: { strategy: 'jwt' },
  callbacks:{
    async signIn({ user, account, profile, email, credentials }) {     
      return true
    },
  },
  pages: {
    signIn: "/sign-in"
  },
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Google({
          clientId: "941869449468-fg0idtb5u80n8me39u864c9uuhulcbgf.apps.googleusercontent.com",
          clientSecret: "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"
        })
      ]
})

export { handler as GET, handler as POST }