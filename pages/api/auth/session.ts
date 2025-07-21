import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'

export type BaseResponseData = {
    message: string
    error: boolean
}

const EMAIL_REGEX = /^(?:[fh]\d{8}@(hyderabad|pilani|goa|dubai)\.bits-pilani\.ac\.in|[fh]\d{8}[pghd]@alumni\.bits-pilani\.ac\.in)$/

export async function validateAPISession<T extends BaseResponseData>(
    req: NextApiRequest,
    res: NextApiResponse<T>
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user?.email) {
        return res.redirect(401, '/error?error=Unauthorized')
    }

    if (session.user.email && !EMAIL_REGEX.test(session.user.email)) {
        return res.redirect(403, '/error?error=UnauthorizedEmail')
    }

    return session
}
