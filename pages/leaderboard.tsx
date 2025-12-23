import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { departments } from '@/config/departments'
import CourseGradingForm, {
    CourseGradingFormData,
} from '@/forms/CourseGradingForm'
import CourseReviewForm, {
    CourseReviewFormData,
} from '@/forms/CourseReviewForm'
import { FormField } from '@/forms/FormComponents'
import HandoutForm, { HandoutFormData } from '@/forms/HandoutForm'
import PSCutoffForm, { PSCutoffFormData } from '@/forms/PSCutoffForm'
import PSReviewForm, { PSReviewFormData } from '@/forms/PSReviewForm'
import PlacementCTCForm, {
    PlacementCTCFormData,
} from '@/forms/PlacementCTCForm'
import ResourceForm, { ResourceFormData } from '@/forms/ResourceForm'
import { PS1Item, PS2Item } from '@/types/PS'
import { axiosInstance } from '@/utils/axiosCache'
import { useEffect, useMemo, useState } from 'react'
import CountUp from 'react-countup'
import { toast } from 'react-toastify'

const COURSE_RESOURCE = 'course_resource'
const COURSE_HANDOUT = 'course_handout'
const COURSE_REVIEW = 'course_review'
const COURSE_GRADING = 'course_grading'
const PS1_CUTOFF = 'ps1_cutoff'
const PS2_CUTOFF = 'ps2_cutoff'
const PS1_REVIEW = 'ps1_review'
const PS2_REVIEW = 'ps2_review'
const PLACEMENT_RESOURCE = 'placement_resource'
const PLACEMENT_CTC = 'placement_ctc'
const HIGHERSTUDIES_RESOURCE = 'higherstudies_resource'

type ContributionType =
    | typeof COURSE_RESOURCE
    | typeof COURSE_REVIEW
    | typeof COURSE_GRADING
    | typeof PS1_CUTOFF
    | typeof PS2_CUTOFF
    | typeof PS1_REVIEW
    | typeof PS2_REVIEW
    | typeof PLACEMENT_RESOURCE
    | typeof PLACEMENT_CTC
    | typeof HIGHERSTUDIES_RESOURCE
    | typeof COURSE_HANDOUT

const CONTRIBUTION_DROP_DOWN = [
    { value: COURSE_RESOURCE, label: 'Course Resource' },
    { value: COURSE_HANDOUT, label: 'Course Handout' },
    { value: COURSE_REVIEW, label: 'Course Review' },
    { value: COURSE_GRADING, label: 'Course Grading' },
    { value: PS1_CUTOFF, label: 'PS1 Cutoff' },
    { value: PS2_CUTOFF, label: 'PS2 Cutoff' },
    { value: PS1_REVIEW, label: 'PS1 Review' },
    { value: PS2_REVIEW, label: 'PS2 Review' },
    { value: PLACEMENT_RESOURCE, label: 'Placement Resource' },
    { value: PLACEMENT_CTC, label: 'Placement CTC' },
    { value: HIGHERSTUDIES_RESOURCE, label: 'Higher Studies Resource' },
]

const contributionTypeLabels: Record<string, string> = {
    course_resource: 'Course Resources',
    course_handout: 'Course Handouts',
    course_review: 'Course Reviews',
    course_pyq: 'Course PYQs',
    ps1_cutoff: 'PS1 Cutoffs',
    ps2_cutoff: 'PS2 Cutoffs',
    placement_resource: 'Placement Resources',
    higherstudies_resource: 'Higher Studies Resources',
    course_grading: 'Course Grading',
    ps1_review: 'PS1 Reviews',
    ps2_review: 'PS2 Reviews',
    placement_ctc: 'Placement CTCs',
    si_company: 'SI Companies',
}

interface ContributionStats {
    total: number
    byType: Record<string, number>
    byUser: Record<string, number>
}

