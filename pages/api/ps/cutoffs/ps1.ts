import { BaseResponseData } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PS1_RESPONSES } from '../../constants'
import { supabase } from '../../supabase'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { year } = req.body

    if (!year) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: [],
        })
    } else {
        let allData: any[] = []
        let page = 0
        const pageSize = 1000

        while (true) {
            const { data, error } = await supabase
                .from(PS1_RESPONSES)
                .select(
                    'id, id_number, name, station, cgpa, allotment_round, public'
                )
                .eq('year_and_sem', year)
                .order('created_at', { ascending: false })
                .range(page * pageSize, (page + 1) * pageSize - 1)

            if (error) {
                console.error(error)
                res.status(500).json({
                    message: error.message,
                    data: [],
                    error: true,
                })
                return
            }

            if (data.length === 0) {
                break
            }

            allData = allData.concat(data)
            page++
        }

        let concealedData = allData.map((item: any) => {
            if (item.public) {
                return item
            } else {
                return {
                    ...item,
                    id_number:
                        item.id_number.slice(0, 8) +
                        'XXXX' +
                        item.id_number.slice(12, 13),
                    name: 'REDACTED',
                }
            }
        })

        res.status(200).json({
            message: 'success',
            data: concealedData,
            error: false,
        })
    }
}
