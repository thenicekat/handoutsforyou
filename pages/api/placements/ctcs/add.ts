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

    const email = session?.user?.email
    if (!email || !admins.includes(email)) {
        res.status(403).json({
            message: 'Unauthorized, you are not eligible to add CTCs.',
            error: true
        })
        return
    }

    const { company, base, joiningBonus, relocationBonus, variableBonus, monetaryValueOfBenefits, description } = req.body

    if (!company) {
        res.status(422).json({ message: 'Invalid Request - Company missing', error: true })
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

    const { error } = await supabase
        .from(PLACEMENT_CTCS)
        .insert([
            { company: company, base: base, joining_bonus: joiningBonus, relocation_bonus: relocationBonus, variable_bonus: variableBonus, monetary_value_of_benefits: monetaryValueOfBenefits, description: description, created_by: session?.user?.email }
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
