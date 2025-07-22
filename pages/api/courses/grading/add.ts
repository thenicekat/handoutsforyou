import { departments } from '@/config/departments'
import type { NextApiRequest, NextApiResponse } from 'next'
import { COURSE_GRADING, EMAIL_HEADER } from '../../constants'
import { supabase } from '../../supabase'

type ResponseData = {
    message: string
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const depts: string[] = Object.values(departments)
        .flatMap((code: string) => code.split('/'))
        .map((code) => code.trim())
        .filter((code) => code.length > 0)

    const { course, dept, sem, prof, data, average_mark } = req.body
    const email = Buffer.from(req.headers[EMAIL_HEADER] as string, 'base64').toString('utf-8')

    if (!course) {
        res.status(422).json({
            message: 'Invalid Request - Course missing',
            error: true,
        })
        return
    }
    if (
        dept !== 'ALL' &&
        (!depts.includes(dept) || !course.split(' ')[0].includes(dept))
    ) {
        res.status(422).json({
            message: 'Invalid Request - Department missing/invalid',
            error: true,
        })
        return
    }
    if (!sem) {
        res.status(422).json({
            message: 'Invalid Request - Semester missing',
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
    if (!data) {
        res.status(422).json({
            message: 'Invalid Request - Grading data missing',
            error: true,
        })
        return
    }
    if (!average_mark) {
        res.status(422).json({
            message: 'Invalid Request - Average mark missing',
            error: true,
        })
        return
    }

    const rows = data
        .split('\n')
        .map((row: string) => row.trim())
        .filter((row: string) => row.length > 0)
    if (rows.length === 0) {
        res.status(422).json({
            message: 'Invalid Request - Empty data',
            error: true,
        })
        return
    }

    const expectedHeader = 'Grade,Number of Students,Min Marks,Max Marks'
    if (rows[0] !== expectedHeader) {
        res.status(422).json({
            message:
                'Invalid Request - First row must be exactly: Grade,Number of Students,Min Marks,Max Marks',
            error: true,
        })
        return
    }

    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',')

        if (columns.length !== 4) {
            res.status(422).json({
                message: `Invalid Request - Row ${i + 1} does not have exactly 4 columns`,
                error: true,
            })
            return
        }

        if (!columns[0] || columns[0].trim().length === 0) {
            res.status(422).json({
                message: `Invalid Request - Grade is empty in row ${i + 1}`,
                error: true,
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

    const { error } = await supabase.from(COURSE_GRADING).insert([
        {
            course: course,
            dept: dept,
            sem: sem,
            prof: prof,
            data: validatedData,
            created_by: email,
            average_mark: average_mark,
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
