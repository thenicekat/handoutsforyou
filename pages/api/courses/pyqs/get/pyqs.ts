import { NextApiRequest, NextApiResponse } from 'next'
import { googleDriveService } from '@/utils/googleDrive'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { courseId } = req.query

        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' })
        }

        const pyqs = await googleDriveService.getPYQsForCourse(courseId as string)

        res.status(200).json({
            error: false,
            data: pyqs,
        })
    } catch (error) {
        console.error('Error fetching PYQs:', error)
        res.status(500).json({
            error: true,
            message: 'Failed to fetch PYQs',
        })
    }
} 