import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { DONATIONS } from '../constants'

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
            data: 0,
            error: true
        })
    }

    const { data, error } = await supabase
        .from(DONATIONS)
        .select("*")

    if (error) {
        res.status(500).json({ message: error.message, error: true, data: 0 })
        return
    }
    else {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].verified)
                sum += data[i].amount
        }
        res.status(200).json({
            message: 'success',
            error: false,
            data: {
                sum: sum,
                donations: data
            }
        })
        return
    }
}
