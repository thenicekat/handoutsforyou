import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { RANT_POSTS } from '../constants'
import { validateAPISession, BaseResponseData } from '@/pages/api/auth/session'

interface ResponseData extends BaseResponseData {
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res)
    if (!session) return

    const { rant, isPublic } = req.body

    if (!rant) {
        res.status(422).json({
            message: 'Invalid Request - Rant missing',
            error: true,
        })
        return
    }

    const { error } = await supabase
        .from(RANT_POSTS)
        .insert([
            {
                rant,
                created_by: session.user.email,
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
