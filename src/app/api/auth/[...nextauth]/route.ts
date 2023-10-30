import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import db from "../../../../../drizzle/db";
import { users } from "../../../../../drizzle/schema";


const handler = NextAuth({
  callbacks:{
    async signIn({ user, account, profile, email, credentials }) {     
      return true
    },
  },
  adapter: DrizzleAdapter(db),
   secret: "dskjgfndsgksjdbn9s8dfhnkj",
    providers: [
        Google({
          clientId: "941869449468-fg0idtb5u80n8me39u864c9uuhulcbgf.apps.googleusercontent.com",
          clientSecret: "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"
        })
      ]
})

export { handler as GET, handler as POST }