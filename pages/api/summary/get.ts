import { validateAPISession } from '@/pages/api/auth/session'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    COURSE_GRADING,
    COURSE_RESOURCES,
    COURSE_REVIEWS,
    HIGHER_STUDIES_RESOURCES,
    PLACEMENT_CTCS,
    PS1_RESPONSES,
    PS2_RESPONSES,
    SI_CHRONICLES,
    SI_COMPANIES,
} from '../constants'
import { supabase } from '../supabase'

type ResponseData = {
    message: string
    data: any
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res)
    if (!session) return

    const { data: ps1_data, error: ps1_error } = await supabase
        .from(PS1_RESPONSES)
        .select('created_at.count()')
        .single()
    const { data: ps2_data, error: ps2_error } = await supabase
        .from(PS2_RESPONSES)
        .select('created_at.count()')
        .single()
    const { data: reviews_data, error: reviews_error } = await supabase
        .from(COURSE_REVIEWS)
        .select('created_at.count()')
        .single()
    const { data: resources_data, error: resources_error } = await supabase
        .from(COURSE_RESOURCES)
        .select('created_at.count()')
        .single()
    const { data: grading_data, error: grading_error } = await supabase
        .from(COURSE_GRADING)
        .select('id.count()')
        .single()
    const { data: hs_resources_data, error: hs_resources_error } =
        await supabase
            .from(HIGHER_STUDIES_RESOURCES)
            .select('created_at.count()')
            .single()
    const { data: si_chron_data, error: si_chron_error } = await supabase
        .from(SI_CHRONICLES)
        .select('name.count()')
        .single()
    const { data: si_comp_data, error: si_comp_error } = await supabase
        .from(SI_COMPANIES)
        .select('name.count()')
        .single()
    const { data: placement_ctc_data, error: placement_ctc_error } =
        await supabase
            .from(PLACEMENT_CTCS)
            .select('created_by.count()')
            .single()

    if (
        ps1_error ||
        ps2_error ||
        reviews_error ||
        resources_error ||
        grading_error ||
        si_chron_error ||
        si_comp_error ||
        placement_ctc_error ||
        hs_resources_error
    ) {
        console.error(
            ps1_error,
            ps2_error,
            reviews_error,
            resources_error,
            si_chron_error,
            si_comp_error,
            placement_ctc_error,
            hs_resources_error,
            grading_error
        )
        res.status(500).json({
            message: 'Internal Server Error',
            error: true,
            data: [],
        })
        return
    } else {
        res.status(200).json({
            message: 'success',
            data: {
                ps1Cutoffs: ps1_data.count,
                ps2Cutoffs: ps2_data.count,
                courseReviews: reviews_data.count,
                courseResources: resources_data.count,
                courseGrading: grading_data.count,
                siChronicles: si_chron_data.count,
                siCompanies: si_comp_data.count,
                placementCtcs: placement_ctc_data.count,
                higherStudiesResources: hs_resources_data.count,
            },
            error: false,
        })
        return
    }
}
