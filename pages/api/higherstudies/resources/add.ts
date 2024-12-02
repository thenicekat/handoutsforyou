import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { HIGHER_STUDIES_RESOURCES } from '../../constants'

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
    }

    const { name, link, created_by, category } = req.body

    if (!name) {
        res.status(422).json({ message: 'Invalid Request - Name missing', error: true })
        return
    }
    if (!link) {
        res.status(422).json({ message: 'Invalid Request - Link missing', error: true })
        return
    }
    if (!created_by) {
        res.status(422).json({ message: 'Invalid Request - User missing', error: true })
        return
    }
    if (!category) {
        res.status(422).json({ message: 'Invalid Request - Category missing', error: true })
        return
    }

    const { error } = await supabase
        .from(HIGHER_STUDIES_RESOURCES)
        .insert([
            { name: name, link: link, created_by: created_by, email: session?.user?.email, category: category }
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
