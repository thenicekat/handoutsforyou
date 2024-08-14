import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

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

    // Get last 24 hours rants.
    const { data, error } = await supabase
        .from('rants')
        .select('id, rant, created_at')
        .gte('created_at', Date.now() - 24 * 60 * 60 * 1000)

    if (error) {
        console.log(error)
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
