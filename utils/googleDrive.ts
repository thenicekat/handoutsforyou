import { Post } from '@/config/post'
import { google } from 'googleapis'
import { drive_v3 } from 'googleapis/build/src/apis/drive/v3'
import { Readable } from 'stream'

import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParseFrontmatter from 'remark-parse-frontmatter'

interface DriveFile {
    id: string
    name: string
    size?: string | number
    createdTime: string
    downloadUrl: string
    publicUrl?: string
}

interface ChronicleMap {
    [key: string]: DriveFile[]
}

interface PSChronicles {
    ps1: DriveFile[]
    ps2: DriveFile[]
}

export class GoogleDriveService {
    private drive!: drive_v3.Drive
    private auth: any
    private readonly BATCH_SIZE = 1000

    constructor() {
        this.initializeAuth()
    }

    private initializeAuth() {
        try {
            const privateKey =
                process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
                    /\\n/g,
                    '\n'
                )
            if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
                throw new Error('Missing required Google Drive credentials')
            }

            this.auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: privateKey,
                },
                scopes: ['https://www.googleapis.com/auth/drive'],
            })

            this.drive = google.drive({ version: 'v3', auth: this.auth })
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
                campusFolders.map(async (folder) => {
                    if (!folder.id) return

                    const files = await this.listFiles(folder.id)
                    const pdfFiles = files.filter(
                        (file) =>
                            file.mimeType === 'application/pdf' ||
                            (file.name &&
                                file.name.toLowerCase().endsWith('.pdf'))
                    )

                    if (pdfFiles.length > 0 && folder.name) {
                        chronicles[folder.name] = pdfFiles
                            .filter((file) => file.id)
                            .map((file) => this.mapFileToDriveFile(file))
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
    async getPSChronicles(rootFolderId: string): Promise<PSChronicles> {
        try {
            const chronicles: PSChronicles = { ps1: [], ps2: [] }
            const folders = await this.listFolders(rootFolderId)

            await Promise.all(
                folders.map(async (folder) => {
                    if (!folder.id || !folder.name) return

                    const files = await this.listFiles(folder.id)
                    const pdfFiles = files
                        .filter(
                            (file) =>
                                file.mimeType === 'application/pdf' ||
                                (file.name &&
                                    file.name.toLowerCase().endsWith('.pdf'))
                        )
                        .map((file) => this.mapFileToDriveFile(file))

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
                semesterFolders.map(async (folder) => {
                    if (!folder.id || !folder.name) return

                    const files = await this.listFiles(folder.id)
                    if (files.length > 0) {
                        handouts[folder.name] = files
                            .filter((file) => file.id)
                            .map((file) => ({
                                ...this.mapFileToDriveFile(file),
                                publicUrl: this.getPublicUrl(file.id!),
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

                        const rawContent = content.data as string

                        // Parse markdown with frontmatter using remark
                        const processedContent = await remark()
                            .use(remarkFrontmatter)
                            .use(remarkParseFrontmatter)
                            .use(remarkHtml)
                            .process(rawContent)

                        const frontmatter = (processedContent.data as any).frontmatter || {}

                        const slug = frontmatter.slug || file.name.replace(/\.(md|txt)$/i, '').replace(/\s+/g, '-').toLowerCase()
                        
                        articles.push({
                            slug,
                            title: frontmatter.title || file.name.replace(/\.(md|txt)$/i, ''),
                            author: frontmatter.author || 'Anonymous',
                            date: frontmatter.date || file.createdTime?.split('T')[0] || new Date().toISOString().split('T')[0],
                            content: String(processedContent),
                            tags: frontmatter.tags || frontmatter.categories || [],
                        })
                    } catch (error) {
                        console.error(`Error processing file ${file.name}:`, error)
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
            const articles = await this.getArticles(process.env.GOOGLE_DRIVE_BITS_OF_ADVICE_FOLDER_ID || '');
            return articles.find(article => article.slug === slug) || null;
        } catch (error) {
            console.error(`Error fetching article with slug "${slug}":`, error);
            return null;
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
                yearFolders.map(async (yearFolder) => {
                    if (!yearFolder.id || !yearFolder.name) return

                    const files = await this.listFiles(yearFolder.id)
                    if (files.length > 0) {
                        yearMapping[yearFolder.name] = files
                            .filter((file) => file.id)
                            .map((file) => this.mapFileToDriveFile(file))
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
    ): Promise<DriveFile> {
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
     * Find or create year folder and transfer ownership
     */
    async findOrCreateFolder(
        folderName: string,
        parentFolderId: string
    ): Promise<string> {
        try {
            const folders = await this.listFolders(parentFolderId)
            const existingFolder = folders.find(
                (folder) =>
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

            await this.transferOwnership(newFolder.id)
            return newFolder.id
        } catch (error) {
            throw new Error(
                `Failed to find or create folder: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }

    /**
     * Helper method to transfer ownership of a file/folder
     */
    private async transferOwnership(fileId: string): Promise<void> {
        const permissionMetadata = {
            type: 'user',
            role: 'owner',
            emailAddress: 'oopsieshoppingapp@gmail.com',
        }

        await this.drive.permissions.create({
            fileId,
            requestBody: permissionMetadata,
            fields: 'id',
            transferOwnership: true,
            supportsAllDrives: true,
        })
    }

    /**
     * Helper method to map Drive file to DriveFile interface
     */
    private mapFileToDriveFile(file: drive_v3.Schema$File): DriveFile {
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
