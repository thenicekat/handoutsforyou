import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { HIGHER_STUDIES_RESOURCES } from '../../constants'

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

    const resource_id = req.query.id as string;
    const { data, error } = await supabase.from(HIGHER_STUDIES_RESOURCES).select('*').eq('id', resource_id)

    if (error) {
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    }
    else {
        const { data: updatedData, error: updatedError } = await supabase.from(HIGHER_STUDIES_RESOURCES).update({ score: data[0].score + 1 }).eq('id', resource_id).select('*')
        if (updatedError) {
            res.status(500).json({ message: updatedError.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: updatedData,
                error: false
            })
        }
        return
    }
}
