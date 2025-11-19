import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { COURSE_REVIEWS } from '../../constants'
import { trackContribution } from '../../contributions/track'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    const { course, prof, review } = req.body

    if (!course) {
        res.status(422).json({
            message: 'Invalid Request - Course missing',
            error: true,
        })
        return
    }
    if (!prof) {
        res.status(422).json({
            message: 'Invalid Request - Professor missing',
            error: true,
        })
        return
    }
    if (!review) {
        res.status(422).json({
            message: 'Invalid Request - Review missing',
            error: true,
        })
        return
    }

    const { error } = await supabase.from(COURSE_REVIEWS).insert([
        {
            course: course,
            prof: prof,
            review: review,
            created_by: email,
        },
    ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    } else {
        // Track the contribution
        await trackContribution({
            email: email,
            created_by: email,
            contribution_type: 'course_review',
            resource_name: `${course} - ${prof}`,
            category: course,
        })

        res.status(200).json({
            message: 'success',
            error: false,
        })
        return
    }
}
