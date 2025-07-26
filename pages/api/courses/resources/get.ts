import type { NextApiRequest, NextApiResponse } from 'next'
import { COURSE_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'
import { BaseResponseData } from '../../auth/[...nextauth]'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { data, error } = await supabase
        .from(COURSE_RESOURCES)
        .select('id, name, link, created_by, score, category')
        .order('score', { ascending: false })

    if (error) {
        console.error(error)
        res.status(500).json({ message: error.message, data: [], error: true })
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
