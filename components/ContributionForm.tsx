import { departments } from '@/config/departments'
import CourseGradingForm, {
    CourseGradingFormData,
} from '@/forms/CourseGradingForm'
import CourseReviewForm, {
    CourseReviewFormData,
} from '@/forms/CourseReviewForm'
import { FormField } from '@/forms/FormComponents'
import PlacementCTCForm, {
    PlacementCTCFormData,
} from '@/forms/PlacementCTCForm'
import PSCutoffForm, { PSCutoffFormData } from '@/forms/PSCutoffForm'
import ResourceForm, { ResourceFormData } from '@/forms/ResourceForm'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

const COURSE_RESOURCE = 'course_resource'
const COURSE_REVIEW = 'course_review'
const COURSE_GRADING = 'course_grading'
const PS1_CUTOFF = 'ps1_cutoff'
const PS2_CUTOFF = 'ps2_cutoff'
const PLACEMENT_RESOURCE = 'placement_resource'
const PLACEMENT_CTC = 'placement_ctc'
const HIGHERSTUDIES_RESOURCE = 'higherstudies_resource'

type ContributionType =
    | typeof COURSE_RESOURCE
    | typeof COURSE_REVIEW
    | typeof COURSE_GRADING
    | typeof PS1_CUTOFF
    | typeof PS2_CUTOFF
    | typeof PLACEMENT_RESOURCE
    | typeof PLACEMENT_CTC
    | typeof HIGHERSTUDIES_RESOURCE

interface ContributionFormProps {
    onContributionAdded?: () => void
}

