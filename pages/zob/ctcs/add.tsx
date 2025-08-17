import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { placementYears } from '@/config/years_sems'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddPlacementCTCs() {
    const [name, setName] = useState('')
    const [campus, setCampus] = useState('')
    const [academicYear, setAcademicYear] = useState('')
    const [base, setBase] = useState(0)
    const [joiningBonus, setJoiningBonus] = useState(0)
    const [relocationBonus, setRelocationBonus] = useState(0)
    const [variableBonus, setVariableBonus] = useState(0)
    const [monetaryValueOfBenefits, setMonetaryValueOfBenefits] = useState(0)
    const [description, setDescription] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!name.trim()) {
            newErrors.name = 'Company name is required'
        }

        if (!campus) {
            newErrors.campus = 'Campus is required'
        }

        if (!academicYear) {
            newErrors.academicYear = 'Academic year is required'
        }

        if (base < 0) {
            newErrors.base = 'Base salary cannot be negative'
        }

        if (joiningBonus < 0) {
            newErrors.joiningBonus = 'Joining bonus cannot be negative'
        }

        if (relocationBonus < 0) {
            newErrors.relocationBonus = 'Relocation bonus cannot be negative'
        }

        if (variableBonus < 0) {
            newErrors.variableBonus = 'Variable bonus cannot be negative'
        }

        if (monetaryValueOfBenefits < 0) {
            newErrors.monetaryValueOfBenefits =
                'Benefits value cannot be negative'
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required'
        } else if (description.trim().length < 30) {
            newErrors.description =
                'Description should be at least 30 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const addPlacementCTC = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        setIsLoading(true)

        try {
            const res = await axiosInstance.post('/api/zob/ctcs/add', {
                company: name.trim(),
                campus: campus,
                academicYear: academicYear,
                base: base,
                joiningBonus: joiningBonus,
                relocationBonus: relocationBonus,
                variableBonus: variableBonus,
                monetaryValueOfBenefits: monetaryValueOfBenefits,
                description: description.trim(),
            })
            const data = res.data
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! CTC was added successfully!')
                // Reset form
                setName('')
                setCampus('')
                setAcademicYear('')
                setBase(0)
                setJoiningBonus(0)
                setRelocationBonus(0)
                setVariableBonus(0)
                setMonetaryValueOfBenefits(0)
                setDescription('')
                setErrors({})
            }
        } catch (error) {
            console.error('Error adding placement CTC:', error)
            toast.error('Failed to add CTC. Please try again.')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Meta {...getMetaConfig('zob/ctcs')} />

            <div className="min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary mb-2">
                            Add Placement CTC.
                        </h1>
                    </div>

                    <Menu />

                    {isLoading ? (
                        <div className="card bg-base-100 shadow-xl p-8">
                            <div className="flex items-center justify-center">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body space-y-6">
                                {/* Company Details Section */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-primary border-b pb-2">
                                        Company Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Company Name
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="Enter company name"
                                            />
                                            {errors.name && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.name}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Campus
                                                </span>
                                            </label>
                                            <AutoCompleter
                                                name="campus"
                                                items={[
                                                    'PS',
                                                    'Hyderabad',
                                                    'Pilani',
                                                    'Goa',
                                                    'Offcampus',
                                                ]}
                                                value={campus}
                                                onChange={(val) =>
                                                    setCampus(val)
                                                }
                                            />
                                            {errors.campus && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.campus}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Academic Year
                                                </span>
                                            </label>
                                            <AutoCompleter
                                                name="academic year"
                                                items={placementYears}
                                                value={academicYear}
                                                onChange={(val) =>
                                                    setAcademicYear(val)
                                                }
                                            />
                                            {errors.academicYear && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.academicYear}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-primary border-b pb-2">
                                        Compensation Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Base Salary
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className={`input input-bordered ${errors.base ? 'input-error' : ''}`}
                                                value={base}
                                                onChange={(e) =>
                                                    setBase(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                                min="0"
                                            />

                                            {errors.base && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.base}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Joining Bonus
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className={`input input-bordered ${errors.joiningBonus ? 'input-error' : ''}`}
                                                value={joiningBonus}
                                                onChange={(e) =>
                                                    setJoiningBonus(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                                min="0"
                                            />

                                            {errors.joiningBonus && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.joiningBonus}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Relocation Bonus
                                                </span>
                                            </label>

                                            <input
                                                type="number"
                                                className={`input input-bordered ${errors.relocationBonus ? 'input-error' : ''}`}
                                                value={relocationBonus}
                                                onChange={(e) =>
                                                    setRelocationBonus(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.relocationBonus && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.relocationBonus}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Variable Bonus
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                className={`input input-bordered ${errors.variableBonus ? 'input-error' : ''}`}
                                                value={variableBonus}
                                                onChange={(e) =>
                                                    setVariableBonus(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.variableBonus && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.variableBonus}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Monetary Value of Benefits
                                                </span>
                                            </label>

                                            <input
                                                type="number"
                                                className={`input input-bordered ${errors.monetaryValueOfBenefits ? 'input-error' : ''}`}
                                                value={monetaryValueOfBenefits}
                                                onChange={(e) =>
                                                    setMonetaryValueOfBenefits(
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.monetaryValueOfBenefits && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {
                                                            errors.monetaryValueOfBenefits
                                                        }
                                                    </span>
                                                </label>
                                            )}
                                            <label className="label">
                                                <span className="label-text-alt text-base-content/70">
                                                    Note: ESOPs are not counted
                                                    as monetary benefits. Only
                                                    stocks are counted.
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-primary border-b pb-2">
                                        Description
                                    </h2>
                                    <div className="form-control">
                                        <textarea
                                            className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                                            placeholder="Enter description of the role and the CTC for this role..."
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            value={description}
                                        ></textarea>

                                        {errors.description && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {errors.description}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-base-200 rounded-lg p-4 text-center">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Total CTC
                                    </h3>
                                    <p className="text-2xl font-bold text-primary">
                                        ₹
                                        {(
                                            base +
                                            joiningBonus +
                                            relocationBonus +
                                            variableBonus +
                                            monetaryValueOfBenefits
                                        ).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                <div className="card-actions justify-center mt-6">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={addPlacementCTC}
                                    >
                                        Submit CTC Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <CustomToastContainer containerId="addPlacementCTC" />
        </>
    )
}
