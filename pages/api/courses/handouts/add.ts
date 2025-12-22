import { pyqYears } from '@/config/years_sems'
import { BaseResponseData, getUser } from '@/pages/api/auth/[...nextauth]'
import { googleDriveService } from '@/utils/googleDrive'
import formidable, { Part } from 'formidable'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { trackContribution } from '../../contributions/track'

export const config = {
    api: {
        bodyParser: false,
    },
}

const ALLOWLIST_SEMESTERS = pyqYears.slice(0, 2)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BaseResponseData>
) {
    const { email } = await getUser(req, res)
    if (req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method not allowed',
            error: true,
        })
    }

    try {
        const rootFolderId = process.env.GOOGLE_DRIVE_HANDOUTS_FOLDER_ID

        if (!rootFolderId) {
            return res.status(500).json({
                message: 'Google Drive handouts folder ID not configured',
                error: true,
            })
        }

        const form = formidable({
            maxFileSize: 10 * 1024 * 1024,
            filter: (part: Part) => {
                return (
                    part.mimetype === 'application/pdf' ||
                    part.mimetype === 'application/msword' ||
                    part.mimetype ===
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                )
            },
        })

        const [fields, files] = await form.parse(req)

        const course = Array.isArray(fields.course)
            ? fields.course[0]
            : fields.course
        const semester = Array.isArray(fields.semester)
            ? fields.semester[0]
            : fields.semester
        const file = Array.isArray(files.file) ? files.file[0] : files.file

        if (!course || !semester || !file) {
            return res.status(400).json({
                error: true,
                message: 'Course, semester, and file are required',
            })
        }
        if (!ALLOWLIST_SEMESTERS.includes(semester)) {
            return res.status(400).json({
                error: true,
                message: 'Uploading handouts for this semester is not allowed.',
            })
        }

        const semesterFolderId = await googleDriveService.findOrCreateFolder(
            semester,
            rootFolderId
        )
        const existingFiles =
            await googleDriveService.listFiles(semesterFolderId)
        if (existingFiles.length > 0) {
            const existingFile = existingFiles.find(file =>
                file.name?.startsWith(course + ' handout')
            )
            if (existingFile) {
                return res.status(400).json({
                    error: true,
                    message: 'File already exists in the semester.',
                })
            }
        }

        const fileBuffer = fs.readFileSync(file.filepath)
        const fileExtension = file.originalFilename?.split('.').pop() || 'pdf'

        const uploadedFile = await googleDriveService.uploadFile(
            course + ' handout.' + fileExtension,
            fileBuffer,
            semesterFolderId,
            file.mimetype || 'application/pdf'
        )

        fs.unlinkSync(file.filepath)

        await trackContribution({
            email: email,
            contribution_type: 'course_handout',
        })

        res.status(200).json({
            error: false,
            message: 'Handout uploaded successfully',
            data: {
                fileId: uploadedFile.id,
                fileName: uploadedFile.name,
                course,
                semester,
            },
        })
    } catch (error) {
        console.error('Error uploading handout:', error)
        res.status(500).json({
            error: true,
            message: 'Failed to upload handout: ' + error,
        })
    }
}
