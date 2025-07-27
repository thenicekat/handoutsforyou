import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    return res.status(200).json({
        error: false,
        message: 'User authenticated',
        data: null,
    })
}
