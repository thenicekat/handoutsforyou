import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PLACEMENT_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { name, link, created_by, category, type } = req.body
    const { email } = await getUser(req, res)

    if (!name) {
        res.status(422).json({
            message: 'Invalid Request - Name missing',
            error: true,
        })
        return
    }
    if (!link) {
        res.status(422).json({
            message: 'Invalid Request - Link missing',
            error: true,
        })
        return
    }
    if (!created_by) {
        res.status(422).json({
            message: 'Invalid Request - User missing',
            error: true,
        })
        return
    }
    if (!category) {
        res.status(422).json({
            message: 'Invalid Request - Category missing',
            error: true,
        })
        return
    }
    if (!type) {
        res.status(422).json({
            message: 'Invalid Request - Type missing',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(PLACEMENT_RESOURCES).insert([
        {
            name: name,
            link: link,
            created_by: email,
            category: category,
            type: type,
        },
    ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    } else {
        res.status(200).json({
            message: 'success',
            error: false,
        })
        return
    }
}
