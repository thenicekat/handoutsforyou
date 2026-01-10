export type Professor = {
    name: string
    chamber: string
}

export type FaqModel = {
    question: string
    answer: string
}

export interface MenuProps {
    doNotShowMenu?: boolean
}

export type HandoutsPerYearProps = {
    handouts: any
    semester: any
    searchWord: string
}

export type Resource = {
    id: number
    name: string
    link: string
    created_by: string
    score: number
    category: string
}

export interface ResourceByCategory {
    [key: string]: Resource[]
}

export interface MetaConfig {
    title: string
    description: string
    keywords: string[]
    openGraph?: {
        title?: string
        description?: string
        image?: string
        url?: string
    }
}

export type DeptType = {
    [key: string]: string
}
