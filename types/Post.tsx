export type Post = {
    slug: string
    title: string
    author: string
    date: string
    content: string
    tags: string[]
}

export interface PostPageProps {
    post: Post | null
}
