import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { PLACEMENT_CTCS } from '../../constants'
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

    const { year } = req.body

    if (!year) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: []
        })
    }
    else {
        const { data, error } = await supabase
        .from(PLACEMENT_CTCS)
        .select('company, campus, base, joining_bonus, relocation_bonus, variable_bonus, monetary_value_of_benefits, description')
        .order('company', { ascending: true })
        .eq('academic_year', year)

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
}
