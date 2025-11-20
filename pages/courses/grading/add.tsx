import { departments } from '@/config/departments'
import { getMetaConfig } from '@/config/meta'
import CourseGradingForm, {
    CourseGradingFormData,
} from '@/forms/CourseGradingForm'
import AddPageLayout from '@/layout/AddPage'
import axiosInstance from '@/utils/axiosCache'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const getStaticProps: GetStaticProps = async () => {
    const depts: string[] = Object.values(departments)
        .flatMap((code: string) => code.split('/'))
        .map((code) => code.trim())
        .filter((code) => code.length > 0)

    return {
        props: {
            depts,
        },
    }
}

export default function AddGrading({ depts }: { depts: string[] }) {
    const [isLoading, setIsLoading] = useState(false)
    const [defaultValues, setDefaultValues] = useState<
        Partial<CourseGradingFormData>
    >({})
    const [resetTrigger, setResetTrigger] = useState(0)

    const filterDepartmentCodes = (course: string): string[] => {
        let values: string[] = []
        if (course !== '') {
            const allowed = course.split(' ')[0]
            values = depts.filter((code) => allowed.includes(code))
            if (values.length == 1) {
                values = []
            }
        }
        values.push('ALL')
        return values
    }

    const handleSubmit = async (
        data: CourseGradingFormData,
        parsedData: string
    ) => {
        if (!parsedData || parsedData.trim() === '') {
            toast.error('Please ensure the grading data is not empty!')
            return
        }

        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/grading/add',
                {
                    course: data.course,
                    dept: data.dept,
                    prof: data.prof,
                    sem: data.semester,
                    data: parsedData,
                    average_mark: parseFloat(data.averageMark || '0'),
                }
            )

            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success('Grading data added successfully! Thank you!')

                setDefaultValues({})
                setResetTrigger((prev) => prev + 1)

                localStorage.removeItem('h4u_grading_course')
                localStorage.removeItem('h4u_grading_prof')
            }
        } catch (error) {
            toast.error('An error occurred while submitting the data')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        const savedCourse = localStorage.getItem('h4u_grading_course')
        const savedProf = localStorage.getItem('h4u_grading_prof')
        if (savedCourse || savedProf) {
            setDefaultValues({
                course: savedCourse || '',
                prof: savedProf || '',
            })
        }
    }, [])

    return (
        <AddPageLayout
            title="Course Grading"
            metaConfig={getMetaConfig('courses/grading')}
            containerId="addGrading"
        >
            <CourseGradingForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                defaultValues={defaultValues}
                depts={depts}
                filterDepartmentCodes={filterDepartmentCodes}
                resetTrigger={resetTrigger}
            />
        </AddPageLayout>
    )
}
