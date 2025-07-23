import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './[...nextauth]'

export type BaseResponseData = {
    message: string
    error: boolean
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
