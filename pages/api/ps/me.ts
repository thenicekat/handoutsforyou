import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

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

    const email = session?.user?.email

    if (!email) {
        res.status(422).json({
            message: 'Please login and try again',
            error: true,
            data: []
        })
    }
    else {
        // First find PS1 responses
        const { data: ps1_data, error: ps1_error } = await supabase
            .from('ps1_responses')
            .select('*')
            .eq('email', email)
        const { data: ps2_data, error: ps2_error } = await supabase
            .from('ps2_responses')
            .select('*')
            .eq('email', email)
        if (ps1_error || ps2_error) {
            res.status(500).json({ message: ps1_error?.message || ps2_error?.message || "Some error occurred while retrieving your data", data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: {
                    ps1: ps1_data,
                    ps2: ps2_data
                },
                error: false
            })
            return
        }
    }
}
