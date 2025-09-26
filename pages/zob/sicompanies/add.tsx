import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { siYears } from '@/config/years_sems'
import { axiosInstance } from '@/utils/axiosCache'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddSICompany() {
    const [name, setName] = useState('')
    const [roles, setRoles] = useState('')
    const [year, setYear] = useState('')
    const [cgpaCutoff, setCgpaCutoff] = useState('')
    const [stipend, setStipend] = useState('')
    const [eligibility, setEligibility] = useState('')
    const [selects, setSelects] = useState('')
    const [otherDetails, setOtherDetails] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!name.trim()) {
            newErrors.name = 'Company name is required'
        }

        if (!roles.trim()) {
            newErrors.roles = 'Roles are required'
        }

        if (!year) {
            newErrors.year = 'Year is required'
        }

        if (!cgpaCutoff.trim()) {
            newErrors.cgpaCutoff = 'CGPA cutoff is required'
        }

        if (!stipend.trim()) {
            newErrors.stipend = 'Stipend information is required'
        }

        if (!eligibility.trim()) {
            newErrors.eligibility = 'Eligibility criteria is required'
        }

        if (!selects.trim()) {
            newErrors.selects = 'Number of selections is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const addSICompany = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        setIsLoading(true)

        try {
            const res = await axiosInstance.post('/api/zob/companies/add', {
                name: name.trim(),
                roles: roles.trim(),
                year: year,
                cgpaCutoff: cgpaCutoff.trim(),
                stipend: stipend.trim(),
                eligibility: eligibility.trim(),
                selects: selects.trim(),
                otherDetails: otherDetails.trim(),
            })
            const data = res.data
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! SI Company was added successfully!')
                // Reset form
                setName('')
                setRoles('')
                setYear('')
                setCgpaCutoff('')
                setStipend('')
                setEligibility('')
                setSelects('')
                setOtherDetails('')
                setErrors({})
            }
        } catch (error) {
            console.error('Error adding SI company:', error)
            toast.error('Failed to add SI company. Please try again.')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Meta {...getMetaConfig('si')} />

            <div className="min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary mb-2">
                            Add SI Company.
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
                                                    Roles
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`input input-bordered ${errors.roles ? 'input-error' : ''}`}
                                                value={roles}
                                                onChange={(e) =>
                                                    setRoles(e.target.value)
                                                }
                                                placeholder="Enter available roles"
                                            />
                                            {errors.roles && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.roles}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Year
                                                </span>
                                            </label>
                                            <AutoCompleter
                                                name="year"
                                                items={siYears}
                                                value={year}
                                                onChange={(val) =>
                                                    setYear(val)
                                                }
                                            />
                                            {errors.year && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.year}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    CGPA Cutoff
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`input input-bordered ${errors.cgpaCutoff ? 'input-error' : ''}`}
                                                value={cgpaCutoff}
                                                onChange={(e) =>
                                                    setCgpaCutoff(e.target.value)
                                                }
                                                placeholder="e.g., 7.5 or Above 8.0"
                                            />
                                            {errors.cgpaCutoff && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.cgpaCutoff}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Internship Details Section */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-primary border-b pb-2">
                                        Internship Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Stipend
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`input input-bordered ${errors.stipend ? 'input-error' : ''}`}
                                                value={stipend}
                                                onChange={(e) =>
                                                    setStipend(e.target.value)
                                                }
                                                placeholder="e.g., ₹25,000/month or Unpaid"
                                            />
                                            {errors.stipend && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.stipend}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Number of Selections
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`input input-bordered ${errors.selects ? 'input-error' : ''}`}
                                                value={selects}
                                                onChange={(e) =>
                                                    setSelects(e.target.value)
                                                }
                                                placeholder="e.g., 5-10 or TBD"
                                            />
                                            {errors.selects && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.selects}
                                                    </span>
                                                </label>
                                            )}
                                        </div>

                                        <div className="form-control md:col-span-2">
                                            <label className="label">
                                                <span className="label-text">
                                                    Eligibility Criteria
                                                </span>
                                            </label>
                                            <textarea
                                                className={`textarea textarea-bordered h-24 ${errors.eligibility ? 'textarea-error' : ''}`}
                                                placeholder="Enter eligibility criteria (e.g., Branch requirements, academic performance, etc.)"
                                                onChange={(e) =>
                                                    setEligibility(e.target.value)
                                                }
                                                value={eligibility}
                                            ></textarea>
                                            {errors.eligibility && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {errors.eligibility}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-primary border-b pb-2">
                                        Additional Information
                                    </h2>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                Other Details (Optional)
                                            </span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-32"
                                            placeholder="Any other relevant information about the internship, company culture, work location, etc."
                                            onChange={(e) =>
                                                setOtherDetails(e.target.value)
                                            }
                                            value={otherDetails}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="card-actions justify-center mt-6">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={addSICompany}
                                    >
                                        Submit SI Company Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <CustomToastContainer containerId="addSICompany" />
        </>
    )
}
