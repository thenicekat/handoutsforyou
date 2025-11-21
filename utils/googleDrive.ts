import { Post } from '@/types/Post'
import { google } from 'googleapis'
import { drive_v3 } from 'googleapis/build/src/apis/drive/v3'
import { Readable } from 'stream'

import {
    ChronicleMap,
    GoogleDriveFile,
    GoogleDrivePSChronicles,
} from '@/types/GoogleDriveChronicles'
import { convertGDriveDataToPost } from './bitsofaHelperFunctions'

export class GoogleDriveService {
    private drive!: drive_v3.Drive
    private auth: any
    private readonly BATCH_SIZE = 1000
    private initialized = false

    private async initializeAuth() {
        if (this.initialized) return
        try {
            const {
                GOOGLE_DRIVE_CLIENT_ID,
                GOOGLE_DRIVE_CLIENT_SECRET,
                GOOGLE_DRIVE_REFRESH_TOKEN,
            } = process.env
            if (!GOOGLE_DRIVE_CLIENT_ID) {
                throw new Error('GOOGLE_DRIVE_CLIENT_ID is not set')
            }
            if (!GOOGLE_DRIVE_CLIENT_SECRET) {
                throw new Error('GOOGLE_DRIVE_CLIENT_SECRET is not set')
            }
            if (!GOOGLE_DRIVE_REFRESH_TOKEN) {
                throw new Error('GOOGLE_DRIVE_REFRESH_TOKEN is not set')
            }

            const oAuth2Client = new google.auth.OAuth2(
                GOOGLE_DRIVE_CLIENT_ID,
                GOOGLE_DRIVE_CLIENT_SECRET
            )
            oAuth2Client.setCredentials({
                refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN,
            })
            this.auth = oAuth2Client

            this.drive = google.drive({ version: 'v3', auth: this.auth })
            this.initialized = true
        } catch (error) {
            throw new Error(
                `Failed to initialize Google Drive auth: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * List files in a Google Drive folder with pagination support
     */
    async listFiles(folderId: string): Promise<drive_v3.Schema$File[]> {
        await this.initializeAuth()
        try {
            const allFiles: drive_v3.Schema$File[] = []
            let pageToken: string | undefined = undefined

            do {
                const response: any = await this.drive.files.list({
                    q: `'${folderId}' in parents and trashed = false`,
                    fields: 'nextPageToken, files(id, name, mimeType, size, createdTime)',
                    orderBy: 'name',
                    supportsAllDrives: true,
                    includeItemsFromAllDrives: true,
                    pageSize: this.BATCH_SIZE,
                    pageToken,
                })

                const files = response.data.files || []
                allFiles.push(...files)
                pageToken = response.data.nextPageToken || undefined
            } while (pageToken)

            return allFiles
        } catch (error) {
            throw new Error(
                `Failed to list files from Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * List folders in a Google Drive folder
     */
    async listFolders(folderId: string): Promise<drive_v3.Schema$File[]> {
        await this.initializeAuth()
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
            throw new Error(
                `Failed to list folders from Google Drive: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Generic method to get chronicles by type
     */
    private async getChroniclesByType(
        rootFolderId: string,
        type: 'placement' | 'si'
    ): Promise<ChronicleMap> {
        try {
            const chronicles: ChronicleMap = {}
            const campusFolders = await this.listFolders(rootFolderId)

            await Promise.all(
                campusFolders.map(async folder => {
                    if (!folder.id) return

                    const files = await this.listFiles(folder.id)
                    const pdfFiles = files.filter(
                        file =>
                            file.mimeType === 'application/pdf' ||
                            (file.name &&
                                file.name.toLowerCase().endsWith('.pdf'))
                    )

                    if (pdfFiles.length > 0 && folder.name) {
                        chronicles[folder.name] = pdfFiles
                            .filter(file => file.id)
                            .map(file => this.mapFileToDriveFile(file))
                    }
                })
            )

            return chronicles
        } catch (error) {
            throw new Error(
                `Failed to get ${type} chronicles: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Get placement chronicles organized by campus
     */
    async getPlacementChronicles(rootFolderId: string): Promise<ChronicleMap> {
        return this.getChroniclesByType(rootFolderId, 'placement')
    }

    /**
     * Get SI chronicles organized by campus
     */
    async getSIChronicles(rootFolderId: string): Promise<ChronicleMap> {
        return this.getChroniclesByType(rootFolderId, 'si')
    }

    /**
     * Get PS chronicles with PS1 and PS2 sections
     */
    async getPSChronicles(
        rootFolderId: string
    ): Promise<GoogleDrivePSChronicles> {
        try {
            const chronicles: GoogleDrivePSChronicles = { ps1: [], ps2: [] }
            const folders = await this.listFolders(rootFolderId)

            await Promise.all(
                folders.map(async folder => {
                    if (!folder.id || !folder.name) return

                    const files = await this.listFiles(folder.id)
                    const pdfFiles = files
                        .filter(
                            file =>
                                file.mimeType === 'application/pdf' ||
                                (file.name &&
                                    file.name.toLowerCase().endsWith('.pdf'))
                        )
                        .map(file => this.mapFileToDriveFile(file))

                    if (folder.name.toLowerCase().includes('ps1')) {
                        chronicles.ps1.push(...pdfFiles)
                    } else if (folder.name.toLowerCase().includes('ps2')) {
                        chronicles.ps2.push(...pdfFiles)
                    }
                })
            )

            return chronicles
        } catch (error) {
            throw new Error(
                `Failed to get PS chronicles: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Get handouts organized by semester/year folders
     */
    async getHandouts(rootFolderId: string): Promise<ChronicleMap> {
        try {
            const handouts: ChronicleMap = {}
            const semesterFolders = await this.listFolders(rootFolderId)

            await Promise.all(
                semesterFolders.map(async folder => {
                    if (!folder.id || !folder.name) return

                    const files = await this.listFiles(folder.id)
                    if (files.length > 0) {
                        handouts[folder.name] = files
                            .filter(file => file.id)
                            .map(file => ({
                                ...this.mapFileToDriveFile(file),
                            }))
                    }
                })
            )

            return handouts
        } catch (error) {
            throw new Error(
                `Failed to get handouts: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Get all articles
     */
    async getArticles(rootFolderId: string): Promise<Post[]> {
        try {
            const articles: Post[] = []

            const files = await this.listFiles(rootFolderId)

            for (const file of files) {
                if (file.id && file.name) {
                    try {
                        const content = await this.drive.files.get({
                            fileId: file.id,
                            alt: 'media',
                        })

                        if (!content.data) continue

                        const post: Post = await convertGDriveDataToPost(
                            content.data as string
                        )

                        articles.push(post)
                    } catch (error) {
                        console.error(
                            `Error processing file ${file.name}:`,
                            error
                        )
                        continue
                    }
                }
            }

            return articles
        } catch (error) {
            throw new Error(
                `Failed to get articles: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    async getArticle(slug: string): Promise<Post | null> {
        try {
            await this.initializeAuth()
            const { GOOGLE_DRIVE_BITSOFA_FOLDER_ID } = process.env

            if (!GOOGLE_DRIVE_BITSOFA_FOLDER_ID) {
                throw new Error('GOOGLE_DRIVE_BITSOFA_FOLDER_ID is not set')
            }

            const fileName = `${slug}.md`
            const response = await this.drive.files.list({
                q: `'${GOOGLE_DRIVE_BITSOFA_FOLDER_ID}' in parents and name = '${fileName}' and trashed = false`,
                fields: 'files(id, name)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            })

            const files = response.data.files || []

            if (files.length === 0) {
                return null
            }

            const file = files[0]

            if (!file.id) {
                return null
            }

            const content = await this.drive.files.get({
                fileId: file.id,
                alt: 'media',
            })

            if (!content.data) {
                return null
            }

            return await convertGDriveDataToPost(content.data as string, slug)
        } catch (error) {
            console.error(`Error fetching article with slug "${slug}":`, error)
            return null
        }
    }

    async uploadArticle(
        fileName: string,
        contentStream: Readable
    ): Promise<GoogleDriveFile> {
        await this.initializeAuth()

        try {
            const { GOOGLE_DRIVE_BITSOFA_FOLDER_ID } = process.env

            if (!GOOGLE_DRIVE_BITSOFA_FOLDER_ID) {
                throw new Error('GOOGLE_DRIVE_BITSOFA_FOLDER_ID is not set')
            }

            const fileMetadata = {
                name: fileName,
                mimeType: 'text/markdown',
                parents: [process.env.GOOGLE_DRIVE_BITSOFA_FOLDER_ID!],
            }

            const media = {
                mimeType: 'text/markdown',
                body: contentStream,
            }

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media,
                fields: 'id, name, mimeType, size, createdTime',
                supportsAllDrives: true,
                enforceSingleParent: true,
            })

            return this.mapFileToDriveFile(response.data)
        } catch (error) {
            throw new Error(
                `Failed to upload article: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Get all PYQs in a course folder
     */
    async getPYQsForCourse(courseFolderId: string): Promise<ChronicleMap> {
        try {
            const yearFolders = await this.listFolders(courseFolderId)
            const yearMapping: ChronicleMap = {}

            await Promise.all(
                yearFolders.map(async yearFolder => {
                    if (!yearFolder.id || !yearFolder.name) return

                    const files = await this.listFiles(yearFolder.id)
                    if (files.length > 0) {
                        yearMapping[yearFolder.name] = files
                            .filter(file => file.id)
                            .map(file => this.mapFileToDriveFile(file))
                    }
                })
            )

            return yearMapping
        } catch (error) {
            throw new Error(
                `Failed to get PYQs: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Upload file to Google Drive
     */
    async uploadFile(
        fileName: string,
        fileBuffer: Buffer,
        parentFolderId: string,
        mimeType: string
    ): Promise<GoogleDriveFile> {
        await this.initializeAuth()
        try {
            const fileStream = new Readable()
            fileStream.push(fileBuffer)
            fileStream.push(null)

            const fileMetadata = {
                name: fileName,
                parents: [parentFolderId],
            }

            const media = {
                mimeType,
                body: fileStream,
            }

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media,
                fields: 'id, name, mimeType, size, createdTime',
                supportsAllDrives: true,
                enforceSingleParent: true,
            })

            return this.mapFileToDriveFile(response.data)
        } catch (error) {
            throw new Error(
                `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Create folder in Google Drive
     */
    async createFolder(
        folderName: string,
        parentFolderId: string
    ): Promise<drive_v3.Schema$File> {
        await this.initializeAuth()
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
            throw new Error(
                `Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Find or create year folder
     */
    async findOrCreateFolder(
        folderName: string,
        parentFolderId: string
    ): Promise<string> {
        try {
            const folders = await this.listFolders(parentFolderId)
            const existingFolder = folders.find(
                folder =>
                    folder.name?.toLowerCase() === folderName.toLowerCase()
            )

            if (existingFolder?.id) {
                return existingFolder.id
            }

            const newFolder = await this.createFolder(
                folderName,
                parentFolderId
            )
            if (!newFolder.id) {
                throw new Error('Failed to create new folder - no ID returned')
            }

            return newFolder.id
        } catch (error) {
            throw new Error(
                `Failed to find or create folder: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Helper method to map Drive file to DriveFile interface
     */
    private mapFileToDriveFile(file: drive_v3.Schema$File): GoogleDriveFile {
        if (!file.id) {
            throw new Error('Invalid file object - missing ID')
        }

        return {
            id: file.id,
            name: file.name || 'Unnamed File',
            size: file.size || undefined,
            createdTime: file.createdTime || new Date().toISOString(),
            downloadUrl: this.getDirectDownloadUrl(file.id),
        }
    }

    /**
     * Get public URL for a file
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
