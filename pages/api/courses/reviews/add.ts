import type { NextApiRequest, NextApiResponse } from 'next'
import { processHeaders } from '../../auth/session'
import { COURSE_REVIEWS } from '../../constants'
import { supabase } from '../../supabase'

type ResponseData = {
    message: string
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { course, prof, review } = req.body
    const { email } = processHeaders(req)

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
        res.status(200).json({
            message: 'success',
            error: false,
        })
        return
    }
}
