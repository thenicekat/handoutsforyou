import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { COURSE_REVIEWS } from '../../constants'
import { validateAPISession, BaseResponseData } from '@/pages/api/auth/session'

interface ResponseData extends BaseResponseData {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res)
    if (!session) return

    const { course, prof } = req.body

    if (!course && !prof) {
        const { data, error } = await supabase
            .from(COURSE_REVIEWS)
            .select('course, prof, review, created_at')

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
            .from(COURSE_REVIEWS)
            .select('course, prof, review, created_at')
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
            .from(COURSE_REVIEWS)
            .select('course, prof, review, created_at')
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
            .from(COURSE_REVIEWS)
            .select('course, prof, review, created_at')
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
