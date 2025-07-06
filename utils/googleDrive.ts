import { google } from 'googleapis'

/**
 * Google Drive service for accessing placement chronicles
 */
export class GoogleDriveService {
    private drive: any
    private auth: any

    constructor() {
        this.initializeAuth()
    }

    private initializeAuth() {
        // Use service account authentication
        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        })

        this.drive = google.drive({ version: 'v3', auth: this.auth })
    }

    /**
     * List files in a Google Drive folder
     */
    async listFiles(folderId: string): Promise<any[]> {
        try {
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, size, createdTime)',
                orderBy: 'name',
            })

            return response.data.files || []
        } catch (error) {
            console.error('Error listing files:', error)
            throw new Error('Failed to list files from Google Drive')
        }
    }

    /**
     * List folders in a Google Drive folder
     */
    async listFolders(folderId: string): Promise<any[]> {
        try {
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name, mimeType, createdTime)',
                orderBy: 'name',
            })

            return response.data.files || []
        } catch (error) {
            console.error('Error listing folders:', error)
            throw new Error('Failed to list folders from Google Drive')
        }
    }

    /**
 * Get placement chronicles organized by campus
 */
    async getPlacementChronicles(rootFolderId: string): Promise<{ [key: string]: any[] }> {
        try {
            const chronicles: { [key: string]: any[] } = {}

            // Get all campus folders
            const campusFolders = await this.listFolders(rootFolderId)

            for (const folder of campusFolders) {
                const files = await this.listFiles(folder.id)

                // Filter for PDF files (assuming chronicles are PDFs)
                const pdfFiles = files.filter(file =>
                    file.mimeType === 'application/pdf' ||
                    file.name.toLowerCase().endsWith('.pdf')
                )

                if (pdfFiles.length > 0) {
                    chronicles[folder.name] = pdfFiles.map(file => ({
                        id: file.id,
                        name: file.name,
                        size: file.size,
                        createdTime: file.createdTime,
                        downloadUrl: `https://drive.google.com/file/d/${file.id}/view`
                    }))
                }
            }

            return chronicles
        } catch (error) {
            console.error('Error getting placement chronicles:', error)
            throw new Error('Failed to get placement chronicles from Google Drive')
        }
    }

    /**
     * Get SI chronicles organized by campus
     */
    async getSIChronicles(rootFolderId: string): Promise<{ [key: string]: any[] }> {
        try {
            const chronicles: { [key: string]: any[] } = {}

            // Get all campus folders
            const campusFolders = await this.listFolders(rootFolderId)

            for (const folder of campusFolders) {
                const files = await this.listFiles(folder.id)

                // Filter for PDF files (assuming chronicles are PDFs)
                const pdfFiles = files.filter(file =>
                    file.mimeType === 'application/pdf' ||
                    file.name.toLowerCase().endsWith('.pdf')
                )

                if (pdfFiles.length > 0) {
                    chronicles[folder.name] = pdfFiles.map(file => ({
                        id: file.id,
                        name: file.name,
                        size: file.size,
                        createdTime: file.createdTime,
                        downloadUrl: `https://drive.google.com/file/d/${file.id}/view`
                    }))
                }
            }

            return chronicles
        } catch (error) {
            console.error('Error getting SI chronicles:', error)
            throw new Error('Failed to get SI chronicles from Google Drive')
        }
    }

    /**
 * Get PS chronicles with PS1 and PS2 sections
 */
    async getPSChronicles(rootFolderId: string): Promise<{ ps1: any[], ps2: any[] }> {
        try {
            const chronicles: { ps1: any[], ps2: any[] } = { ps1: [], ps2: [] }

            // Get all folders in the root PS folder
            const folders = await this.listFolders(rootFolderId)

            for (const folder of folders) {
                const files = await this.listFiles(folder.id)

                // Filter for PDF files
                const pdfFiles = files.filter(file =>
                    file.mimeType === 'application/pdf' ||
                    file.name.toLowerCase().endsWith('.pdf')
                )

                const mappedFiles = pdfFiles.map(file => ({
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    createdTime: file.createdTime,
                    downloadUrl: `https://drive.google.com/file/d/${file.id}/view`
                }))

                // Determine if it's PS1 or PS2 based on folder name
                if (folder.name.toLowerCase().includes('ps1')) {
                    chronicles.ps1 = [...chronicles.ps1, ...mappedFiles]
                } else if (folder.name.toLowerCase().includes('ps2')) {
                    chronicles.ps2 = [...chronicles.ps2, ...mappedFiles]
                }
            }

            return chronicles
        } catch (error) {
            console.error('Error getting PS chronicles:', error)
            throw new Error('Failed to get PS chronicles from Google Drive')
        }
    }

    /**
     * Get public download URL for a file
     */
    getPublicUrl(fileId: string): string {
        return `https://drive.google.com/file/d/${fileId}/view`
    }

    /**
     * Get direct download URL for a file
     */
    getDirectDownloadUrl(fileId: string): string {
        return `https://drive.google.com/uc?export=download&id=${fileId}`
    }
}

export const googleDriveService = new GoogleDriveService() 