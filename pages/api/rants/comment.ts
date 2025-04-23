import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { RANT_COMMENTS } from '../constants'

type ResponseData = {
    message: string,
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true
        })
        return
    }

    const { rantId, comment } = req.body

    if (!rantId) {
        res.status(422).json({ message: 'Invalid Request - Rant ID missing', error: true })
        return
    }
    if (!comment) {
        res.status(422).json({ message: 'Invalid Request - Comment missing', error: true })
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
