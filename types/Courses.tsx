export type CourseGradeRow = {
    grade: string
    numberOfStudents: number
    minMarks?: number
    maxMarks?: number
}
export type CourseGrading = {
    id: string
    course: string
    dept: string
    sem: string
    prof: string
    created_by: string
    data: string
    average_mark: number
}

export type CourseReview = {
    course: string
    prof: string
    review: string
    created_at: string
}

export type CoursePreReq = {
    prereq_name: string
    pre_cop: string
}
export type CoursePreReqGroup = {
    name: string
    all_one: string
    prereqs: CoursePreReq[]
}

export interface CoursePYQFile {
    id: string
    name: string
    size?: string
    createdTime: string
    downloadUrl: string
}

export interface CourseDetails {
    id: string
    name: string
    mimeType: string
    createdTime: string
}

export interface CoursePYQsByYear {
    [year: string]: CoursePYQFile[]
}
