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
          clientId: "1055541956168-np0vmf640m77cchibdhjp06olm0502s8.apps.googleusercontent.com",
          clientSecret: "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"
        })
      ]
})

export { handler as GET, handler as POST }