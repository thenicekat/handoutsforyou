import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CONTRIBUTIONS, PS1_RESPONSES, PS2_RESPONSES } from '../constants'
import { supabase } from '../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    await getUser(req, res)
    if (req.method !== 'GET') {
        res.status(405).json({
            message: 'Method not allowed',
            error: true,
        })
        return
    }

    try {
        const [
            { data: totalData, error: totalError },
            { data: byTypeData, error: byTypeError },
            { data: byUserData, error: byUserError },
            { data: ps1Data, error: ps1Error },
            { data: ps2Data, error: ps2Error },
        ] = await Promise.all([
            supabase.from(CONTRIBUTIONS).select('count.sum()'),

            supabase
                .from(CONTRIBUTIONS)
                .select('contribution_type, count.sum()'),

            supabase.from(CONTRIBUTIONS).select('email, count.sum()'),

            supabase.from(PS1_RESPONSES).select('added_by, added_by.count()'),

            supabase.from(PS2_RESPONSES).select('added_by, added_by.count()'),
        ])

        if (totalError || byTypeError || byUserError || ps1Error || ps2Error) {
            const error =
                totalError || byTypeError || byUserError || ps1Error || ps2Error
            console.error('Error fetching contribution stats:', error)
            res.status(500).json({
                message: error?.message || 'Internal server error',
                error: true,
            })
            return
        }

        const stats = {
            total: (totalData?.[0] as any).sum || 0,
            byType: {} as Record<string, number>,
            byUser: {} as Record<string, number>,
        }

        // Handle non ps data.
        byTypeData?.forEach((item: any) => {
            stats.byType[item.contribution_type] = item.sum || 0
        })
        byUserData?.forEach((item: any) => {
            const user = item.email || 'Anonymous'
            stats.byUser[user] = item.sum || 0
        })
        // Handle ps data.
        // This is done separately in order to not pollute contribution table.
        ps1Data?.forEach((item: any) => {
            stats.byUser[item.added_by] =
                (stats.byUser[item.added_by] || 0) + item.count || 0
            stats.byType['ps1_cutoff'] =
                (stats.byType['ps1_cutoff'] || 0) + item.count || 0
        })
        ps2Data?.forEach((item: any) => {
            stats.byUser[item.added_by] =
                (stats.byUser[item.added_by] || 0) + item.count || 0
            stats.byType['ps2_cutoff'] =
                (stats.byType['ps2_cutoff'] || 0) + item.count || 0
        })
        stats.total =
            stats.total +
            stats.byType['ps1_cutoff'] +
            stats.byType['ps2_cutoff']

        res.status(200).json({
            message: 'success',
            error: false,
            data: stats,
        })
    } catch (error) {
        console.error('Error fetching contribution stats:', error)
        res.status(500).json({
            message: 'Internal server error',
            error: true,
        })
    }
}
