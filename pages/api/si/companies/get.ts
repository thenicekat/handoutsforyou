import { BaseResponseData } from '@/pages/api/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { SI_COMPANIES } from '../../constants'
import { supabase } from '../../supabase'

interface ResponseData extends BaseResponseData {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { year } = req.body

    if (!year) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: [],
        })
    } else {
        const { data, error } = await supabase
            .from(SI_COMPANIES)
            .select('*')
            .eq('year', year)

        if (error) {
            console.error(error)
            res.status(500).json({
                message: error.message,
                data: [],
                error: true,
            })
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
}