export default function LeaderboardPage() {
    const [stats, setStats] = useState<ContributionStats>({
        total: 0,
        byType: {},
        byUser: {},
    })
    const [isStatsLoading, setIsStatsLoading] = useState(true)

    const [contributionType, setContributionType] = useState<ContributionType>(
        CONTRIBUTION_DROP_DOWN[0]?.value as ContributionType
    )
    const [isLoading, setIsLoading] = useState(false)
    const [courseGradingResetTrigger, setCourseGradingResetTrigger] =
        useState(0)

    // PS Review state
    const [psUserResponses, setPsUserResponses] = useState<
        (PS1Item | PS2Item)[]
    >([])
    const [selectedPsResponse, setSelectedPsResponse] = useState<
        PS1Item | PS2Item | null
    >(null)
    const [isPsLoading, setIsPsLoading] = useState(false)

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/api/contributions/stats')
            if (!response.data.error) {
                setStats(response.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch contribution stats:', error)
        } finally {
            setIsStatsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    // Fetch PS responses when contribution type changes to PS review
    useEffect(() => {
        if (contributionType === PS1_REVIEW) {
            fetchPsUserResponses('ps1')
            setSelectedPsResponse(null)
        } else if (contributionType === PS2_REVIEW) {
            fetchPsUserResponses('ps2')
            setSelectedPsResponse(null)
        } else {
            setPsUserResponses([])
            setSelectedPsResponse(null)
        }
    }, [contributionType])

    const onContributionAdded = () => {
        fetchStats()
    }

    const depts = useMemo(() => {
        return Object.values(departments)
            .flatMap((code: string) => code.split('/'))
            .map(code => code.trim())
            .filter(code => code.length > 0)
    }, [])

    const filterDepartmentCodes = (course: string): string[] => {
        let values: string[] = []
        if (course !== '') {
            const allowed = course.split(' ')[0]
            values = depts.filter(code => allowed.includes(code))
            if (values.length === 1) {
                values = []
            }
        }
        values.push('ALL')
        return values
    }

    const handleCourseResourceSubmit = async (
        data: ResourceFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/resources/add',
                {
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your course resource was added successfully!'
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + error)
        }
        setIsLoading(false)
    }

    const handleHandoutSubmit = async (
        data: HandoutFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('course', data.course)
            formData.append('semester', data.semester)
            formData.append('file', data.file)

            const response = await fetch('/api/courses/handouts/add', {
                method: 'POST',
                body: formData,
            })

            const responseData = await response.json()

            if (!responseData.error) {
                toast.success(
                    'Thank you! Your handout was uploaded successfully!'
                )
                reset()
                onContributionAdded()
            } else {
                toast.error(responseData.message || 'Failed to upload handout')
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const handlePlacementResourceSubmit = async (
        data: ResourceFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/zob/resources/add',
                {
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your placement resource was added successfully!'
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const handleHigherStudiesResourceSubmit = async (
        data: ResourceFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/higherstudies/resources/add',
                {
                    name: data.name,
                    link: data.link,
                    created_by: data.createdBy,
                    category: data.category,
                }
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your higher studies resource was added successfully!'
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const handlePlacementCTCSubmit = async (
        data: PlacementCTCFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/zob/ctcs/add', {
                company: data.name,
                campus: data.campus,
                academicYear: data.academicYear,
                base: data.base,
                joiningBonus: data.joiningBonus,
                relocationBonus: data.relocationBonus,
                variableBonus: data.variableBonus,
                monetaryValueOfBenefits: data.monetaryValueOfBenefits,
                description: data.description,
            })
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your placement CTC was added successfully!'
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const handleCourseReviewSubmit = async (
        data: CourseReviewFormData,
        reset: () => void
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/reviews/add',
                {
                    course: data.course,
                    prof: data.prof,
                    review: data.review,
                }
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your course review was added successfully!'
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const handleCourseGradingSubmit = async (
        data: CourseGradingFormData,
        parsedData: string
    ) => {
        setIsLoading(true)
        try {
            const response = await axiosInstance.post(
                '/api/courses/grading/add',
                {
                    course: data.course,
                    dept: data.dept,
                    sem: data.semester,
                    prof: data.prof,
                    data: parsedData,
                    average_mark: data.averageMark,
                }
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    'Thank you! Your course grading data was added successfully!'
                )
                setCourseGradingResetTrigger(prev => prev + 1)
                onContributionAdded()
            }
        } catch (error) {
            toast.error(
                'An error occurred. ' + (error as any).response.data.message
            )
        }
        setIsLoading(false)
    }

    const handlePSCutoffSubmit = async (
        data: PSCutoffFormData,
        reset: () => void
    ) => {
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

            const response = await axiosInstance.post(
                '/api/ps/cutoffs/add',
                payload
            )
            if (response.data.error) {
                toast.error(response.data.message)
            } else {
                toast.success(
                    `Thank you! Your ${contributionType === PS1_CUTOFF ? 'PS1' : 'PS2'} cutoff was added successfully!`
                )
                reset()
                onContributionAdded()
            }
        } catch (error) {
            toast.error('An error occurred. ' + (error as Error).message)
        }
        setIsLoading(false)
    }

    const fetchPsUserResponses = async (psType: 'ps1' | 'ps2') => {
        setIsPsLoading(true)
        try {
            const response = await axiosInstance.get('/api/ps/cutoffs/my', {
                params: {
                    type: psType,
                },
            })

            if (response.status === 200) {
                const data = response.data
                if (!data.error) {
                    setPsUserResponses(data.data)
                } else {
                    toast.error(data.message)
                    setPsUserResponses([])
                }
            } else {
                toast.error('Failed to fetch your responses')
                setPsUserResponses([])
            }
        } catch (error) {
            console.error('Error fetching user responses:', error)
            toast.error('An error occurred while fetching your responses')
            setPsUserResponses([])
        } finally {
            setIsPsLoading(false)
        }
    }

    const handlePsResponseSelect = (response: PS1Item | PS2Item) => {
        setSelectedPsResponse(response)
    }

    const handlePSReviewSubmit = async (
        data: PSReviewFormData,
        reset: () => void
    ) => {
        if (!selectedPsResponse) {
            toast.error('Please select a PS response')
            return
        }

        setIsLoading(true)
        try {
            const psType = contributionType === PS1_REVIEW ? 'PS1' : 'PS2'
            const response = await axiosInstance.post('/api/ps/reviews/add', {
                type: psType,
                batch: selectedPsResponse.year_and_sem,
                station: selectedPsResponse.station,
                review: data.review,
                allotment_round: selectedPsResponse.allotment_round,
            })
            const res = response.data

            if (res.error) {
                toast.error(res.message)
            } else {
                toast.success(
                    `Thank you! Your ${psType} review was added successfully!`
                )
                reset()
                setSelectedPsResponse(null)
                setPsUserResponses([])
                onContributionAdded()
            }
        } catch (error) {
            console.error('Error adding review:', error)
            toast.error('Failed to add review')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Meta />
            <Menu doNotShowMenu={true} />

            <div className="container mx-auto px-4 pt-10 pb-4 flex items-center">
                <div className="w-full max-w-6xl mx-auto mt-8 px-4">
                    {/* Stats Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto mb-8">
                        {isStatsLoading ? (
                            <div className="text-center text-gray-300">
                                Loading contribution stats...
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                    🏆 Leaderboard
                                </h2>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                                        <span>
                                            Progress towards 10000 contributions
                                        </span>
                                        <span>
                                            {Math.min(stats.total, 10000)}/10000
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${Math.min((stats.total / 10000) * 100, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    {stats.total >= 10000 && (
                                        <div className="text-center mt-2 text-green-400 font-semibold">
                                            🎉 Goal achieved! Thank you for your
                                            contributions!
                                        </div>
                                    )}
                                </div>

                                {Object.keys(stats.byType).length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            Contribution Breakdown by Type
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {Object.entries(stats.byType).map(
                                                ([type, count]) => (
                                                    <div
                                                        key={type}
                                                        className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                                                    >
                                                        <span className="text-gray-300 text-sm">
                                                            {contributionTypeLabels[
                                                                type
                                                            ] || type}
                                                        </span>
                                                        <span className="text-white font-semibold">
                                                            <CountUp
                                                                end={count}
                                                                duration={1.5}
                                                            />
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* User Breakdown */}
                                {Object.keys(stats.byUser).length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-4">
                                            Top Contributors
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(stats.byUser)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 10)
                                                .map(
                                                    ([email, count], index) => {
                                                        let medal = ''
                                                        let medalClass = ''
                                                        if (index === 0) {
                                                            medal = '🥇'
                                                            medalClass =
                                                                'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30'
                                                        } else if (
                                                            index === 1
                                                        ) {
                                                            medal = '🥈'
                                                            medalClass =
                                                                'bg-gradient-to-r from-gray-600/20 to-gray-800/20 border-gray-800/30'
                                                        } else if (
                                                            index === 2
                                                        ) {
                                                            medal = '🥉'
                                                            medalClass =
                                                                'bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30'
                                                        } else {
                                                            medal = '📧'
                                                            medalClass =
                                                                'bg-white/5'
                                                        }

                                                        return (
                                                            <div
                                                                key={email}
                                                                className={`${medalClass} rounded-lg p-3 flex justify-between items-center ${index < 3 ? 'border' : ''}`}
                                                            >
                                                                <span className="text-gray-300 text-sm truncate mr-2 flex items-center gap-2">
                                                                    {medal && (
                                                                        <span className="text-lg">
                                                                            {
                                                                                medal
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {`${email}`}
                                                                </span>
                                                                <span className="text-white font-semibold">
                                                                    <CountUp
                                                                        end={
                                                                            count
                                                                        }
                                                                        duration={
                                                                            1.5
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                )}
                                        </div>
                                        {Object.keys(stats.byUser).length >
                                            10 && (
                                            <div className="text-center mt-4 text-gray-400 text-sm">
                                                Showing top 10 of{' '}
                                                {
                                                    Object.keys(stats.byUser)
                                                        .length
                                                }{' '}
                                                contributors
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
                        <FormField
                            label="What would you like to contribute?"
                            className="mb-6"
                        >
                            <select
                                value={contributionType}
                                onChange={e =>
                                    setContributionType(
                                        e.target.value as ContributionType
                                    )
                                }
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                {CONTRIBUTION_DROP_DOWN.map(option => (
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

                        {/* Course Handout Form */}
                        {contributionType === COURSE_HANDOUT && (
                            <HandoutForm
                                onSubmit={handleHandoutSubmit}
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
                                resetTrigger={courseGradingResetTrigger}
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

                        {/* PS Review Forms */}
                        {(contributionType === PS1_REVIEW ||
                            contributionType === PS2_REVIEW) && (
                            <PSReviewForm
                                isPS1={contributionType === PS1_REVIEW}
                                userResponses={psUserResponses}
                                selectedResponse={selectedPsResponse}
                                onResponseSelect={handlePsResponseSelect}
                                onSubmit={handlePSReviewSubmit}
                                isLoading={isPsLoading}
                                isSubmitting={isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>

            <CustomToastContainer containerId="leaderboard" />
        </>
    )
}
