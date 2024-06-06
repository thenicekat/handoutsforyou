import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

type ResponseData = {
    message: string,
    data: any,
    error: boolean
}

type RequestData = {
    typeOfPS: string,
    idNumber: string | undefined,
    yearAndSem: string,
    allotmentRound: string,
    station: string,
    cgpa: number,
    preference: number,
    offshoot: number,
    offshootTotal: number,
    offshootType: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            data: []
        })
        return;
    }

    const email = session?.user?.email
    const reqBody: RequestData = req.body

    if (!email) {
        res.status(400).json({
            message: 'Unauthorized, Please login and try again',
            error: true,
            data: []
        })
        return;
    }
    if (!reqBody || !reqBody.typeOfPS || !reqBody.yearAndSem || !reqBody.allotmentRound || !reqBody.station || !reqBody.cgpa) {
        res.status(422).json({
            message: 'Missing required fields',
            error: true,
            data: []
        })
    }
    else {
        // Trim and convert to uppercase to avoid duplicates
        reqBody.station = reqBody.station.toUpperCase().trim()

        if (reqBody.typeOfPS === 'ps1') {
            const { data: existingData, error: existingError } = await supabase.
                from('ps1_responses')
                .select('*')
                .eq('email', email)
                .eq('allotment_round', reqBody.allotmentRound)
            if (existingData && existingData?.length > 0) {
                res.status(500).json({ message: "You have already submitted a response with this email and allotment round. Please do not try to enter fake data because this is not monitored.", data: [], error: true })
                return
            }

            const { data, error } = await supabase
                .from('ps1_responses')
                .insert([
                    {
                        email: email,
                        allotment_round: reqBody.allotmentRound,
                        year_and_sem: reqBody.yearAndSem,
                        station: reqBody.station,
                        cgpa: reqBody.cgpa,
                        preference: reqBody.preference,
                    }
                ])

            if (error) {
                res.status(500).json({ message: error.message, data: [], error: true })
                return
            }
            else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false
                })
                return
            }
        }
        else if (reqBody.typeOfPS === 'ps2') {
             if(!reqBody.idNumber || reqBody.idNumber.length < 12) res.status(500).json({ message: "ID number format is not correct", data: [], error: true });
            // Check if email and ID Number match, this is only doing for PS2
            if ("f" + reqBody.idNumber.slice(0, 4) + reqBody.idNumber.slice(8, 12) !== email?.split("@")[0]) {
                res.status(500).json({ message: "Email and ID Number do not match", data: [], error: true })
                return
            }

            const { data: existingData, error: existingError } = await supabase.
                from('ps2_responses')
                .select('*')
                .eq('email', email)
                .eq('allotment_round', reqBody.allotmentRound)
            if (existingData && existingData?.length > 0) {
                res.status(500).json({ message: "You have already submitted a response with this email and allotment round", data: [], error: true })
                return
            }

            const { data, error } = await supabase
                .from('ps2_responses')
                .insert([
                    {
                        email: email,
                        id_number: reqBody.idNumber,
                        allotment_round: reqBody.allotmentRound,
                        year_and_sem: reqBody.yearAndSem,
                        station: reqBody.station,
                        cgpa: reqBody.cgpa,
                        preference: reqBody.preference,
                        offshoot: reqBody.offshoot,
                        offshoot_total: reqBody.offshootTotal,
                        offshoot_type: reqBody.offshootType
                    }
                ])

            if (error) {
                res.status(500).json({ message: error.message, data: [], error: true })
                return
            }
            else {
                res.status(200).json({
                    message: 'success',
                    data: data,
                    error: false
                })
                return
            }
        }


    }
}
