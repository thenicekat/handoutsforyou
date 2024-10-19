export type GradeData = {
    min?: number;
    max?: number;
    num?: number;
}

export type CourseGrading = {
    id: string;
    course: string;
    sem: string;
    prof: string;
    A: GradeData;
    Am: GradeData;
    B: GradeData;
    Bm: GradeData;
    C: GradeData;
    Cm: GradeData;
    D: GradeData;
    E: GradeData;
    W: GradeData;
    I: GradeData;
    created_by: string;
}

