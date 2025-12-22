import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export type BaseResponseData = {
    message: string
    error: boolean
    data?: any
}

export type AuthorizedUser = {
    email: string
    name: string | null | undefined
}

const ALUMNI_DOMAIN = '@alumni.bits-pilani.ac.in'
const EMAIL_REGEX =
    /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in|\d{4}.*@online\.bits-pilani\.ac\.in)$/

const convertAlumniEmailToNormal = (alumniEmail: string) => {
    let userName = alumniEmail.split('@')[0]
    let lastChar = userName[userName.length - 1]
    let campus: string
    switch (lastChar) {
        case 'h':
            campus = 'hyderabad'
            break
        case 'p':
            campus = 'pilani'
            break
        case 'g':
            campus = 'goa'
            break
        case 'd':
            campus = 'dubai'
            break
        default:
            return alumniEmail
    }
    return userName.slice(0, -1) + '@' + campus + '.bits-pilani.ac.in'
}

export async function getUser(
    request: NextApiRequest,
    response: NextApiResponse
): Promise<AuthorizedUser> {
    try {
        const session = await getServerSession(request, response, authOptions)
        if (!session) {
            response.status(401).json({
                message: 'Unauthorized.',
                data: [],
                error: true,
            })
            return response.end() as never
        }
        if (!EMAIL_REGEX.test(session.user?.email ?? '')) {
            response.status(403).json({
                message: 'Forbidden.',
                data: [],
                error: true,
            })
            return response.end() as never
        }
        let email = session.user?.email!
        if (email && email.includes(ALUMNI_DOMAIN)) {
            email = convertAlumniEmailToNormal(email)
        }
        return {
            email: email,
            name: session.user?.name,
        }
    } catch (error) {
        response.status(500).json({
            message: 'Error occured: ' + (error as Error).message,
            data: [],
            error: true,
        })
        return response.end() as never
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
