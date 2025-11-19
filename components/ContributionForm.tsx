import AutoCompleter from '@/components/AutoCompleter'
import { departments } from '@/config/departments'
import { courses } from '@/config/courses'
import { profs } from '@/config/profs'
import { ps1Years, ps2Semesters, psAllotmentRounds } from '@/config/years_sems'
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
            {/* Contribution Type Selector */}
            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    What would you like to contribute?
                </label>
                <select
                    value={contributionType}
                    onChange={(e) => setContributionType(e.target.value as ContributionType)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                    {contributionTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-gray-800">
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dynamic Form Fields */}
            {(contributionType === COURSE_RESOURCE || contributionType === PLACEMENT_RESOURCE || contributionType === HIGHERSTUDIES_RESOURCE) && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Resource Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter resource name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Link *
                        </label>
                        <input
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            value={createdBy}
                            onChange={(e) => setCreatedBy(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Category *
                        </label>
                        {contributionType === COURSE_RESOURCE ? (
                            <AutoCompleter
                                items={Object.keys(departments)}
                                value={category}
                                onChange={setCategory}
                                name="department"
                            />
                        ) : (
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                placeholder="Enter category"
                            />
                        )}
                    </div>
                </>
            )}

            {contributionType === COURSE_REVIEW && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Course *
                        </label>
                        <AutoCompleter
                            items={courses}
                            value={course}
                            onChange={setCourse}
                            name="course"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Professor *
                        </label>
                        <AutoCompleter
                            items={profs.map(p => p.name)}
                            value={prof}
                            onChange={setProf}
                            name="professor"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Review *
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Write your review..."
                        />
                    </div>
                </>
            )}

            {(contributionType === PS1_CUTOFF || contributionType === PS2_CUTOFF) && (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            ID Number *
                        </label>
                        <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter your 13-digit ID number"
                            maxLength={13}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            {contributionType === PS1_CUTOFF ? 'Batch *' : 'Year and Semester *'}
                        </label>
                        <select
                            value={yearAndSem}
                            onChange={(e) => setYearAndSem(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="" className="bg-gray-800">
                                {contributionType === PS1_CUTOFF ? 'Select Batch' : 'Select Year and Semester'}
                            </option>
                            {contributionType === PS1_CUTOFF 
                                ? ps1Years.map((year) => (
                                    <option key={year} value={year} className="bg-gray-800">
                                        {year}
                                    </option>
                                ))
                                : ps2Semesters.map((semester) => (
                                    <option key={semester} value={semester} className="bg-gray-800">
                                        {semester}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Station *
                        </label>
                        <input
                            type="text"
                            value={station}
                            onChange={(e) => setStation(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter station name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                CGPA *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                value={cgpa}
                                onChange={(e) => setCgpa(e.target.value)}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Preference *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={preference}
                                onChange={(e) => setPreference(e.target.value)}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Allotment Round *
                        </label>
                        <select
                            value={allotmentRound}
                            onChange={(e) => setAllotmentRound(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <option value="" className="bg-gray-800">Select Round</option>
                            {psAllotmentRounds.map((round) => (
                                <option key={round} value={round} className="bg-gray-800">
                                    {round}
                                </option>
                            ))}
                        </select>
                    </div>

                    {contributionType === PS2_CUTOFF && (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Stipend (₹) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1200000"
                                    value={stipend}
                                    onChange={(e) => setStipend(e.target.value)}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="Enter stipend amount"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Offshoot *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={offshoot}
                                        onChange={(e) => setOffshoot(e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Offshoot Total *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={offshootTotal}
                                        onChange={(e) => setOffshootTotal(e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Offshoot Type *
                                    </label>
                                    <input
                                        type="text"
                                        value={offshootType}
                                        onChange={(e) => setOffshootType(e.target.value)}
                                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        placeholder="Type"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mb-4">
                        <label className="flex items-center text-gray-300">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="mr-2 rounded"
                            />
                            Make this data public (helps other students)
                        </label>
                    </div>
                </>
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
