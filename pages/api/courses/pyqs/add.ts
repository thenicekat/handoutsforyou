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
        const rootFolderId = process.env.GOOGLE_DRIVE_PYQS_FOLDER_ID

        if (!rootFolderId) {
            return res
                .status(500)
                .json({ message: 'Google Drive PYQs folder ID not configured' })
        }

        const form = formidable({
            maxFileSize: 10 * 1024 * 1024,
            filter: (part: Part) => {
                return (
                    part.mimetype === 'application/pdf' ||
                    part.mimetype === 'application/msword' ||
                    part.mimetype ===
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                    part.mimetype === 'application/vnd.ms-excel' ||
                    part.mimetype ===
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
            },
        })

        const [fields, files] = await form.parse(req)

        const course = Array.isArray(fields.course)
            ? fields.course[0]
            : fields.course
        const professor = Array.isArray(fields.professor)
            ? fields.professor[0]
            : fields.professor
        const year = Array.isArray(fields.year) ? fields.year[0] : fields.year
        const file = Array.isArray(files.file) ? files.file[0] : files.file

        if (!course || !professor || !year || !file) {
            return res.status(400).json({
                error: true,
                message: 'Course, professor, year, and file are required',
            })
        }

        const courseFolderId = await googleDriveService.findOrCreateFolder(
            course,
            rootFolderId
        )

        const pyqsFolderName = `${year} - ${professor}`
        const pyqsFolderId = await googleDriveService.findOrCreateFolder(
            pyqsFolderName,
            courseFolderId
        )

        const fileBuffer = fs.readFileSync(file.filepath)

        const uploadedFile = await googleDriveService.uploadFile(
            file.originalFilename || file.newFilename,
            fileBuffer,
            pyqsFolderId,
            file.mimetype || 'application/pdf'
        )

        fs.unlinkSync(file.filepath)

        await trackContribution({
            email: email,
            contribution_type: 'course_pyq',
        })

        res.status(200).json({
            error: false,
            message: 'PYQ uploaded successfully',
            data: {
                fileId: uploadedFile.id,
                fileName: uploadedFile.name,
                course,
                year,
            },
        })
    } catch (error) {
        console.error('Error uploading PYQ:', error)
        res.status(500).json({
            error: true,
            message: 'Failed to upload PYQ: ' + error,
        })
    }
}
