import type { NextApiRequest, NextApiResponse } from 'next'
import { processHeaders } from '../../auth/session'
import { COURSE_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'

type ResponseData = {
    message: string
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { name, link, created_by, category } = req.body
    const { email } = processHeaders(req)

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

    const { error } = await supabase.from(COURSE_RESOURCES).insert([
        {
            name: name,
            link: link,
            created_by: created_by,
            email: email,
            category: category,
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
