export type CourseGradingFormData = {
    course: string
    dept: string
    prof: string
    semester: string
    gradingData: string
    averageMark?: string
}

export type CourseReviewFormData = {
    course: string
    prof: string
    review: string
}

export type PSReviewFormData = {
    review: string
}

export type PS1CutoffFormData = {
    idNumber: string
    yearAndSem: string
    station: string
    cgpa: number
    preference: number
    allotmentRound: string
    isPublic: boolean
}

export type PS2CutoffFormData = PS1CutoffFormData & {
    stipend: number
    offshoot: number
    offshootTotal: number
    offshootType: string
}

export type PSCutoffFormData = PS1CutoffFormData | PS2CutoffFormData

export type ResourceFormData = {
    name: string
    link: string
    createdBy: string
    category: string
}

export type ResourceType = 'course' | 'higherStudies' | 'placement' | 'general'

export type HandoutFormData = {
    course: string
    semester: string
    file: File
}

export type SICompanyFormData = {
    name: string
    roles: string
    year: string
    cgpaCutoff: string
    stipend: string
    eligibility: string
    otherDetails?: string
}

export type PlacementCTCFormData = {
    name: string
    campus: string
    academicYear: string
    base: number
    joiningBonus: number
    relocationBonus: number
    variableBonus: number
    monetaryValueOfBenefits: number
    description: string
}
