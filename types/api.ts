export type BaseResponseData = {
    message: string
    error: boolean
    data?: any
}

export type AuthorizedUser = {
    email: string
    name: string | null | undefined
}

export interface ContributionData {
    email: string
    contribution_type: string
    count?: number
}

export interface ContributionStats {
    total: number
    byType: Record<string, number>
    byUser: Record<string, number>
}

export type PSCutoffRequest = {
    typeOfPS: string
    idNumber: string | undefined
    yearAndSem: string
    stipend: number
    allotmentRound: string
    station: string
    cgpa: number
    preference: number
    offshoot: number
    offshootTotal: number
    offshootType: string
    public: number
}

export interface BlogPostRequest {
    title: string
    author: string
    content: string
    tags?: string[]
}
