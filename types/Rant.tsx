export type Rant = {
    id: number
    rant: string
    created_at: string
    public: number
    rants_comments: {
        id: number
        comment: string
    }[]
}
