import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PLACEMENT_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    const resource_id = req.query.id as string
    const { data, error } = await supabase
        .from(PLACEMENT_RESOURCES)
        .select('*')
        .eq('id', resource_id)

    if (error) {
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    } else {
        const { data: updatedData, error: updatedError } = await supabase
            .from(PLACEMENT_RESOURCES)
            .update({ score: data[0].score + 1 })
            .eq('id', resource_id)
            .select('*')
        if (updatedError) {
            res.status(500).json({
                message: updatedError.message,
                data: [],
                error: true,
            })
            return
        } else {
            res.status(200).json({
                message: 'success',
                data: updatedData,
                error: false,
            })
        }
        return
    }
}
