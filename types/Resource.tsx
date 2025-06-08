export type Resource = {
    id: number
    name: string
    link: string
    created_by: string
    score: number
    category: string
}

export interface ResourceByCategory {
    [key: string]: Resource[]
}
