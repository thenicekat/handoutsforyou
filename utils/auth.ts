import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const EMAIL_REGEX =
    /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/

export async function getAuthenticatedUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session || !session.user) {
            return {
                email: null,
                name: null,
            }
        }

        const { email, name } = session.user

        if (!email || !EMAIL_REGEX.test(email)) {
            return {
                email: null,
                name: null,
            }
        }

        return {
            email: email,
            name: name || null,
        }
    } catch (error) {
        return {
            email: null,
            name: null,
        }
    }
}

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
    const user = await getAuthenticatedUser(req, res)

    if (!user.email) {
        res.status(401).json({
            message: 'Unauthorized',
            error: true,
        })
        return null
    }

    return user
}
