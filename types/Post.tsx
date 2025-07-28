export type Post = {
    slug: string
    title: string
    authors: string[]
    email: string
    date: string
    content: string
    tags: string[]
}

export interface PostPageProps {
    post: Post | null
}
