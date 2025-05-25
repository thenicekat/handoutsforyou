import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { RANT_COMMENTS } from '../constants'
import { validateAPISession, BaseResponseData } from '@/lib/session'

interface ResponseData extends BaseResponseData {
    data?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res);
    if (!session) return;

    const { rantId, comment } = req.body

    if (!rantId) {
        res.status(422).json({ message: 'Invalid Request - Rant ID missing', error: true })
        return
    }
    if (!comment) {
        res.status(422).json({ message: 'Invalid Request - Comment missing', error: true })
        return
    }
    if (!rantId) {
        res.status(422).json({ message: 'Invalid Request - Rant missing', error: true })
        return
    }

    const { error } = await supabase
        .from(RANT_COMMENTS)
        .insert([
            { rant_id: rantId, comment: comment, created_by: session?.user?.email, created_at: Date.now() }
        ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    }
    else {
        res.status(200).json({
            message: 'success',
            error: false
        })
        return
    }
}
