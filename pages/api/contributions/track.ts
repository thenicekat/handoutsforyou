import { CONTRIBUTIONS } from '../constants'
import { supabase } from '../supabase'

export interface ContributionData {
    email: string
    contribution_type: string
}

export async function trackContribution(input: ContributionData) {
    const { data, error } = await supabase
        .from(CONTRIBUTIONS)
        .select('*')
        .eq('email', input.email)
        .eq('contribution_type', input.contribution_type)

    if (error) {
        throw Error('Error while fetching user contributions.')
    } else {
        if (data.length === 0) {
            const { data: newData, error: newError } = await supabase
                .from(CONTRIBUTIONS)
                .insert({
                    email: input.email,
                    contribution_type: input.contribution_type,
                    count: 1,
                })
                .select()
            if (newError) {
                throw Error('Error while creating user contribution.')
            }
            return newData
        }
        const { data: updatedData, error: updatedError } = await supabase
            .from(CONTRIBUTIONS)
            .update({ count: data[0].count + 1 })
            .eq('email', input.email)
            .eq('contribution_type', input.contribution_type)
            .select()

        if (updatedError) {
            throw Error('Error while updating user contributions.')
        } else {
            return updatedData
        }
    }
}
