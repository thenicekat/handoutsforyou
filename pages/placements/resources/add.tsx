import Head from 'next/head'
import { useState } from 'react'
import Menu from '@/components/Menu'
import { toast } from 'react-toastify'
import CustomToastContainer from '@/components/ToastContainer'
import AutoCompleter from '@/components/AutoCompleter'
import { higherStudiesCategories } from '@/data/higherstudies'
import { axiosInstance } from '@/utils/axiosCache'

export default function AddPlacementResources() {
    const [name, setName] = useState('')
    const [link, setLink] = useState('')
    const [created_by, setCreatedBy] = useState('')
    const [category, setCategory] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const addResource = async () => {
        setIsLoading(true)
        if (higherStudiesCategories.indexOf(category) == -1) {
            toast.error('Please select a valid category!')
            setIsLoading(false)
            return
        }
        try {
            const res = await axiosInstance.post('/api/placements/resources/add', {
                name: name,
                link: link,
                created_by: created_by,
                category: category,
            })
            const data = res.data
            if (data.error) {
                toast.error(data.message)
            } else {
                toast.success('Thank you! Your resource was added successfully!')
                setName('')
                setLink('')
                setCreatedBy('')
                setCategory('')
            }
        } catch (error) {
            console.error('Error adding placement resource:', error)
            toast.error('Failed to add resource')
        }
        setIsLoading(false)
    }

    return (
        <>
            <Head>
                <title>Placement Resources.</title>
                <meta
                    name="description"
                    content="One stop place for your PS queries, handouts, and much more"
                />
                <meta
                    name="keywords"
                    content="BITS Pilani, Handouts, BPHC, Hyderabad Campus, BITS Hyderabad, BITS, Pilani, Handouts for you, handouts, for, you, bits, birla, institute, bits hyd, academics, practice school, ps, queries, ps cutoffs, ps2, ps1"
                />
                <meta name="robots" content="index, follow" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                                items={higherStudiesCategories}
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
            <CustomToastContainer containerId="addPlacementResources" />
        </>
    )
}
