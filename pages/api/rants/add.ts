import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { RANT_POSTS } from '../constants'
import { supabase } from '../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { rant, isPublic } = req.body

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
