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

    const { data: ps1_data, error: ps1_error } = await supabase
        .from('ps1_responses')
        .select('created_at.count()')
        .single()
    const { data: ps2_data, error: ps2_error } = await supabase
        .from('ps2_responses')
        .select('created_at.count()')
        .single()
    const { data: reviews_data, error: reviews_error } = await supabase
        .from('course_reviews')
        .select('created_at.count()')
        .single()
    const { data: resources_data, error: resources_error } = await supabase
        .from('course_resources')
        .select('created_at.count()')
        .single()

    if (ps1_error || ps2_error || reviews_error || resources_error) {
        console.log(ps1_error, ps2_error, reviews_error, resources_error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: true,
            data: []
        })
        return
    }
    else {
        res.status(200).json({
            message: 'success',
            data: {
                ps1: ps1_data,
                ps2: ps2_data,
                reviews: reviews_data,
                resources: resources_data
            },
            error: false
        })
        return

    }
}
