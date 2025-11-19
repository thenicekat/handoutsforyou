import { FormField, SelectInput } from '@/components/FormField'
import ResourceForm from '@/components/forms/ResourceForm'
import CourseReviewForm from '@/components/forms/CourseReviewForm'
import PSCutoffForm from '@/components/forms/PSCutoffForm'
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

export default function ContributionForm({ onContributionAdded }: ContributionFormProps) {
    const [contributionType, setContributionType] = useState<ContributionType>(COURSE_RESOURCE)
    const [isLoading, setIsLoading] = useState(false)

    // Common fields
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [createdBy, setCreatedBy] = useState('')
    const [category, setCategory] = useState('')

    // Course review specific
    const [course, setCourse] = useState('')
    const [prof, setProf] = useState('')
    const [review, setReview] = useState('')

    // PS cutoff specific
    const [idNumber, setIdNumber] = useState('')
    const [yearAndSem, setYearAndSem] = useState('')
    const [station, setStation] = useState('')
    const [cgpa, setCgpa] = useState('')
    const [preference, setPreference] = useState('')
    const [allotmentRound, setAllotmentRound] = useState('')
    const [stipend, setStipend] = useState('')
    const [offshoot, setOffshoot] = useState('')
    const [offshootTotal, setOffshootTotal] = useState('')
    const [offshootType, setOffshootType] = useState('')
    const [isPublic, setIsPublic] = useState(true)

    const resetForm = () => {
        setName('')
        setLink('')
        setCreatedBy('')
        setCategory('')
        setCourse('')
        setProf('')
        setReview('')
        setIdNumber('')
        setYearAndSem('')
        setStation('')
        setCgpa('')
        setPreference('')
        setAllotmentRound('')
        setStipend('')
        setOffshoot('')
        setOffshootTotal('')
        setOffshootType('')
        setIsPublic(true)
    }

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            let endpoint = ''
            let payload = {}

            switch (contributionType) {
                case COURSE_RESOURCE:
                    if (!name || !link || !createdBy || !category) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/courses/resources/add'
                    payload = { name, link, created_by: createdBy, category }
                    break

                case COURSE_REVIEW:
                    if (!course || !prof || !review) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/courses/reviews/add'
                    payload = { course, prof, review }
                    break

                case PS1_CUTOFF:
                    if (!idNumber || !yearAndSem || !station || !cgpa || !preference || !allotmentRound) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/ps/cutoffs/add'
                    payload = {
                        typeOfPS: 'ps1',
                        idNumber,
                        yearAndSem,
                        station,
                        cgpa: parseFloat(cgpa),
                        preference: parseInt(preference),
                        allotmentRound,
                        public: isPublic ? 1 : 0
                    }
                    break

                case PS2_CUTOFF:
                    if (!idNumber || !yearAndSem || !station || !cgpa || !preference || !allotmentRound || !stipend || !offshoot || !offshootTotal || !offshootType) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/ps/cutoffs/add'
                    payload = {
                        typeOfPS: 'ps2',
                        idNumber,
                        yearAndSem,
                        station,
                        cgpa: parseFloat(cgpa),
                        preference: parseInt(preference),
                        allotmentRound,
                        stipend: parseInt(stipend),
                        offshoot: parseInt(offshoot),
                        offshootTotal: parseInt(offshootTotal),
                        offshootType,
                        public: isPublic ? 1 : 0
                    }
                    break

                case PLACEMENT_RESOURCE:
                    if (!name || !link || !createdBy || !category) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/zob/resources/add'
                    payload = { name, link, created_by: createdBy, category }
                    break

                case HIGHERSTUDIES_RESOURCE:
                    if (!name || !link || !createdBy || !category) {
                        toast.error('Please fill all required fields')
                        setIsLoading(false)
                        return
                    }
                    endpoint = '/api/higherstudies/resources/add'
                    payload = { name, link, created_by: createdBy, category }
                    break
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await res.json()
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! Your contribution was added successfully!')
                resetForm()
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
            <FormField label="What would you like to contribute?" className="mb-6">
                <SelectInput
                    value={contributionType}
                    onChange={(value) => setContributionType(value as ContributionType)}
                    options={contributionTypes}
                    placeholder="Select contribution type"
                />
            </FormField>

            {/* Resource Forms */}
            {(contributionType === COURSE_RESOURCE || contributionType === PLACEMENT_RESOURCE || contributionType === HIGHERSTUDIES_RESOURCE) && (
                <ResourceForm
                    name={name}
                    setName={setName}
                    link={link}
                    setLink={setLink}
                    createdBy={createdBy}
                    setCreatedBy={setCreatedBy}
                    category={category}
                    setCategory={setCategory}
                    isCourseDepartment={contributionType === COURSE_RESOURCE}
                />
            )}

            {/* Course Review Form */}
            {contributionType === COURSE_REVIEW && (
                <CourseReviewForm
                    course={course}
                    setCourse={setCourse}
                    prof={prof}
                    setProf={setProf}
                    review={review}
                    setReview={setReview}
                />
            )}

            {/* PS Cutoff Forms */}
            {(contributionType === PS1_CUTOFF || contributionType === PS2_CUTOFF) && (
                <PSCutoffForm
                    isPS1={contributionType === PS1_CUTOFF}
                    idNumber={idNumber}
                    setIdNumber={setIdNumber}
                    yearAndSem={yearAndSem}
                    setYearAndSem={setYearAndSem}
                    station={station}
                    setStation={setStation}
                    cgpa={cgpa}
                    setCgpa={setCgpa}
                    preference={preference}
                    setPreference={setPreference}
                    allotmentRound={allotmentRound}
                    setAllotmentRound={setAllotmentRound}
                    stipend={stipend}
                    setStipend={setStipend}
                    offshoot={offshoot}
                    setOffshoot={setOffshoot}
                    offshootTotal={offshootTotal}
                    setOffshootTotal={setOffshootTotal}
                    offshootType={offshootType}
                    setOffshootType={setOffshootType}
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                />
            )}

            <div className="flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Contributing...' : 'Contribute'}
                </button>
            </div>
        </div>
    )
}
