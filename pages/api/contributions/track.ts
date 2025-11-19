import { CONTRIBUTIONS } from '../constants'
import { supabase } from '../supabase'

export interface ContributionData {
    email: string
    created_by: string
    contribution_type: string
    resource_name?: string
    category?: string
}

export async function trackContribution(data: ContributionData) {
    const { error } = await supabase.from(CONTRIBUTIONS).insert([
        {
            email: data.email,
            created_by: data.created_by,
            contribution_type: data.contribution_type,
            resource_name: data.resource_name,
            category: data.category,
            status: 'pending',
        },
    ])

    if (error) {
        throw new Error(error.message)
    }
}
