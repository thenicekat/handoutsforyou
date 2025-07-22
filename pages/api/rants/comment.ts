import { BaseResponseData, processHeaders } from '@/pages/api/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { EMAIL_HEADER, RANT_COMMENTS } from '../constants'
import { supabase } from '../supabase'

interface ResponseData extends BaseResponseData {
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { rantId, comment } = req.body
    const { email } = processHeaders(req)

    if (!rantId) {
        res.status(422).json({
            message: 'Invalid Request - Rant ID missing',
            error: true,
        })
        return
    }
    if (!comment) {
        res.status(422).json({
            message: 'Invalid Request - Comment missing',
            error: true,
        })
        return
    }
    if (!rantId) {
        res.status(422).json({
            message: 'Invalid Request - Rant missing',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(RANT_COMMENTS).insert([
        {
            rant_id: rantId,
            comment: comment,
            created_by: email,
            created_at: Date.now(),
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
