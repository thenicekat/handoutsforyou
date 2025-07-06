import type { NextApiRequest, NextApiResponse } from 'next'
import { googleDriveService } from '@/utils/googleDrive'
import { validateAPISession } from '@/pages/api/auth/session'

type ResponseData = {
    message: string
    data: any
    error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const session = await validateAPISession<ResponseData>(req, res)
    if (!session) return

    try {
        // Get the Google Drive folder ID from environment variables
        const rootFolderId = process.env.GOOGLE_DRIVE_PLACEMENT_CHRONICLES_FOLDER_ID

        if (!rootFolderId) {
            res.status(500).json({
                message: 'Google Drive folder ID not configured',
                data: {},
                error: true,
            })
            return
        }

        // Fetch placement chronicles from Google Drive
        const chronicles = await googleDriveService.getPlacementChronicles(rootFolderId)

        res.status(200).json({
            message: 'success',
            data: chronicles,
            error: false,
        })
    } catch (error) {
        console.error('Error fetching placement chronicles:', error)
        res.status(500).json({
            message: 'Failed to fetch placement chronicles from Google Drive',
            data: {},
            error: true,
        })
    }
} 