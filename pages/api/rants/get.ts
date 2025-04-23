import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { RANT_POSTS } from '../constants'

type ResponseData = {
    message: string,
    data: any,
    error: boolean
}

type Rant = {
    id: number,
    rant: string,
    created_at: string,
    public: number
    rants_comments: {
        id: number,
        comment: string
    }[]
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
    if (!email?.includes('hyderabad')) {
        res.status(403).json({
            message: 'Course reviews are only available for BITS Hyderabad students',
            error: true,
            data: []
        })
        return;
    }

    let rants: Rant[] = []

    // Get public rants from last 7 days.
    const { data, error } = await supabase
        .from(RANT_POSTS)
        .select('id, rant, created_at, public, rants_comments (id, comment)')
        .gte('created_at', Date.now() - 7 * 24 * 60 * 60 * 1000)
        .eq('public', 1)

    if (error) {
        console.error(error)
        res.status(500).json({ message: error.message, data: [], error: true })
        return
    }
    else {
        for (let i = 0; i < data.length; i++) {
            rants.push(data[i] as Rant)
        }
    }
    // Get private rants of the user.
    const { data: privateRants, error: privateError } = await supabase
        .from(RANT_POSTS)
        .select('id, rant, created_at, public, rants_comments (id, comment)')
        .gte('created_at', Date.now() - 7 * 24 * 60 * 60 * 1000)
        .eq('created_by', session?.user?.email)
        .eq('public', 0)

    if (privateError) {
        console.error(privateError)
        res.status(500).json({ message: privateError.message, data: [], error: true })
        return
    } else {
        for (let i = 0; i < privateRants.length; i++) {
            rants.push(privateRants[i] as Rant)
        }
    }

    res.status(200).json({
        message: 'success',
        data: rants,
        error: false
    })
    return
}
