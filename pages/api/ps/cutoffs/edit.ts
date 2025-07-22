import type { NextApiRequest, NextApiResponse } from 'next'
import { PS1_RESPONSES, PS2_RESPONSES } from '../../constants'
import { processHeaders } from '../../auth/session'
import { supabase } from '../../supabase'

type ResponseData = {
    message: string
    data: any
    error: boolean
}

type RequestData = {
    id: number
    typeOfPS: string
    idNumber: string | undefined
    yearAndSem: string
    stipend?: number
    allotmentRound: string
    station: string
    cgpa: number
    preference: number
    offshoot?: number
    offshootTotal?: number
    offshootType?: string
    public: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const { email } = processHeaders(req)
    const reqBody: RequestData = req.body

    if (!email) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            data: [],
        })
        return
    }

    if (
        !reqBody ||
        !reqBody.id ||
        !reqBody.typeOfPS ||
        !reqBody.yearAndSem ||
        !reqBody.allotmentRound ||
        !reqBody.station ||
        !reqBody.cgpa
    ) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: [],
        })
        return
    }

    if (reqBody.cgpa < 0 || reqBody.cgpa > 10) {
        res.status(422).json({
            message: 'CGPA should be between 0 and 10',
            data: [],
            error: true,
        })
        return
    }
    if (reqBody.preference < 0) {
        res.status(422).json({
            message: 'Preference should be a positive number',
            data: [],
            error: true,
        })
        return
    }

    reqBody.station = reqBody.station.toUpperCase().trim()

    const tableName = reqBody.typeOfPS === 'ps1' ? PS1_RESPONSES : PS2_RESPONSES

    const { data: existingResponse, error: existingError } = await supabase
        .from(tableName)
        .select('id, email')
        .eq('id', reqBody.id)
        .single()

    if (existingError) {
        res.status(500).json({
            message: existingError.message,
            data: [],
            error: true,
        })
        return
    }

    if (!existingResponse || existingResponse.email !== email) {
        res.status(403).json({
            message: "You don't have permission to update this response",
            data: [],
            error: true,
        })
        return
    }

    if (reqBody.typeOfPS === 'ps1') {
        const { data, error } = await supabase
            .from(PS1_RESPONSES)
            .update({
                id_number: reqBody.idNumber,
                year_and_sem: reqBody.yearAndSem,
                allotment_round: reqBody.allotmentRound,
                station: reqBody.station,
                cgpa: reqBody.cgpa,
                preference: reqBody.preference,
                public: reqBody.public,
            })
            .eq('id', reqBody.id)

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
    } else if (reqBody.typeOfPS === 'ps2') {
        const { data, error } = await supabase
            .from(PS2_RESPONSES)
            .update({
                id_number: reqBody.idNumber,
                year_and_sem: reqBody.yearAndSem,
                allotment_round: reqBody.allotmentRound,
                station: reqBody.station,
                cgpa: reqBody.cgpa,
                preference: reqBody.preference,
                stipend: reqBody.stipend,
                offshoot: reqBody.offshoot,
                offshoot_total: reqBody.offshootTotal,
                offshoot_type: reqBody.offshootType,
                public: reqBody.public,
            })
            .eq('id', reqBody.id)

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
    }

    res.status(400).json({
        message: 'Invalid typeOfPS value',
        data: [],
        error: true,
    })
}
