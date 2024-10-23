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

    const { course, sem, prof, data, created_by, average_mark } = req.body

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
    if (!average_mark) {
        res.status(422).json({ message: 'Invalid Request - Average mark missing', error: true })
        return
    }

    const rows = data.split('\n').map((row: string) => row.trim()).filter((row: string) => row.length > 0)
    if (rows.length === 0) {
        res.status(422).json({ message: 'Invalid Request - Empty data', error: true })
        return
    }

    const expectedHeader = 'Grade,Number of Students,Min Marks,Max Marks'
    if (rows[0] !== expectedHeader) {
        res.status(422).json({
            message: 'Invalid Request - First row must be exactly: Grade,Number of Students,Min Marks,Max Marks',
            error: true
        })
        return
    }

    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',')

        if (columns.length !== 4) {
            res.status(422).json({
                message: `Invalid Request - Row ${i + 1} does not have exactly 4 columns`,
                error: true
            })
            return
        }

        if (!columns[0] || columns[0].trim().length === 0) {
            res.status(422).json({
                message: `Invalid Request - Grade is empty in row ${i + 1}`,
                error: true
            })
            return
        }

        for (let j = 0; j < 4; j++) {
            if (!columns[j]) {
                columns[j] = ''
            }
        }

        rows[i] = columns.join(',')
    }

    const validatedData = rows.join('\n')

    const { error } = await supabase
        .from(COURSE_GRADING)
        .insert([
            {
                course: course,
                sem: sem,
                prof: prof,
                data: validatedData,
                created_by: created_by,
                average_mark: average_mark
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