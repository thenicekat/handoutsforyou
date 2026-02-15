import { getUser } from '@/pages/api/auth/[...nextauth]'
import { BaseResponseData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CONFESSIONS } from '../constants'
import { supabase } from '../supabase'

type ConfessionRow = {
    id: number
    content: string
    created_at: number
    confession_replies: {
        id: number
        content: string
        created_at: number
    }[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)

    const { data, error } = await supabase
        .from(CONFESSIONS)
        .select(
            'id, content, created_at, confession_replies (id, content, created_at)'
        )
        .order('created_at', { ascending: false })

    if (error) {
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    }

    res.status(200).json({
        message: 'success',
        data: data as ConfessionRow[],
        error: false,
    })
}
