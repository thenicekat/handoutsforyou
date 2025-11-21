import AutoCompleter from '@/components/AutoCompleter'
import Menu from '@/components/Menu'
import Meta from '@/components/Meta'
import MonetagAd from '@/components/MonetagAd'
import CustomToastContainer from '@/components/ToastContainer'
import { getMetaConfig } from '@/config/meta'
import { profs } from '@/config/profs'
import { useState } from 'react'

export default function Chambers() {
    const [prof, setProf] = useState('')

    return (
        <>
            <Meta {...getMetaConfig('chambers')} />

            <MonetagAd
                adFormat="interstitial-banner"
                id="monetag-interstitial-banner-inline-chambers"
            />

            {/* Search box */}
            <div className="grid place-items-center">
                <div className="w-[70vw] place-items-center flex flex-col justify-between">
                    <h1 className="text-4xl pt-[50px] pb-[20px] px-[35px] text-primary">
                        Professor Chambers.
                    </h1>

                    <Menu />

                    <>
                        <AutoCompleter
                            name={'Prof'}
                            items={profs.map(p => p.name)}
                            value={prof}
                            onChange={val => setProf(val)}
                        />
                        <span className="m-2"></span>
                    </>
                </div>
            </div>
            <div>
                <div className="flex justify-center">
                    <h1 className="text-lg text-primary m-5 max-w-2xl">
                        This is a list of all the professors of hyderabad campus
                        and their chamber numbers. If you would like to correct
                        the information here, please contact us.
                    </h1>
                </div>

                <div className="grid md:grid-cols-3 place-items-center p-5 gap-4">
                    {profs
                        .sort((a, b) => {
                            if (a.name > b.name) return 1
                            else if (a.name < b.name) return -1
                            else return 0
                        })
                        .filter(p =>
                            p.name.toLowerCase().includes(prof.toLowerCase())
                        )
                        .map(prof => (
                            <div
                                className="card shadow-lg bg-base-100 break-words text-base-content w-full"
                                key={prof.name}
                            >
                                <div className="card-body">
                                    <h2 className="card-title text-center text-lg">
                                        {prof.name}
                                    </h2>
                                    <p
                                        className={`text-sm ${prof.chamber === 'Unavailable' ? 'italic' : ''} text-right`}
                                    >
                                        {prof.chamber}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <CustomToastContainer containerId="profChambers" />
        </>
    )
}
