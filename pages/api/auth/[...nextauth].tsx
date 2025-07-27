import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export type BaseResponseData = {
    message: string
    error: boolean
    data?: any
}

const EMAIL_REGEX =
    /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/

export async function getUser(
    request: NextApiRequest,
    response: NextApiResponse
) {
    try {
        const session = await getServerSession(request, response, authOptions)
        if (!session) {
            response.status(401).json({
                message: 'Unauthorized.',
                data: [],
                error: true,
            })
            return
        }
        if (!EMAIL_REGEX.test(session.user?.email ?? '')) {
            response.status(403).json({
                message: 'Forbidden.',
                data: [],
                error: true,
            })
            return
        }
        return {
            email: session.user?.email,
            name: session.user?.name,
        }
    } catch (error) {
        response.status(500).json({
            message: 'Error occured: ' + (error as Error).message,
            data: [],
            error: true,
        })
        return
    }
}

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    pages: { error: '/error' },
    secret: process.env.NEXTAUTH_SECRET!,
}
export default NextAuth(authOptions)
