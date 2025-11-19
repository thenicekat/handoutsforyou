import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { COURSE_RESOURCES } from '../../constants'
import { supabase } from '../../supabase'
import { trackContribution } from '../../contributions/track'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { name, link, created_by, category } = req.body

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
        // Track the contribution
        await trackContribution({
            email: email,
            created_by: created_by,
            contribution_type: 'course_resource',
            resource_name: name,
            category: category,
        })

        res.status(200).json({
            message: 'success',
            error: false,
        })
        return
    }
}
