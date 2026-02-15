import { getUser } from '@/pages/api/auth/[...nextauth]'
import { BaseResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CONFESSION_REPLIES } from '../constants'
import { supabase } from '../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { confessionId, content } = req.body

    if (!confessionId) {
        res.status(422).json({
            message: 'Confession ID is required',
            error: true,
        })
        return
    }

    if (!content || content.trim() === '') {
        res.status(422).json({
            message: 'Reply content is required',
            error: true,
        })
        return
    }

    if (content.length > 1000) {
        res.status(422).json({
            message: 'Reply must be under 1000 characters',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(CONFESSION_REPLIES).insert([
        {
            confession_id: confessionId,
            content: content.trim(),
            email: email,
        },
    ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    }

    res.status(200).json({
        message: 'Reply added successfully',
        error: false,
    })
}
