export type GradeRow = {
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
