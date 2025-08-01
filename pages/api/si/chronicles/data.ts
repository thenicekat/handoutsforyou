import type { NextApiRequest, NextApiResponse } from 'next'
import { BaseResponseData, getUser } from '../../auth/[...nextauth]'
import { SI_CHRONICLES } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    const { slug } = req.body

    if (!slug) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: [],
        })
    } else {
        const year = slug.split('_')[0]
        const company = slug.split('_')[1]

        const { data, error } = await supabase
            .from(SI_CHRONICLES)
            .select('*')
            .eq('year', year)
            .eq('company', company)

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
