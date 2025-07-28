import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'
import remarkGfm from 'remark-gfm'

import { Post } from '@/types/Post'

export async function convertGDriveDataToPost(
    fileContent: string,
    slug: string | null = null
): Promise<Post> {
    const processedContent = await remark()
        .use(remarkFrontmatter)
        .use(remarkParseFrontmatter)
        .use(remarkGfm)
        .process(fileContent)

    const frontmatter = (processedContent.data as any).frontmatter || {}

    const postContent = fileContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')

    const postSlug =
        slug ||
        frontmatter.title
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '') ||
        ''

    return {
        slug: postSlug,
        title: frontmatter.title || '',
        authors: frontmatter.authors || [],
        date: frontmatter.date || '',
        content: String(postContent),
        tags: frontmatter.tags || [],
    }
}
