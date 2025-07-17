import { getMetaConfig } from '@/config/meta';
import Meta from '@/components/Meta';
import { useState } from 'react'
import Menu from '@/components/Menu'
import { useSession } from 'next-auth/react'
import { profs } from '@/config/profs'
import AutoCompleter from '@/components/AutoCompleter'
import CustomToastContainer from '@/components/ToastContainer'
import { Professor } from '@/types/Professor'

export default function Chambers() {
    const [prof, setProf] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const [chambers, setChamber] = useState(profs as Professor[])

    const { data: session } = useSession()

    return (
        <>
            <Meta {...getMetaConfig('chambers')} />
            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Professor Chambers.
                    </h1>

                    <Menu />

                    {session && (
                        <>
                            <AutoCompleter
                                name={'Prof'}
                                items={profs.map((p) => p.name)}
                                value={prof}
                                onChange={(val) => setProf(val)}
                            />
                            <span className="m-2"></span>
                        </>
                    )}
                </div>
            </div>
            {session && (
                <div>
                    <div className="flex justify-center">
                        <h1 className="text-lg text-primary m-5 max-w-2xl">
                            This is a list of all the professors of hyderabad
                            campus and their chamber numbers. If you would like
                            to correct the information here, please contact us.
                        </h1>
                    </div>

                    <div className="grid md:grid-cols-3 place-items-center p-5 gap-4">
                        {!isLoading ? (
                            chambers
                                .sort((a, b) => {
                                    if (a.name > b.name) return 1
                                    else if (a.name < b.name) return -1
                                    else return 0
                                })
                                .filter((p) =>
                                    p.name
                                        .toLowerCase()
                                        .includes(prof.toLowerCase())
                                )
                                .map((chamber) => (
                                    <div
                                        className="card shadow-lg bg-base-100 break-words text-base-content w-full"
                                        key={chamber.name}
                                    >
                                        <div className="card-body">
                                            <h2 className="card-title text-center text-lg">
                                                {chamber.name}
                                            </h2>
                                            <p
                                                className={`text-sm ${chamber.chamber === 'Unavailable' ? 'italic' : ''} text-right`}
                                            >
                                                {chamber.chamber}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="flex justify-center">
                                <h1 className="text-3xl text-primary">
                                    Loading...
                                </h1>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <CustomToastContainer containerId="courseReviews" />
        </>
    );
}