export default function ContributionForm({
    onContributionAdded,
}: ContributionFormProps) {
    const [contributionType, setContributionType] =
        useState<ContributionType>(COURSE_RESOURCE)
    const [isLoading, setIsLoading] = useState(false)

    const depts = useMemo(() => {
        return Object.values(departments)
            .flatMap((code: string) => code.split('/'))
            .map((code) => code.trim())
            .filter((code) => code.length > 0)
    }, [])

    const filterDepartmentCodes = (course: string): string[] => {
        let values: string[] = []
        if (course !== '') {
            const allowed = course.split(' ')[0]
            values = depts.filter((code) => allowed.includes(code))
            if (values.length === 1) {
                values = []
            }
        }
        values.push('ALL')
        return values
    }

    const handleCourseResourceSubmit = async (data: ResourceFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/resources/add', {
                method: 'POST',
                body: JSON.stringify({
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your course resource was added successfully!'
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handlePlacementResourceSubmit = async (data: ResourceFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/zob/resources/add', {
                method: 'POST',
                body: JSON.stringify({
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your placement resource was added successfully!'
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handleHigherStudiesResourceSubmit = async (
        data: ResourceFormData
    ) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/higherstudies/resources/add', {
                method: 'POST',
                body: JSON.stringify({
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your higher studies resource was added successfully!'
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handlePlacementCTCSubmit = async (
        data: PlacementCTCFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/zob/ctcs/add', {
                method: 'POST',
                body: JSON.stringify({
                    company: data.name,
                    campus: data.campus,
                    academicYear: data.academicYear,
                    base: data.base,
                    joiningBonus: data.joiningBonus,
                    relocationBonus: data.relocationBonus,
                    variableBonus: data.variableBonus,
                    monetaryValueOfBenefits: data.monetaryValueOfBenefits,
                    description: data.description,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your placement CTC was added successfully!'
                )
                reset()
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handleCourseReviewSubmit = async (data: CourseReviewFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/reviews/add', {
                method: 'POST',
                body: JSON.stringify({
                    course: data.course,
                    prof: data.prof,
                    review: data.review,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your course review was added successfully!'
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handleCourseGradingSubmit = async (data: CourseGradingFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/courses/grading/add', {
                method: 'POST',
                body: JSON.stringify({
                    course: data.course,
                    dept: data.dept,
                    sem: data.semester,
                    prof: data.prof,
                    data: data.gradingData,
                    average_mark: data.averageMark,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    'Thank you! Your course grading data was added successfully!'
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const handlePSCutoffSubmit = async (data: PSCutoffFormData) => {
        setIsLoading(true)
        try {
            const payload = {
                typeOfPS: contributionType === PS1_CUTOFF ? 'ps1' : 'ps2',
                idNumber: data.idNumber,
                yearAndSem: data.yearAndSem,
                station: data.station,
                cgpa: data.cgpa,
                preference: data.preference,
                allotmentRound: data.allotmentRound,
                public: data.isPublic ? 1 : 0,
                ...(contributionType === PS2_CUTOFF && 'stipend' in data
                    ? {
                          stipend: data.stipend,
                          offshoot: data.offshoot,
                          offshootTotal: data.offshootTotal,
                          offshootType: data.offshootType,
                      }
                    : {}),
            }

            const res = await fetch('/api/ps/cutoffs/add', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await res.json()
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(
                    `Thank you! Your ${contributionType === PS1_CUTOFF ? 'PS1' : 'PS2'} cutoff was added successfully!`
                )
                onContributionAdded?.()
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        }
        setIsLoading(false)
    }

    const contributionTypes = [
        { value: COURSE_RESOURCE, label: 'Course Resource' },
        { value: COURSE_REVIEW, label: 'Course Review' },
        { value: COURSE_GRADING, label: 'Course Grading' },
        { value: PS1_CUTOFF, label: 'PS1 Cutoff' },
        { value: PS2_CUTOFF, label: 'PS2 Cutoff' },
        { value: PLACEMENT_RESOURCE, label: 'Placement Resource' },
        { value: PLACEMENT_CTC, label: 'Placement CTC' },
        { value: HIGHERSTUDIES_RESOURCE, label: 'Higher Studies Resource' },
    ]

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <FormField
                label="What would you like to contribute?"
                className="mb-6"
            >
                <select
                    value={contributionType}
                    onChange={(e) =>
                        setContributionType(e.target.value as ContributionType)
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                    {contributionTypes.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-800"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </FormField>

            {/* Course Resource Form */}
            {contributionType === COURSE_RESOURCE && (
                <ResourceForm
                    resourceType="course"
                    onSubmit={handleCourseResourceSubmit}
                    isLoading={isLoading}
                />
            )}

            {/* Placement Resource Form */}
            {contributionType === PLACEMENT_RESOURCE && (
                <ResourceForm
                    resourceType="placement"
                    onSubmit={handlePlacementResourceSubmit}
                    isLoading={isLoading}
                />
            )}

            {/* Higher Studies Resource Form */}
            {contributionType === HIGHERSTUDIES_RESOURCE && (
                <ResourceForm
                    resourceType="higherStudies"
                    onSubmit={handleHigherStudiesResourceSubmit}
                    isLoading={isLoading}
                />
            )}

            {/* Placement CTC Form */}
            {contributionType === PLACEMENT_CTC && (
                <PlacementCTCForm
                    onSubmit={handlePlacementCTCSubmit}
                    isLoading={isLoading}
                />
            )}

            {/* Course Review Form */}
            {contributionType === COURSE_REVIEW && (
                <CourseReviewForm
                    onSubmit={handleCourseReviewSubmit}
                    isLoading={isLoading}
                />
            )}

            {/* Course Grading Form */}
            {contributionType === COURSE_GRADING && (
                <CourseGradingForm
                    onSubmit={handleCourseGradingSubmit}
                    isLoading={isLoading}
                    depts={depts}
                    filterDepartmentCodes={filterDepartmentCodes}
                />
            )}

            {/* PS Cutoff Forms */}
            {(contributionType === PS1_CUTOFF ||
                contributionType === PS2_CUTOFF) && (
                <PSCutoffForm
                    isPS1={contributionType === PS1_CUTOFF}
                    onSubmit={handlePSCutoffSubmit}
                    isLoading={isLoading}
                />
            )}
        </div>
    )
}
