import { google } from 'googleapis'

export class GoogleDriveService {
    private drive: any
    private auth: any

    constructor() {
        this.initializeAuth()
    }

    private initializeAuth() {
        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
            ],
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
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
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
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
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
                        downloadUrl: this.getDirectDownloadUrl(file.id)
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
                        downloadUrl: this.getDirectDownloadUrl(file.id)
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
                    downloadUrl: this.getDirectDownloadUrl(file.id)
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
     * Get handouts organized by semester/year folders
     */
    async getHandouts(rootFolderId: string): Promise<{ [key: string]: any[] }> {
        try {
            const handouts: { [key: string]: any[] } = {}

            // Get all semester/year folders
            const semesterFolders = await this.listFolders(rootFolderId)

            for (const folder of semesterFolders) {
                const files = await this.listFiles(folder.id)

                // Filter for PDF files (assuming handouts are PDFs)
                const pdfFiles = files.filter(file =>
                    file.mimeType === 'application/pdf' ||
                    file.name.toLowerCase().endsWith('.pdf')
                )

                if (pdfFiles.length > 0) {
                    handouts[folder.name] = pdfFiles.map(file => ({
                        id: file.id,
                        name: file.name,
                        size: file.size,
                        createdTime: file.createdTime,
                        downloadUrl: this.getDirectDownloadUrl(file.id),
                        publicUrl: this.getPublicUrl(file.id)
                    }))
                }
            }

            return handouts
        } catch (error) {
            console.error('Error getting handouts:', error)
            throw new Error('Failed to get handouts from Google Drive')
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

    /**
     * Get all PYQs in a course folder
     */
    async getPYQsForCourse(courseFolderId: string): Promise<{ [key: string]: any[] }> {
        try {
            const yearFolders = await this.listFolders(courseFolderId)
            let yearMapping: { [key: string]: any[] } = {}

            if (yearFolders.length > 0) {
                for (const yearFolder of yearFolders) {
                    const files = await this.listFiles(yearFolder.id)

                    if (files.length > 0) {
                        yearMapping[yearFolder.name] = files.map(file => ({
                            id: file.id,
                            name: file.name,
                            size: file.size,
                            createdTime: file.createdTime,
                            downloadUrl: this.getDirectDownloadUrl(file.id),
                        }))
                    }
                }
            }

            return yearMapping
        } catch (error) {
            console.error('Error getting PYQs:', error)
            throw new Error('Failed to get PYQs from Google Drive')
        }
    }

    /**
     * Upload file to Google Drive
     */
    async uploadFile(fileName: string, fileBuffer: Buffer, parentFolderId: string, mimeType: string): Promise<any> {
        try {
            const { Readable } = require('stream')
            const fileStream = new Readable()
            fileStream.push(fileBuffer)
            fileStream.push(null)

            // Create file metadata
            const fileMetadata = {
                name: fileName,
                parents: [parentFolderId],
            }

            // Set up the upload
            const media = {
                mimeType: mimeType,
                body: fileStream,
            }

            // Create the file with specific parameters for shared drives
            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id, name, mimeType, size, createdTime',
                supportsAllDrives: true,
                enforceSingleParent: true,
            })

            return {
                id: response.data.id,
                name: response.data.name,
                size: response.data.size,
                createdTime: response.data.createdTime,
                downloadUrl: this.getDirectDownloadUrl(response.data.id),
            }
        } catch (error: any) {
            console.error('Error uploading file:', error)
            const errorMessage = error.message || 'Unknown error'
            throw new Error(`Failed to upload file to Google Drive: ${errorMessage}.`)
        }
    }

    /**
     * Create folder in Google Drive
     */
    async createFolder(folderName: string, parentFolderId: string): Promise<any> {
        try {
            const response = await this.drive.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentFolderId],
                },
                supportsAllDrives: true,
            })

            return response.data
        } catch (error) {
            console.error('Error creating folder:', error)
            throw new Error('Failed to create folder in Google Drive')
        }
    }

    /**
     * Find or create year folder
     */
    async findOrCreateFolder(folderName: string, parentFolderId: string): Promise<string> {
        try {
            const folders = await this.listFolders(parentFolderId)
            const existingFolder = folders.find(folder => folder.name.toLowerCase() === folderName.toLowerCase())

            if (existingFolder) {
                return existingFolder.id
            }

            const newFolder = await this.createFolder(folderName, parentFolderId)
            const permissionMetadata = {
                type: "user",
                role: "owner",
                emailAddress: "oopsieshoppingapp@gmail.com",
            };
            const permissionResponse = await this.drive.permissions.create({
                fileId: newFolder.id,
                requestBody: permissionMetadata,
                fields: "id",
                transferOwnership: true,
                supportsAllDrives: true,
            });
            return newFolder.id
        } catch (error) {
            throw new Error('Failed to find or create folder: ' + error)
        }
    }
}

export const googleDriveService = new GoogleDriveService() 