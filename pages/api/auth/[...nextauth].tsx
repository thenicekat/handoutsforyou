import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const EMAIL_REGEX =
    /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }: { user: any }) {
            if (!EMAIL_REGEX.test(user.email ?? '')) return '/error?error=UnauthorizedEmail'
            return true
        },
        async session({ session }: { session: any }) {
            return session
        },
    },
    pages: { error: '/error' },
    secret: process.env.NEXTAUTH_SECRET!,
}
export default NextAuth(authOptions)