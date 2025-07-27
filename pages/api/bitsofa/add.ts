import { googleDriveService } from '@/utils/googleDrive'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import { BaseResponseData, getUser } from '../auth/[...nextauth]'

interface FormData {
    title: string
    author: string
    content: string
    tags?: string[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method not allowed',
            error: true,
        })
    }

    try {
        const { title, author, content, tags = [] }: FormData = req.body
        const { email } = (await getUser(req, res))!

        if (!title || !author || !content) {
            return res.status(400).json({
                message: 'Missing required fields: title, author, or content',
                error: true,
            })
        }

        const currentDate = new Date().toISOString().split('T')[0]

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        const markdownContent = `---
title: "${title}"
author: "${author}"
email: "${email}"
date: "${currentDate}"
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
---

${content}
`

        const fileName = `${slug}.md`

        const contentStream = new Readable()
        contentStream.push(markdownContent)
        contentStream.push(null)

        await googleDriveService.uploadArticle(fileName, contentStream)

        return res.status(200).json({
            message: 'Submission uploaded successfully',
            error: false,
        })
    } catch (error: any) {
        console.error('Error uploading submission: ', error)
        return res.status(500).json({
            message: error.message || 'Failed to upload submission',
            error: true,
        })
    }
}
