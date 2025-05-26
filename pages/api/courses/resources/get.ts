import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { COURSE_RESOURCES } from '../../constants'
import { validateAPISession } from '@/lib/session'

type ResponseData = {
    message: string,
    data: any,
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res);
    if (!session) return;

    const { data, error } = await supabase
        .from(COURSE_RESOURCES)
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
