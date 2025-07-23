import { googleDriveService } from '@/utils/googleDrive'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const rootFolderId = process.env.GOOGLE_DRIVE_PYQS_FOLDER_ID

        if (!rootFolderId) {
            return res
                .status(500)
                .json({ message: 'Google Drive PYQs folder ID not configured' })
        }

        const pyqs = await googleDriveService.listFolders(rootFolderId)

        res.status(200).json({
            error: false,
            data: pyqs,
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Failed to fetch PYQs: ' + error,
        })
    }
}
