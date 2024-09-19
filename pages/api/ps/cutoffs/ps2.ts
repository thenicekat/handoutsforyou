import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { PS2_RESPONSES } from '../../constants'

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
            .from(PS2_RESPONSES)
            .select('id, station, cgpa, allotment_round, offshoot, offshoot_total, offshoot_type')
            .eq('year_and_sem', year)

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
