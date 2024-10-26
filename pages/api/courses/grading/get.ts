import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { COURSE_GRADING } from '../../constants'

type ResponseData = {
    message: string,
    data: any,
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
            error: true,
            data: []
        })
        return;
    }

    const email = session?.user?.email
    if (!email?.includes('hyderabad')) {
        res.status(403).json({
            message: 'Midsem grading feature is only available for BITS Hyderabad students',
            error: true,
            data: []
        })
        return;
    }

    const { course, prof } = req.body

    if (!course && !prof) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, created_by, data, average_mark')

        if (error) {
            res.status(500).json({ message: error.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false
            })
            return
        }
    }
    else if (!course) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, created_by, data, average_mark')
            .eq('prof', prof)

        if (error) {
            res.status(500).json({ message: error.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false
            })
            return
        }
    } else if (!prof) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, created_by, data, average_mark')
            .eq('course', course)

        if (error) {
            console.error(error)
            res.status(500).json({ message: error.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false
            })
            return
        }
    } else {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, created_by, data, average_mark')
            .eq('course', course)
            .eq('prof', prof)

        if (error) {
            console.error(error)
            res.status(500).json({ message: error.message, data: [], error: true })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false
            })
            return
        }
    }
}
