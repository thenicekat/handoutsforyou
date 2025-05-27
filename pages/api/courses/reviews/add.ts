import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { COURSE_REVIEWS } from '../../constants'
import { validateAPISession } from '@/pages/api/auth/session'

type ResponseData = {
    message: string,
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res);
    if (!session) return;

    const { course, prof, review, created_by } = req.body

    if (!course) {
        res.status(422).json({ message: 'Invalid Request - Course missing', error: true })
        return
    }
    if (!prof) {
        res.status(422).json({ message: 'Invalid Request - Professor missing', error: true })
        return
    }
    if (!review) {
        res.status(422).json({ message: 'Invalid Request - Review missing', error: true })
        return
    }
    if (!created_by) {
        res.status(422).json({ message: 'Invalid Request - User missing', error: true })
        return
    }

    const { error } = await supabase
        .from(COURSE_REVIEWS)
        .insert([
            { course: course, prof: prof, review: review, created_by: created_by }
        ])

    if (error) {
        res.status(500).json({ message: error.message, error: true })
        return
    }
    else {
        res.status(200).json({
            message: 'success',
            error: false
        })
        return
    }
}
