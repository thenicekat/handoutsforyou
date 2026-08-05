import { getUser } from '@/pages/api/auth/[...nextauth]'
import { BaseResponseData } from '@/types'
import { PS1_RESPONSES, PS2_RESPONSES } from '@/utils/constants'
import { supabase } from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { type } = req.query
    const { email } = await getUser(req, res)

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
