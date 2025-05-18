import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { PS1_RESPONSES, PS2_RESPONSES } from '../../constants'

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

    const { email } = session.user
    const { type } = req.body

    if (!email) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            data: []
        })
        return;
    }

    if (!type) {
        res.status(422).json({
            message: 'Missing type field',
            error: true,
            data: []
        })
        return;
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
            error: true 
        })
        return
    }
    
    res.status(200).json({
        message: 'success',
        data: data,
        error: false
    })
}
