// Google Drive file and chronicles types

export interface GoogleDriveFile {
    id: string
    name: string
    size?: string
    createdTime: string
    downloadUrl: string
}

export interface ChronicleMap {
    [key: string]: GoogleDriveFile[]
}

// PS Chronicles
export interface GoogleDrivePSChronicles {
    ps1: GoogleDriveFile[]
    ps2: GoogleDriveFile[]
}

export interface PSChroniclesResponse {
    message: string
    data: GoogleDrivePSChronicles
    error: boolean
}

// Placement Chronicles
export interface PlacementChroniclesByCampus {
    [campus: string]: GoogleDriveFile[]
}

export interface GoogleDriveChroniclesResponse {
    message: string
    data: PlacementChroniclesByCampus
    error: boolean
}

// SI Chronicles
export interface SIChroniclesByCampus {
    [campus: string]: GoogleDriveFile[]
}

export interface SIChroniclesResponse {
    message: string
    data: SIChroniclesByCampus
    error: boolean
}
