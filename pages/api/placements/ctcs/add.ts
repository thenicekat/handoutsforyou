import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { admins, PLACEMENT_CTCS } from '../../constants'

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

    let { company, campus, academicYear, base, joiningBonus, relocationBonus, variableBonus, monetaryValueOfBenefits, description } = req.body

    if (!company) {
        res.status(422).json({ message: 'Invalid Request - Company missing', error: true })
        return
    }
    if (!campus) {
        res.status(422).json({ message: 'Invalid Request - Campus missing', error: true })
        return
    }
    if (!academicYear) {
        res.status(422).json({ message: 'Invalid Request - Academic year missing', error: true })
        return
    }
    if (!base) {
        res.status(422).json({ message: 'Invalid Request - Base missing', error: true })
        return
    }
    if (!description) {
        res.status(422).json({ message: 'Invalid Request - Description missing', error: true })
        return
    }

    company = company.trim()
    campus = campus.trim()
    description = description.trim()
    academicYear = academicYear.trim()

    company = company.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    const { error } = await supabase
        .from(PLACEMENT_CTCS)
        .insert([
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
                created_by: session?.user?.email
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
