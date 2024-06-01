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
            message: 'Unauthorized, Please login and try again,
            error: true,
            data: []
        })
    }

    const { data, error } = await supabase
        .from('resources')
        .select('id, name, link, created_by, score')
        .order('score', { ascending: false })

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
