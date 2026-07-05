import { courses } from '@/config/courses'
import { BaseResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    return res.status(200).json({
        error: false,
        message: 'Courses fetched successfully',
        data: courses,
    })
}
