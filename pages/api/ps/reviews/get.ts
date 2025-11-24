import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PS1_REVIEWS, PS2_REVIEWS } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    const { type } = req.query

    if (type) {
        if (type === 'PS1') {
            const { data, error } = await supabase
                .from(PS1_REVIEWS)
                .select('station, batch, review, created_at')

            if (error) {
                res.status(500).json({
                    message: error.message,
                    data: [],
                    error: true,
                })
                return
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false,
                })
                return
            }
        } else if (type === 'PS2') {
            const { data, error } = await supabase
                .from(PS2_REVIEWS)
                .select('station, batch, review, created_at')

            if (error) {
                res.status(500).json({
                    message: error.message,
                    data: [],
                    error: true,
                })
                return
            } else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false,
                })
                return
            }
        }
    }
}
