import { getUser } from '@/pages/api/auth/[...nextauth]'
import { BaseResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CONFESSIONS } from '../constants'
import { supabase } from '../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { content } = req.body

    if (!content || content.trim() === '') {
        res.status(422).json({
            message: 'Confession content is required',
            error: true,
        })
        return
    }

    if (content.length > 2000) {
        res.status(422).json({
            message: 'Confession must be under 2000 characters',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(CONFESSIONS).insert([
        {
            content: content.trim(),
            email: email,
        },
    ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    }

    res.status(200).json({
        message: 'Confession added successfully',
        error: false,
    })
}
