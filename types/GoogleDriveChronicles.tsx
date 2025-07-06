export interface GoogleDriveFile {
    id: string
    name: string
    size?: string
    createdTime: string
    downloadUrl: string
}

export interface PlacementChroniclesByCampus {
    [campus: string]: GoogleDriveFile[]
}

export interface SIChroniclesByCampus {
    [campus: string]: GoogleDriveFile[]
}

export interface PSChronicles {
    ps1: GoogleDriveFile[]
    ps2: GoogleDriveFile[]
}

export interface GoogleDriveChroniclesResponse {
    message: string
    data: PlacementChroniclesByCampus
    error: boolean
}

export interface SIChroniclesResponse {
    message: string
    data: SIChroniclesByCampus
    error: boolean
}

export interface PSChroniclesResponse {
    message: string
    data: PSChronicles
    error: boolean
} 