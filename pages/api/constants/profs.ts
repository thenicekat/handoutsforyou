import { profs } from '@/config/profs'
import { BaseResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    return res.status(200).json({
        error: false,
        message: 'Professors fetched successfully',
        data: profs.map(p => p.name),
    })
}
