import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PS1_REVIEWS, PS2_REVIEWS } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { type, batch, station, review } = req.body

    if (!type) {
        res.status(422).json({
            message: 'Invalid Request - Type missing',
            error: true,
        })
        return
    } else if (type === 'PS1') {
        const { error } = await supabase.from(PS1_REVIEWS).insert([
            {
                batch: batch,
                station: station,
                review: review,
                created_by: email,
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
    } else if (type === 'PS2') {
        const { error } = await supabase.from(PS2_REVIEWS).insert([
            {
                batch: batch,
                station: station,
                review: review,
                created_by: email,
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
}
