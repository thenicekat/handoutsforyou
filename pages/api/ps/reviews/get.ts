import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { PS1_REVIEWS, PS2_REVIEWS } from '../../constants'

type ResponseData = {
    message: string,
    data: any,
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
            error: true,
            data: []
        })
        return;
    }

    const { type } = req.body

    if (type) {
        if (type === 'PS1') {
            const { data, error } = await supabase
                .from(PS1_REVIEWS)
                .select('station, batch, review, created_at')

            if (error) {
                res.status(500).json({ message: error.message, data: [], error: true })
                return
            }
            else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false
                })
                return
            }
        } else if (type === 'PS2') {
            const { data, error } = await supabase
                .from(PS2_REVIEWS)
                .select('station, batch, review, created_at')

            if (error) {
                res.status(500).json({ message: error.message, data: [], error: true })
                return
            }
            else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false
                })
                return
            }
        }
    }
}
