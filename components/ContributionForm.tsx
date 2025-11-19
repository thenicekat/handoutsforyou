import CourseReviewForm, {
    CourseReviewFormData,
} from '@/components/forms/CourseReviewForm'
import { FormField } from '@/components/forms/FormComponents'
import PSCutoffForm, { PSCutoffFormData } from '@/components/forms/PSCutoffForm'
import ResourceForm, { ResourceFormData } from '@/components/forms/ResourceForm'
import { useState } from 'react'
import { toast } from 'react-toastify'

// Contribution Type Constants
const COURSE_RESOURCE = 'course_resource'
const COURSE_REVIEW = 'course_review'
const PS1_CUTOFF = 'ps1_cutoff'
const PS2_CUTOFF = 'ps2_cutoff'
const PLACEMENT_RESOURCE = 'placement_resource'
const HIGHERSTUDIES_RESOURCE = 'higherstudies_resource'

type ContributionType =
    | typeof COURSE_RESOURCE
    | typeof COURSE_REVIEW
    | typeof PS1_CUTOFF
    | typeof PS2_CUTOFF
    | typeof PLACEMENT_RESOURCE
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

    const handlePlacementResourceSubmit = async (
        data: ResourceFormData
    ) => {
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
        { value: PS1_CUTOFF, label: 'PS1 Cutoff' },
        { value: PS2_CUTOFF, label: 'PS2 Cutoff' },
        { value: PLACEMENT_RESOURCE, label: 'Placement Resource' },
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

            {/* Course Review Form */}
            {contributionType === COURSE_REVIEW && (
                <CourseReviewForm
                    onSubmit={handleCourseReviewSubmit}
                    isLoading={isLoading}
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
