import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'

type ResponseData = {
    message: string,
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { course, prof } = req.body

    if (!course && !prof) {
        const { data, error } = await supabase
            .from('reviews')
            .select('course, prof, review, created_at')

        if (error) {
            console.log(error)
            res.status(500).json({ message: 'error occured', data: [] })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
            })
            return
        }
    }
    else if (!course) {
        const { data, error } = await supabase
            .from('reviews')
            .select('course, prof, review, created_at')
            .eq('prof', prof)

        if (error) {
            console.log(error)
            res.status(500).json({ message: 'error occured', data: [] })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
            })
            return
        }
    } else if (!prof) {
        const { data, error } = await supabase
            .from('reviews')
            .select('course, prof, review, created_at')
            .eq('course', course)

        if (error) {
            console.log(error)
            res.status(500).json({ message: 'error occured', data: [] })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
            })
            return
        }
    } else {
        const { data, error } = await supabase
            .from('reviews')
            .select('course, prof, review, created_at')
            .eq('course', course)
            .eq('prof', prof)

        if (error) {
            console.log(error)
            res.status(500).json({ message: error.message, data: [] })
            return
        }
        else {
            res.status(200).json({
                message: 'success',
                data: data,
            })
            return
        }
    }
}
