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
            .select('id, id_number, station, cgpa, stipend, allotment_round, offshoot, offshoot_total, offshoot_type, public')
            .eq('year_and_sem', year)

        if (error) {
            console.error(error)
            res.status(500).json({ message: error.message, data: [], error: true })
            return
        }
        else {
            let concealedData = data.map((item: any) => {
                if (item.public) {
                    return item
                }
                else {
                    return {
                        ...item,
                        id_number: item.id_number.slice(0, 8) + 'XXXX' + item.id_number.slice(12, 13)
                    }
                }
            })
            res.status(200).json({
                message: 'success',
                data: concealedData,
                error: false
            })
            return
        }
    }
}
