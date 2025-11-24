import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { COURSE_GRADING } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { course, prof } = req.query
    await getUser(req, res)

    if (!course && !prof) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, email, data, average_mark')

        if (error) {
            res.status(500).json({
                message: error.message,
                data: [],
                error: true,
            })
            return
        } else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false,
            })
            return
        }
    } else if (!course) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, email, data, average_mark')
            .eq('prof', prof)

        if (error) {
            res.status(500).json({
                message: error.message,
                data: [],
                error: true,
            })
            return
        } else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false,
            })
            return
        }
    } else if (!prof) {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, email, data, average_mark')
            .eq('course', course)

        if (error) {
            console.error(error)
            res.status(500).json({
                message: error.message,
                data: [],
                error: true,
            })
            return
        } else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false,
            })
            return
        }
    } else {
        const { data, error } = await supabase
            .from(COURSE_GRADING)
            .select('id, course, dept, sem, prof, email, data, average_mark')
            .eq('course', course)
            .eq('prof', prof)

        if (error) {
            console.error(error)
            res.status(500).json({
                message: error.message,
                data: [],
                error: true,
            })
            return
        } else {
            res.status(200).json({
                message: 'success',
                data: data,
                error: false,
            })
            return
        }
    }
}
