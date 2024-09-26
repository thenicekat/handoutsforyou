import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { PLACEMENT_CTCS } from '../../constants'

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

    const { data, error } = await supabase
        .from(PLACEMENT_CTCS)
        .select('company, campus, academic_year, base, joining_bonus, relocation_bonus, variable_bonus, monetary_value_of_benefits, description')
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
