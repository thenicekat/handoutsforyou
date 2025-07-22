import type { NextApiRequest, NextApiResponse } from 'next'
import { processHeaders } from '../../auth/session'
import { PLACEMENT_CTCS } from '../../constants'
import { supabase } from '../../supabase'

type ResponseData = {
    message: string
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let {
        company,
        campus,
        academicYear,
        base,
        joiningBonus,
        relocationBonus,
        variableBonus,
        monetaryValueOfBenefits,
        description,
    } = req.body
    const { email } = processHeaders(req)

    if (!company) {
        res.status(422).json({
            message: 'Invalid Request - Company missing',
            error: true,
        })
        return
    }
    if (!campus) {
        res.status(422).json({
            message: 'Invalid Request - Campus missing',
            error: true,
        })
        return
    }
    if (!academicYear) {
        res.status(422).json({
            message: 'Invalid Request - Academic year missing',
            error: true,
        })
        return
    }
    if (!base) {
        res.status(422).json({
            message: 'Invalid Request - Base missing',
            error: true,
        })
        return
    }
    if (!description) {
        res.status(422).json({
            message: 'Invalid Request - Description missing',
            error: true,
        })
        return
    }

    company = company.trim()
    campus = campus.trim()
    description = description.trim()
    academicYear = academicYear.trim()

    company = company
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const { error } = await supabase.from(PLACEMENT_CTCS).insert([
        {
            company: company,
            campus: campus,
            academic_year: academicYear,
            base: base,
            joining_bonus: joiningBonus,
            relocation_bonus: relocationBonus,
            variable_bonus: variableBonus,
            monetary_value_of_benefits: monetaryValueOfBenefits,
            description: description,
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
