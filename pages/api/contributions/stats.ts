import { BaseResponseData } from '@/pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CONTRIBUTIONS } from '../constants'
import { supabase } from '../supabase'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
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
        ] = await Promise.all([
            supabase.from(CONTRIBUTIONS).select('count.sum()'),

            supabase
                .from(CONTRIBUTIONS)
                .select('contribution_type, count.sum()'),

            supabase.from(CONTRIBUTIONS).select('email, count.sum()'),
        ])

        if (totalError || byTypeError || byUserError) {
            const error = totalError || byTypeError || byUserError
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

        byTypeData?.forEach((item: any) => {
            stats.byType[item.contribution_type] = item.sum || 0
        })

        byUserData?.forEach((item: any) => {
            const user = item.email || 'Anonymous'
            stats.byUser[user] = item.sum || 0
        })

        res.status(200).json({
            message: 'success',
            error: false,
            data: stats,
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: true,
        })
    }
}
