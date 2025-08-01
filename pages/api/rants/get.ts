import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { RANT_POSTS } from '../constants'
import { supabase } from '../supabase'

type Rant = {
    id: number
    rant: string
    created_at: string
    public: number
    rants_comments: {
        id: number
        comment: string
    }[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    let rants: Rant[] = []

    // Get public rants.
    const { data, error } = await supabase
        .from(RANT_POSTS)
        .select('id, rant, created_at, public, rants_comments (id, comment)')
        .eq('public', 1)

    if (error) {
        console.error(error)
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    } else {
        for (let i = 0; i < data.length; i++) {
            rants.push(data[i] as Rant)
        }
    }
    // Get private rants of the user.
    const { data: privateRants, error: privateError } = await supabase
        .from(RANT_POSTS)
        .select('id, rant, created_at, public, rants_comments (id, comment)')
        .eq('created_by', email)
        .eq('public', 0)

    if (privateError) {
        console.error(privateError)
        res.status(500).json({
            message: privateError.message,
            data: [],
            error: true,
        })
        return
    } else {
        for (let i = 0; i < privateRants.length; i++) {
            rants.push(privateRants[i] as Rant)
        }
    }

    res.status(200).json({
        message: 'success',
        data: rants,
        error: false,
    })
    return
}
