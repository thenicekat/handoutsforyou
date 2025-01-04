import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const EMAIL_REGEX = /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/;

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (user.email && EMAIL_REGEX.test(user.email)) {
        return true;
      } else {
        return false;
      }
    },
    async session({ session }: { session: any }) {
      if (session) {
        if (EMAIL_REGEX.test(session?.user?.email)) {
          return session;
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string
}
export default NextAuth(authOptions)

