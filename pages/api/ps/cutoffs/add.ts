import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { PS1_RESPONSES, PS2_RESPONSES } from '../../constants'

type ResponseData = {
    message: string,
    data: any,
    error: boolean
}

type RequestData = {
    typeOfPS: string,
    idNumber: string | undefined,
    yearAndSem: string,
    stipend: number,
    allotmentRound: string,
    station: string,
    cgpa: number,
    preference: number,
    offshoot: number,
    offshootTotal: number,
    offshootType: string,
    public: number
}

const matchEmailIDNumber = (email: string, idNumber: string): string => {
    let uid = email.split("@")[0]
    let campus = email.split("@")[1].split(".")[0]
    if (campus[0].toUpperCase() !== idNumber[12]) {
        return "Please enter correct campus in your ID number."
    }
    if (uid[0] == "f" && "f" + idNumber.slice(0, 4) + idNumber.slice(8, 12) !== uid) {
        return "Your email and your ID number do not match. Please enter the correct ID number."
    }
    // TODO: Add more checks for HD users.
    if (uid[0] == "h") {
        return ""
    }
    return ""
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
        if (reqBody.cgpa < 0 || reqBody.cgpa > 10) {
            res.status(422).json({ message: "CGPA should be between 0 and 10", data: [], error: true })
            return
        }
        if (reqBody.preference < 0) {
            res.status(422).json({ message: "Preference should be a positive number", data: [], error: true })
            return
        }

        // Trim and convert to uppercase to avoid duplicates.
        reqBody.station = reqBody.station.toUpperCase().trim()

        if (reqBody.typeOfPS === 'ps1') {
            // Validate ID Number.
            if (!reqBody.idNumber || (reqBody && reqBody.idNumber && reqBody.idNumber?.length != 13)) {
                res.status(422).json({ message: "ID number should be 13 characters. For any queries, please reach out to the developers.", data: [], error: true });
                return;
            }
            // Check if email and ID Number match, this is only doing for PS2
            const matchingCheckResponse = matchEmailIDNumber(email, reqBody.idNumber)
            if (matchingCheckResponse !== "") {
                res.status(422).json({ message: matchingCheckResponse, data: [], error: true })
                return
            }
            const { data: existingData, error: existingError } = await supabase.
                from(PS1_RESPONSES)
                .select('*')
                .eq('email', email)
                .eq('allotment_round', reqBody.allotmentRound)
            if (existingData && existingData?.length > 0) {
                res.status(500).json({ message: "You have already submitted a response with this email and allotment round. Please do not try to enter fake data because this is not monitored.", data: [], error: true })
                return
            }

            const { data, error } = await supabase
                .from(PS1_RESPONSES)
                .insert([
                    {
                        email: email,
                        allotment_round: reqBody.allotmentRound,
                        id_number: reqBody.idNumber,
                        year_and_sem: reqBody.yearAndSem,
                        station: reqBody.station,
                        cgpa: reqBody.cgpa,
                        preference: reqBody.preference,
                        public: reqBody.public
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
            // Validate offshoot.
            if (reqBody.offshoot < 0 || reqBody.offshootTotal < 0 || reqBody.offshoot > reqBody.offshootTotal) {
                res.status(422).json({
                    message: "Please enter valid data for offshoot.",
                    data: [],
                    error: true
                });
                return;
            }
            // Validate ID Number.
            if (!reqBody.idNumber || (reqBody && reqBody.idNumber && reqBody.idNumber?.length != 13)) {
                res.status(422).json({ message: "ID number should be 13 characters. For any queries, please reach out to the developers.", data: [], error: true });
                return;
            }
            // Check if email and ID Number match, this is only doing for PS2
            const matchingCheckResponse = matchEmailIDNumber(email, reqBody.idNumber)
            if (matchingCheckResponse !== "") {
                res.status(422).json({ message: matchingCheckResponse, data: [], error: true })
                return
            }
            // Validate stipend.
            if (!(reqBody.stipend > 0 && reqBody.stipend <= 1200000)) {
                res.status(422).json({ message: "Stipend should be between 0 and 1200000. If your stipend is higher, please reach out to the developers to add your response.", data: [], error: true })
                return
            }

            const { data: existingData, error: existingError } = await supabase.
                from(PS2_RESPONSES)
                .select('*')
                .eq('email', email)
                .eq('allotment_round', reqBody.allotmentRound)

            if (existingData && existingData?.length > 0) {
                res.status(500).json({ message: "You have already submitted a response with this email and allotment round", data: [], error: true })
                return
            }

            const { data, error } = await supabase
                .from(PS2_RESPONSES)
                .insert([
                    {
                        email: email,
                        id_number: reqBody.idNumber,
                        allotment_round: reqBody.allotmentRound,
                        stipend: reqBody.stipend,
                        year_and_sem: reqBody.yearAndSem,
                        station: reqBody.station,
                        cgpa: reqBody.cgpa,
                        preference: reqBody.preference,
                        offshoot: reqBody.offshoot,
                        offshoot_total: reqBody.offshootTotal,
                        offshoot_type: reqBody.offshootType,
                        public: reqBody.public
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
