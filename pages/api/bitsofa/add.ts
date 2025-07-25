import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import { googleDriveService } from '@/utils/googleDrive'

interface FormData {
    title: string
    author: string
    content: string
    tags?: string[]
}

interface ApiResponse {
    success: boolean
    message: string
    fileId?: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        })
    }

    try {
        const { title, author, content, tags = [] }: FormData = req.body

        // Validate required fields
        if (!title || !author || !content) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, author, or content'
            })
        }

        const currentDate = new Date().toISOString().split('T')[0]
        
        console.log(currentDate)

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        const markdownContent = `---
title: "${title}"
author: "${author}"
date: "${currentDate}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
---

${content}
`

        const fileName = `${slug}.md`

        const contentStream = new Readable()
        contentStream.push(markdownContent)
        contentStream.push(null)

        await googleDriveService.uploadArticle(fileName, contentStream)

        return res.status(200).json({
            success: true,
            message: 'Submission uploaded successfully'
        })

    } catch (error: any) {
        console.error('Error uploading submission: ', error)

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload submission'
        })
    }
}