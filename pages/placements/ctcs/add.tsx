import { getMetaConfig } from '@/config/meta';
import Meta from '@/components/Meta';
import { useState } from 'react'
import Menu from '@/components/Menu'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import AutoCompleter from '@/components/AutoCompleter'
import { placementYears } from '@/config/years_sems'

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

    const addPlacementCTC = async () => {
        setIsLoading(true)

        const res = await fetch('/api/placements/ctcs/add', {
            method: 'POST',
            body: JSON.stringify({
                company: name,
                campus: campus,
                academicYear: academicYear,
                base: base,
                joiningBonus: joiningBonus,
                relocationBonus: relocationBonus,
                variableBonus: variableBonus,
                monetaryValueOfBenefits: monetaryValueOfBenefits,
                description: description,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (data.error) {
            toast.error(data.message)
        } else {
            toast.success('Thank you! CTC was added successfully!')
            setName('')
            setCampus('')
            setAcademicYear('')
            setBase(0)
            setJoiningBonus(0)
            setRelocationBonus(0)
            setVariableBonus(0)
            setMonetaryValueOfBenefits(0)
            setDescription('')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Meta {...getMetaConfig('placements/ctcs')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Placement CTCs.
                    </h1>
                    <Menu />
                    isLoading ?
                    <>
                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label className="text-primary">Loading...</label>
                        </div>
                    </>
                    :
                    <>
                        {/* Take input */}
                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label htmlFor="name" className="text-primary">
                                Name of the Company
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="input input-secondary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label htmlFor="campus" className="text-primary">
                                Campus
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
                                onChange={(val) => setCampus(val)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="academic year"
                                className="text-primary"
                            >
                                Academic Year
                            </label>
                            <AutoCompleter
                                name="academic year"
                                items={placementYears}
                                value={academicYear}
                                onChange={(val) => setAcademicYear(val)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label htmlFor="base" className="text-primary">
                                Base
                            </label>
                            <input
                                type="number"
                                id="base"
                                className="input input-secondary"
                                value={base}
                                onChange={(e) =>
                                    setBase(parseInt(e.target.value))
                                }
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="joiningBonus"
                                className="text-primary"
                            >
                                Joining Bonus
                            </label>
                            <input
                                type="number"
                                id="joiningBonus"
                                className="input input-secondary"
                                value={joiningBonus}
                                onChange={(e) =>
                                    setJoiningBonus(parseInt(e.target.value))
                                }
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="relocationBonus"
                                className="text-primary"
                            >
                                Relocation Bonus
                            </label>
                            <input
                                type="number"
                                id="relocationBonus"
                                className="input input-secondary"
                                value={relocationBonus}
                                onChange={(e) =>
                                    setRelocationBonus(parseInt(e.target.value))
                                }
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="variableBonus"
                                className="text-primary"
                            >
                                Variable Bonus
                            </label>
                            <input
                                type="number"
                                id="variableBonus"
                                className="input input-secondary"
                                value={variableBonus}
                                onChange={(e) =>
                                    setVariableBonus(parseInt(e.target.value))
                                }
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="monetaryValueOfBenefits"
                                className="text-primary"
                            >
                                Monetary Value of Benefits
                            </label>
                            <input
                                type="number"
                                id="monetaryValueOfBenefits"
                                className="input input-secondary"
                                value={monetaryValueOfBenefits}
                                onChange={(e) =>
                                    setMonetaryValueOfBenefits(
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                            <p>
                                NOTE: ESOPs do not count as monetary benefits
                                for the sake of uniformity on this page.
                            </p>
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="description"
                                className="text-primary"
                            >
                                Description
                            </label>
                            <div className="text-center w-full m-2 h-60">
                                <textarea
                                    className="textarea w-full h-full"
                                    placeholder="Enter your Description..."
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    value={description}
                                ></textarea>
                            </div>
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button
                                className="btn btn-primary"
                                onClick={addPlacementCTC}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                </div>
            </div>
            <CustomToastContainer containerId="addPlacementCTC" />
        </>
    );
}
