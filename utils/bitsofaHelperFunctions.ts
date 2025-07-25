import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkParseFrontmatter from "remark-parse-frontmatter";

import { Post } from "@/types/Post";

export async function convertGDriveDataToPost(fileContent: string, slug: string | null = null): Promise<Post> {

    const processedContent = await remark()
        .use(remarkFrontmatter)
        .use(remarkParseFrontmatter)
        .process(fileContent)

    const frontmatter =
        (processedContent.data as any).frontmatter || {}

    const postContent = fileContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    
    const postSlug = slug || frontmatter.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''

    return {
        slug: postSlug,
        title: frontmatter.title || '',
        author: frontmatter.author || '',
        date: frontmatter.date || '',
        content: String(postContent),
        tags: frontmatter.tags || [],
    }

}