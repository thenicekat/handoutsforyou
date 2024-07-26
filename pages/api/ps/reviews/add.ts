import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

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

    const { type, batch, station, review, created_by } = req.body

    if (!type) {
        res.status(422).json({ message: 'Invalid Request - Type missing', error: true })
        return
    } else if (type === 'PS1') {
        const { error } = await supabase
            .from('ps1_reviews')
            .insert([
                { batch: batch, station: station, review: review, created_by: created_by }
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
    } else if (type === 'PS2') {
        const { error } = await supabase
            .from('ps2_reviews')
            .insert([
                { batch: batch, station: station, review: review, created_by: created_by }
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
}
