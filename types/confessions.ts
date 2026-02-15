export type Confession = {
    id: number
    content: string
    created_at: number
    confession_replies: ConfessionReply[]
}

export type ConfessionReply = {
    id: number
    confession_id: number
    content: string
    created_at: number
}
