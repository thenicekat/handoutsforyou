import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'
import { EMAIL_HEADER, NAME_HEADER } from '../constants'

export type BaseResponseData = {
    message: string
    error: boolean
}

export function processHeaders(req: NextApiRequest) {
    const email = Buffer.from(req.headers[EMAIL_HEADER] as string, 'base64').toString('utf-8')
    const name = Buffer.from(req.headers[NAME_HEADER] as string, 'base64').toString('utf-8')
    return { email, name }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        return res.status(401).json({
            message: 'Unauthorized',
            error: true,
        })
    }

    return res.status(200).json({
        message: 'Authenticated',
        error: false,
    })
}
