import { BaseResponseData } from '@/pages/api/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { processHeaders } from '@/middleware'
import { PS1_RESPONSES, PS2_RESPONSES } from '../../constants'
import { supabase } from '../../supabase'

interface ResponseData extends BaseResponseData {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { type } = req.body
    const { email } = await processHeaders(req)

    if (!type) {
        res.status(422).json({
            message: 'Missing type field',
            error: true,
            data: [],
        })
        return
    }

    const tableName = type === 'ps1' ? PS1_RESPONSES : PS2_RESPONSES

    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('email', email)

    if (error) {
        res.status(500).json({
            message: error.message,
            data: [],
            error: true,
        })
        return
    }

    res.status(200).json({
        message: 'success',
        data: data,
        error: false,
    })
}
