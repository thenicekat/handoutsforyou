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
        const { data, error } = await supabase
            .from(CONTRIBUTIONS)
            .select('contribution_type, count, email')

        if (error) {
            res.status(500).json({ message: error.message, error: true })
            return
        }

        const stats = {
            total: 0,
            byType: {} as Record<string, number>,
            byUser: {} as Record<string, number>,
        }

        data?.forEach((contribution) => {
            const type = contribution.contribution_type
            const count = contribution.count || 1

            stats.total += count
            stats.byType[type] = (stats.byType[type] || 0) + count

            const user = contribution.email || 'Anonymous'
            stats.byUser[user] = (stats.byUser[user] || 0) + count
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
