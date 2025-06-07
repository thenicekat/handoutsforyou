import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { PLACEMENT_RESOURCES } from '../../constants'
import { validateAPISession, BaseResponseData } from '@/pages/api/auth/session'

interface ResponseData extends BaseResponseData {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res);
    if (!session) return;

    const { data, error } = await supabase
        .from(PLACEMENT_RESOURCES)
        .select('id, name, link, created_by, score, category')
        .order('score', { ascending: false })

    if (error) {
        console.error(error)
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
