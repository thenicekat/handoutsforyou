import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { COURSE_GRADING } from '../../constants'

type ResponseData = {
    message: string,
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
            error: true
        })
        return
    }

    const { course, sem, prof, data, created_by } = req.body

    if (!course) {
        res.status(422).json({ message: 'Invalid Request - Course missing', error: true })
        return
    }
    if (!sem) {
        res.status(422).json({ message: 'Invalid Request - Semester missing', error: true })
        return
    }
    if (!prof) {
        res.status(422).json({ message: 'Invalid Request - Professor missing', error: true })
        return
    }
    if (!data) {
        res.status(422).json({ message: 'Invalid Request - Grading data missing', error: true })
        return
    }
    if (!created_by) {
        res.status(422).json({ message: 'Invalid Request - User missing', error: true })
        return
    }

    const { error } = await supabase
        .from(COURSE_GRADING)
        .insert([
            { 
                course: course,
                sem: sem,
                prof: prof,
                data: data,
                created_by: created_by 
            }
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