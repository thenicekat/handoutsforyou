import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export type BaseResponseData = {
    message: string
    error: boolean
}

export async function getUser(
    request: NextApiRequest,
    response: NextApiResponse
) {
    try {
        const session = await getServerSession(request, response, authOptions)
        if (!session) {
            throw new Error('No session found')
        }
        return {
            email: session.user?.email,
            name: session.user?.name,
        }
    } catch (error) {
        throw new Error('Error occured: ' + error)
    }
}

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
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET as string,
}
export default NextAuth(authOptions)
