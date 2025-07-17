import { getMetaConfig } from '@/utils/meta-config';
import Meta from '@/components/Meta';
import { useState } from 'react'
import Menu from '@/components/Menu'
import CustomToastContainer from '@/components/ToastContainer'
import { toast } from 'react-toastify'
import {
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers,
} from 'obscenity'

export default function AddReview() {
    const [rant, setRant] = useState('')
    const [isPublic, setIsPublic] = useState(true)

    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    })

    const AddRant = async () => {
        if (rant == '') {
            toast.error('Please fill rant!')
            return
        }
        if (matcher.hasMatch(rant)) {
            toast.warn('Your rant contains profanities!')
            return
        }

        const data = await fetch('/api/rants/add', {
            method: 'POST',
            body: JSON.stringify({ rant: rant, isPublic: isPublic }),
            headers: { 'Content-Type': 'application/json' },
        })
        const res = await data.json()
        if (res.error) {
            toast.error(res.message)
        } else {
            toast.success('Rant Added!')
            setRant('')
            window.location.href = '/rants'
        }
    }

    return (
        <>
            <Meta {...getMetaConfig('rants')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Rant away.
                    </h1>

                    <Menu />

                    <div className="text-center w-full m-2 h-60">
                        <textarea
                            className="textarea textarea-primary w-full max-w-xl h-full"
                            placeholder="Do rr..."
                            onChange={(e) => setRant(e.target.value)}
                            value={rant}
                        ></textarea>
                    </div>

                    <div className="text-center flex-wrap w-3/4 justify-between m-1">
                        <label className="text-primary">Make it Public? </label>
                        <input
                            type="checkbox"
                            onChange={(e) => setIsPublic(e.target.checked)}
                            checked={isPublic}
                        />
                        <br />

                        <button
                            className="btn btn-primary my-2"
                            onClick={AddRant}
                        >
                            Add Rant
                        </button>
                    </div>
                </div>
            </div>
            <CustomToastContainer containerId="addRant" />
        </>
    );
}
