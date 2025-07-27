import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PLACEMENT_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    const { type } = req.query
    if (!type) {
        res.status(422).json({
            message: 'Invalid Request - Type missing',
            error: true,
        })
        return
    }

    const { data, error } = await supabase
        .from(PLACEMENT_RESOURCES)
        .select('id, name, link, created_by, score, category')
        .eq('type', type)
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
