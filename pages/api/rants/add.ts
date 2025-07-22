import { BaseResponseData, processHeaders } from '@/pages/api/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { RANT_POSTS } from '../constants'
import { supabase } from '../supabase'

interface ResponseData extends BaseResponseData {
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { rant, isPublic } = req.body
    const { email } = processHeaders(req)

    if (!rant) {
        res.status(422).json({
            message: 'Invalid Request - Rant missing',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(RANT_POSTS).insert([
        {
            rant,
            created_by: email,
            created_at: Date.now(),
            public: isPublic ? 1 : 0,
        },
    ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    } else {
        res.status(200).json({
            message: 'success',
            error: false,
        })
        return
    }
}
