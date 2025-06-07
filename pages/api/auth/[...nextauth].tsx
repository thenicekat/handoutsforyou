import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      return user.email !== null && user.email !== undefined
    },
    async session({ session }: { session: any }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string
}
export default NextAuth(authOptions)

