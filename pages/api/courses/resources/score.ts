import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { COURSE_RESOURCES } from '../../constants'
import { validateAPISession } from '@/pages/api/auth/session'

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

    const resource_id = req.query.id as string;
    const { data, error } = await supabase.from(COURSE_RESOURCES).select('*').eq('id', resource_id)

    if (error) {
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    }
    else {
        const { data: updatedData, error: updatedError } = await supabase.from(COURSE_RESOURCES).update({ score: data[0].score + 1 }).eq('id', resource_id).select()

        if (updatedError) {
            res.status(500).json({ message: updatedError.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'Updated score successfully',
                data: updatedData,
                error: false
            })
        }
        return
    }
}
