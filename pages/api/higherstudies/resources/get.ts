import { getUser } from '@/pages/api/auth/[...nextauth]'
import { BaseResponseData } from '@/types'
import { HIGHER_STUDIES_RESOURCES } from '@/utils/constants'
import { supabase } from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    const { data, error } = await supabase
        .from(HIGHER_STUDIES_RESOURCES)
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
