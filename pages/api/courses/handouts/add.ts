import { getUser } from '@/pages/api/auth/[...nextauth]'
import { googleDriveService } from '@/utils/googleDrive'
import formidable, { Part } from 'formidable'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { trackContribution } from '../../contributions/track'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { email } = await getUser(req, res)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const rootFolderId = process.env.GOOGLE_DRIVE_HANDOUTS_FOLDER_ID
        if (!rootFolderId) {
            return res
                .status(500)
                .json({
                    message: 'Google Drive Handouts folder ID not configured',
                })
        }

        const form = formidable({
            maxFileSize: 25 * 1024 * 1024,
            filter: (part: Part) => !!part.mimetype,
        })

        const [fields, files] = await form.parse(req)
        const yearFolder = Array.isArray(fields.yearFolder)
            ? fields.yearFolder[0]
            : fields.yearFolder
        const file = Array.isArray(files.file) ? files.file[0] : files.file

        if (!yearFolder || !file) {
            return res.status(400).json({
                error: true,
                message: 'Year folder and file are required',
            })
        }

        const targetFolderId = await googleDriveService.findOrCreateFolder(
            yearFolder,
            rootFolderId
        )

        const fileBuffer = fs.readFileSync(file.filepath)
        const uploadedFile = await googleDriveService.uploadFile(
            file.originalFilename || file.newFilename,
            fileBuffer,
            targetFolderId,
            file.mimetype || 'application/octet-stream'
        )
        fs.unlinkSync(file.filepath)

        try {
            await trackContribution({
                email: email || 'Anonymous',
                contribution_type: 'course_handout',
            })
        } catch (e) {
            console.error('Failed to track handout contribution', e)
        }

        res.status(200).json({
            error: false,
            message: 'Handout uploaded successfully',
            data: {
                fileId: uploadedFile.id,
                fileName: uploadedFile.name,
                yearFolder,
            },
        })
    } catch (error) {
        console.error('Error uploading handout:', error)
        res.status(500).json({
            error: true,
            message: 'Failed to upload handout',
        })
    }
}
