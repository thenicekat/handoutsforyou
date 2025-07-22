import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import CustomToastContainer from '@/components/ToastContainer'
import { departments } from '@/config/departments'
import { getMetaConfig } from '@/config/meta'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function AddResources() {
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [created_by, setCreatedBy] = useState('')
    const [category, setCategory] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const addResource = async () => {
        setIsLoading(true)
        if (departments[category] == undefined) {
            toast.error('Please select a valid category!')
            setIsLoading(false)
            return
        }
        const res = await fetch('/api/courses/resources/add', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                link: link,
                created_by: created_by,
                category: category,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (data.error) {
            toast.error(data.message)
        } else {
            toast.success('Thank you! Your resource was added successfully!')
            setName('')
            setLink('')
            setCreatedBy('')
            setCategory('')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Meta {...getMetaConfig('courses/resources')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Resources.
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
                            <label htmlFor="idNumber" className="text-primary">
                                Name of the Resource
                            </label>
                            <input
                                type="text"
                                id="idNumber"
                                className="input input-secondary"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label
                                htmlFor="yearAndSem"
                                className="text-primary"
                            >
                                Link
                            </label>
                            <input
                                type="text"
                                id="yearAndSem"
                                className="input input-secondary"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label htmlFor="createdBy" className="text-primary">
                                Created By
                            </label>
                            <input
                                type="text"
                                id="allotmentRound"
                                className="input input-secondary"
                                value={created_by}
                                onChange={(e) => setCreatedBy(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col w-3/4 justify-between m-1">
                            <label htmlFor="category" className="text-primary">
                                Category
                            </label>
                            <AutoCompleter
                                name="category"
                                items={Object.keys(departments)}
                                value={category}
                                onChange={(val) => setCategory(val)}
                            />
                        </div>

                        <div className="text-center flex-wrap w-3/4 justify-between m-1">
                            <button
                                className="btn btn-primary"
                                onClick={addResource}
                            >
                                Submit
                            </button>
                        </div>
                    </>
                </div>
            </div>
            <CustomToastContainer containerId="addResources" />
        </>
    )
}
