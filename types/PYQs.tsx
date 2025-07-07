export interface PYQFile {
    id: string
    name: string
    size?: string
    createdTime: string
    downloadUrl: string
}

export interface Course {
    id: string
    name: string
    mimeType: string
    createdTime: string
}

export interface PYQsByYear {
    [year: string]: PYQFile[]
}