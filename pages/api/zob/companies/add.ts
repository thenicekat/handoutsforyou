import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { SI_COMPANIES } from '../../constants'
import { supabase } from '../../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    let { name, roles, year, cgpaCutoff, stipend, eligibility, otherDetails } =
        req.body

    if (!name) {
        res.status(422).json({
            message: 'Invalid Request - Company name missing',
            error: true,
        })
        return
    }
    if (!roles) {
        res.status(422).json({
            message: 'Invalid Request - Roles missing',
            error: true,
        })
        return
    }
    if (!year) {
        res.status(422).json({
            message: 'Invalid Request - Year missing',
            error: true,
        })
        return
    }
    if (!cgpaCutoff) {
        res.status(422).json({
            message: 'Invalid Request - CGPA cutoff missing',
            error: true,
        })
        return
    }
    if (!stipend) {
        res.status(422).json({
            message: 'Invalid Request - Stipend missing',
            error: true,
        })
        return
    }
    if (!eligibility) {
        res.status(422).json({
            message: 'Invalid Request - Eligibility missing',
            error: true,
        })
        return
    }

    name = name.trim()
    roles = roles.trim()
    cgpaCutoff = cgpaCutoff.trim()
    stipend = stipend.trim()
    eligibility = eligibility.trim()
    otherDetails = otherDetails ? otherDetails.trim() : ''
    year = year.trim()

    name = name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const { error } = await supabase.from(SI_COMPANIES).insert([
        {
            name: name,
            roles: roles,
            year: year,
            cgpa_cutoff: cgpaCutoff,
            stipend: stipend,
            eligibility: eligibility,
            otherdetails: otherDetails,
            email: email,
        },
    ])

    if (error) {
        console.error(error)
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
